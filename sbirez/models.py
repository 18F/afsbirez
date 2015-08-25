import hashlib
import re
import shlex

from django.db import models
from django.utils import timezone
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager
from django.conf import settings
from custom_user.models import AbstractEmailUser
from rest_framework import serializers
from django_pgjson.fields import JsonField

from sbirez import validation_helpers

class Address(models.Model):
    street = models.TextField()
    street2 = models.TextField(null=True, blank=True)
    city = models.TextField()
    state = models.TextField()
    zip = models.TextField()

    def __str__(self):
        street = self.street
        if self.street2:
            street = '%s\n%s' % self.street2
        return '%s\n%s, %s %s' % (
            street, self.city, self.state, self.zip)


class Person(models.Model):
    name = models.TextField()
    title = models.TextField(null=True, blank=True)
    email = models.TextField(null=True, blank=True)
    phone = models.TextField(null=True, blank=True)
    fax = models.TextField(null=True, blank=True)

class Firm(models.Model):
    name = models.TextField(unique=True)
    tax_id = models.TextField(unique=True, blank=True, null=True)
    sbc_id = models.TextField(unique=True, blank=True, null=True)
    duns_id = models.TextField(unique=True, blank=True, null=True)
    cage_code = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)
    address = models.ForeignKey(Address, null=True, blank=True)
    point_of_contact = models.ForeignKey(Person, null=True, blank=True)
    founding_year = models.IntegerField(null=True, blank=True)
    phase1_count = models.IntegerField(null=True, blank=True)
    phase1_year = models.IntegerField(null=True, blank=True)
    phase2_count = models.IntegerField(null=True, blank=True)
    phase2_year = models.IntegerField(null=True, blank=True)
    phase2_employees = models.IntegerField(null=True, blank=True)
    current_employees = models.IntegerField(null=True, blank=True)
    patent_count = models.IntegerField(null=True, blank=True)
    total_revenue_range = models.TextField(null=True, blank=True)
    revenue_percent = models.IntegerField(null=True, blank=True)

    @property
    def complete(self):
        return bool(
            self.name and
            self.sbc_id and
            self.duns_id and
            self.cage_code and
            self.website and
            self.address and
            self.point_of_contact and
            self.founding_year and
            (self.phase1_count is not None) and
            self.phase1_year  and
            (self.phase2_count is not None) and
            self.phase2_year and
            (self.phase2_employees is not None) and
            (self.current_employees is not None) and
            (self.patent_count is not None) and
            self.total_revenue_range and
            (self.revenue_percent is not None) and
            self.point_of_contact and
            self.point_of_contact.name and
            self.point_of_contact.title and
            self.point_of_contact.email and
            self.point_of_contact.phone and
            self.point_of_contact.name )

    def __str__(self):
        return self.name

class Naics(models.Model):
    code = models.TextField(primary_key=True)
    description = models.TextField(null=False)
    firms = models.ManyToManyField('Firm', blank=True, null=True,
                                   related_name='naics')

    def __str__(self):
        return "%s (%s)" % (self.code, self.description)

class SbirezUser(AbstractEmailUser):
    name = models.TextField()
    firm = models.ForeignKey(Firm, null=True, blank=True)
    password_expires = models.DateTimeField(null=True)

class PasswordHistory(models.Model):
    user = models.ForeignKey(SbirezUser, related_name='prior_passwords')
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

class Area(models.Model):
    area = models.TextField(unique=True)
    topics = models.ManyToManyField('Topic', blank=True, null=True, related_name='areas')

class Keyword(models.Model):
    keyword = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    topics = models.ManyToManyField('Topic', blank=True, null=True, related_name='keywords')

class Phase(models.Model):
    phase = models.TextField()
    topic = models.ForeignKey('Topic', related_name='phases')

class Reference(models.Model):
    reference = models.TextField()
    topic = models.ForeignKey('Topic', related_name='references')

def _walk_path(dct, path):
    if path:
        step = path.pop(0)
        if step:
            dct = dct[step]
            return _walk_path(dct, path)
    else:
        return dct


def _to_number(val):
    """
    Convert to a numeric data type, but only if
    possible (do not throw error)

    >>> _to_number('5.4')
    5.4
    >>> _to_number(5.4)
    5.4
    >>> _to_number('-6')
    -6
    >>> _to_number('R2D2')
    'R2D2'
    """
    try:
        if val.is_integer():  # passed as int in float form
            return int(val)
    except AttributeError:
        try:
            return int(val)
        except ValueError:
            try:
                return float(val)
            except ValueError:
                return val


class Element(models.Model):
    """
    Individual questions for a form, or nestable containers to hold
    other elements.

    ``element_type``s in use:

    Simple Python types
    -------------------
    bool
    float
    int

    Scalar types implying specific formats
    --------------------------------------
    checkbox
    dollars
    email
    file_upload
    integer_spans    (example: "4-6, 8, 12-16")
    percentage
    phone
    read_only_text
    timespan
    text

    short_str
    long_str
    med_str

    Composite types
    ---------------
    group
    line_item
    workflow

    The ``multiplicity`` field has a special meaning.  In the submitted
    results, a grouping element with a multiplicity should appear multiple times...
    - as a list, if ``multiplicity`` is an integer; the integer is the number of
    empty slots to suggest for filling
    - as a dictionary, if ``multiplicity`` is a comma-separated list of terms;
    the terms should be the dictionary keys, and instances of the element are the values.

    For example:

    name: fleet
    multiplicity: 2
    children:
    -
      name: model
      element_type: med_str
    -
      name: quantity
      element_type: integer

    could produce

    {"fleet": [ {"model": "X-wing", "quantity": 200},
                {"model": "Y-wing", "quantity": 300} ]

    whereas:

    name: fleet
    multiplicity: X-wing, Y-wing, A-wing
    children:
    -
      name: quantity
      element_type: integer

    could produce

    {"fleet" {"X-wing": {"quantity": 200},
              "Y-wing": {"quantity": 300},
              "A-wing": {"quantity": 100} } }

    """
    name = models.TextField(blank=False)
    human = models.TextField(null=True, blank=True)
    report_text = models.TextField(null=True, blank=True)
    validation = models.TextField(null=True, blank=True)
    element_type = models.TextField(default='str')
    # workflow, group, line_item, read_only_text, or scalar type
    order = models.IntegerField(blank=False)
    parent = models.ForeignKey('Element', related_name='children', null=True, blank=True)
    multiplicity = models.TextField(null=True, blank=True)
    # comma-separated list of names: collect one group for each name
    # integer: collect up to N unnamed groups
    # null: just collect one

    required = models.TextField(default='False')
    default = models.TextField(null=True, blank=True)
    help = models.TextField(null=True, blank=True)
    validation = models.TextField(null=True, blank=True)
    validation_msg = models.TextField(null=True, blank=True)
    ask_if = models.TextField(null=True, blank=True)

    type_validators = {
        'phone': re.compile(
            '''^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$'''
            , re.IGNORECASE),
        'email': re.compile(
            '''^[a-z0-9!#$%&*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'''
            , re.IGNORECASE),
        'zip': re.compile(
            '''^\d{5}(-\d{4})?$'''
            , re.IGNORECASE),
        'percent': lambda x: 0 <= x <= 1000,
        'integer': lambda x: isinstance(x, int),
    }

    class Meta:
        ordering = ['order',]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Human-readable should derive from ``name`` by default."""
        if not self.human:
            self.human = self.name.replace('_', ' ').title()
        super(Element, self).save(*args, **kwargs)

    @property
    def qualified_name(self):
        if self.parent:
            return '%s.%s' % (self.parent.qualified_name, self.name)
        else:
            return self.name

    _tag_pattern= re.compile(r'<.*?>', re.DOTALL)
    @property
    def human_plain(self)   :
        "A plain human-friendly name, scrubbed of tags"
        if self.human:
            return self._tag_pattern.sub('', self.human)
        else:
            return self.name.replace('_', ' ')

    @property
    def reportable_question(self):
        """Human-readable text for a read-only report"""
        if self.report_text is not None:
            return self.report_text
        else:
            return self.human_plain

    def reportable_answer(self, datum):
        """Human-readable version of answer for a read-only report"""
        result = datum
        if self.element_type in ('bool', 'checkbox'):
            if datum:
                if hasattr(datum, 'lower'):
                    datum = (datum.lower() != 'false')
            result = 'Yes' if datum else 'No'
        else:
            if isinstance(datum, list) or isinstance(datum, dict):
                result = ''
        return result

    def is_trueish(self, field_name, dct):
        """``field`` name in ``dct`` and True

        ``True`` if ``field_name`` in ``dct``
        and its value is considered True

        Args:
            field_name: Name of the key
                in question
            dct: Dictionary that may include
                ``field_name``
        Return:
            boolean - whether ``field_name`` is
                present and with a value representing
                True
        """
        if field_name not in dct:
            return False
        datum = dct[field_name]
        try:
            datum = datum.strip().lower()
            if datum == 'false':
                return False
        except AttributeError: # was not a string
            pass
        return bool(datum)

    def should_ask(self, data, path):
        """Applies ``self.ask_if`` to ``data``

        Applies logic in ``self.ask`` to
        ``data`` from proposal, walking down
        ``path`` to locate the dict nested at
        this element's parent level.

        Args:
            data: Proposal's full data tree,
                from top
            path: Series of keys to walk down
                data tree to this element's
                corresponding datum
        Return:
            bool: Whether an element is a relevant
            question in this context (and thus,
            whether ``required`` fields should
            actually be required, etc.) """
        if not self.ask_if:
            return True
        reverse = False
        ask_if = self.ask_if
        if ask_if.split()[0] == 'not':
            reverse = True
            ask_if = ask_if.split()[1]
        parent = _walk_path(data, path[:-1])
        result = self.is_trueish(ask_if, parent)
        if reverse:
            result = not result
        return result

    def data_required(self, accept_partial, data, path):
        """Applies ``self.required`` to ``data``.

        Interprets ``self.required`` with regard to
        ``data`` from proposal, deciding whether to
        actually require data in this case.

        Args:
            accept_partial: Whether a partial submission
                should be accepted
            data: The submission's data, from the top
            path: Series of strings to walk down nested
               ``data`` structure to this element's level
        Return:
            'optional', 'required', or 'forbidden'
        """

        if (accept_partial
            or (not self.should_ask(data, path))
            or (self.required.lower() == 'false')):
            return 'optional'
        if self.required.lower() == 'true':
            return 'required'
        required = self.required.split()
        (operator, fields) = (required[0], required[1:])
        parent = _walk_path(data, path[:-1])
        # assumes that all unless / xor are at same level in data
        field_trueness = [self.is_trueish(f, parent) for f in fields]
        if operator == 'unless':
            if field_trueness.count(True) == 0:
                return 'required'
            else:
                return 'optional'
        elif operator == 'xor':
            if field_trueness.count(True) == 0:
                return 'required'
            else:
                return 'forbidden'
        raise NotImplementedError('could not interpret %s for %s' %
                                  (self.required, self.name))

    # recognize "validations" that are actually calculations
    # every calculation should include an operator (+-*/) surrounded by
    # whitespace, or the validator will mistake it for a call to a validation
    # function
    _calc_pattern = re.compile(r"\S\s+[+-/*]\s+\S")

    def validation_errors(self, data, accept_partial):
        """List of validation errors from applying to ``data``

        Return a list of all errors found when this workflow's
        validation is applied to ``data`` from proposal.

        Should only be called on top-level "workflow"
        element.

        Args:
            data: directory of data submitted with proposal
            accept_partial: If ``True``, then missing elements
                won't trigger errors even when ``.required == True``
        Returns:
            List of strings describing errors
        """

        errors = []

        # Designed to be called for a full workflow only
        assert self.element_type == 'workflow'

        for (el, datum, path) in self.with_data(data.get(self.name, {}), []):
            required = el.data_required(accept_partial, data, path)

            if not datum:  # or children with data, hmm TODO
                if required == 'required':
                    # None in path ---> a parent missing from data
                    errors.append('Required field %s not found' % el.name)
                continue

            if required == 'forbidden' and datum:
                errors.append('%s should not be filled' % el.name)
                continue

            type_validator = self.type_validators.get(el.element_type)
            if type_validator:
                if callable(type_validator):
                    try:
                        datum = _to_number(datum)
                        valid = type_validator(datum)
                    except Exception as e:
                        valid = False
                else:
                    valid = type_validator.search(datum)
                if not valid:
                    errors.append('Not a valid %s' % el.element_type)
                    continue

            if el.validation:
                for validation in el.validation.split(';'):
                    if el._calc_pattern.search(validation):
                        # This "validation" is actually a calculation
                        continue
                    args = shlex.split(validation)
                    function_name = args.pop(0)
                    try:
                        func = getattr(validation_helpers, function_name)
                        if not func(data, datum, *args):
                            errors.append(
                                '%s: %s' % (el.name, el.validation_msg or
                                                       "failed %s" % function_name))
                    except AttributeError:
                        # validation refers to a function not found in helper library
                        errors.append(
                            '%s: validation function %s absent from validation_helpers.py' %
                            (el.name, function_name))

        return errors

    def children_with_data(self, data, path, include_empty):
        for child in self.children.all():
            if child.name in data:
                yield from child.with_data(data[child.name], path, include_empty)
            else:
                if include_empty:
                    yield (child, None, path + [None])

    _comma_and_space = re.compile(r',\s+')
    _nonalphanum = re.compile(r'[^A-Za-z0-9]')

    def _contains_data(self, data):
        if isinstance(data, list):
            for itm in data:
                if self._contains_data(itm):
                    return True
            return False
        elif isinstance(data, dict):
            for key in data:
                if self._contains_data(data[key]):
                    return True
            return False
        else:
            return True

    def with_data(self, data, path=None, include_empty=True):
        """ Yields (element, datum, path) tuples

        Yields (element, data, path) tuples
        for the entire workflow from this point
        downward.  Each item in the tree of ``data``
        is paired with its corresponding workflow
        element.  When items are absent from ``data``,
        they will still be returned, with values of
        ``None``.

        Args:
            data: Nested dictionary of submitted proposal data,
                from the top
            path: Sequence of key names to navigate ``data``
                to the point corresponding to this element
        """
        if not path:
            path = []
        if (not include_empty) and (not self._contains_data(data)):
            return  # without yielding
        if self.multiplicity:
            any_this_level = False
            try:
                int(self.multiplicity)
                keys = data.keys()
            except ValueError:
                keys = self._comma_and_space.split(self.multiplicity)
                keys = [self._nonalphanum.sub('_', k) for k in keys]
            for k in keys:
                if k in data:
                    if include_empty or self._contains_data(data[k]):
                        yield (self, data[k], path + [self.name, k])
                        any_this_level = True
                        yield from self.children_with_data(data[k], path + [self.name, k], include_empty)
            if not any_this_level:
                yield (self, None, path + [self.name, None])
        else:  # no multiplicity
            yield (self, data, path + [self.name])
            yield from self.children_with_data(data, path + [self.name], include_empty)


class Jargon(models.Model):
    name = models.TextField(unique=True)
    html = models.TextField()
    elements = models.ManyToManyField('Element', blank=True, null=True,
                                      related_name='jargons')


class Solicitation(models.Model):
    name = models.TextField(unique=True)
    element = models.ForeignKey(Element, related_name='element', null=True)
    pre_release_date = models.DateTimeField()
    proposals_begin_date = models.DateTimeField()
    proposals_end_date = models.DateTimeField()

    @property
    def days_to_close(self):
        return (self.proposals_end_date - timezone.now()).days

    def __str__(self):
        return '%s due %s' % (self.name or '',
                              self.proposals_end_date.strftime(
                              '%d %B %Y'))

    @property
    def status(self):
        now = timezone.now()
        if now > self.proposals_end_date:
            return 'Closed'
        elif now >= self.proposals_begin_date:
            return 'Open'
        else:
            return 'Future'

class Topic(models.Model):
    PROGRAM_CHOICES = (
        ("SBIR", "SBIR"),
        ("STTR", "STTR"),
        )

    topic_number = models.TextField(unique=True)
    solicitation = models.ForeignKey(Solicitation, related_name='solicitation')
    url = models.TextField(unique=True, blank=True, null=True)
    title = models.TextField()
    agency = models.TextField(blank=True, null=True)
    program = models.CharField(max_length=10, choices=PROGRAM_CHOICES)
    description = models.TextField()
    objective = models.TextField()
    fts = VectorField()
    saved_by = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                      blank=True, null=True,
                                      related_name='saved_topics')

    objects = SearchManager(fields=None, search_field='fts',
                           auto_update_search_field=False)


class Proposal(models.Model):
    owner = models.ForeignKey(SbirezUser, related_name='proposals')
    firm = models.ForeignKey(Firm, related_name='proposals')
    workflow = models.ForeignKey(Element, related_name='proposals')
    topic = models.ForeignKey(Topic, related_name='proposals')
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    title = models.TextField()
    data = JsonField(null=True, blank=True)

    @property
    def proposal_number(self):
        return '%s-%04d' % (self.topic.topic_number, self.id)

    @property
    def date_submitted(self):
        if self.submitted_at:
            return self.submitted_at.strftime('%m-%d-%Y')
        else:
            return '(Not Submitted)'

    def report(self):
        for (el, data, path) in self.workflow.with_data(
            self.data.get(self.workflow.name, {}), [], include_empty=False):
            if el.report_text == '':
                continue
            if el.element_type == 'checkbox' and not data:
                # TODO: Unsure this is always appropriate
                continue
            if el.human == r'%multiple%':
                question = path[-2]
            else:
                question = el.reportable_question
            yield (el, question, el.reportable_answer(data))


class Document(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    firm = models.ForeignKey('Firm')
    proposals = models.ManyToManyField('Proposal', blank=True, null=True,)

    @property
    def file(self):
        return self.versions.last() and self.versions.last().file


class DocumentVersion(models.Model):
    document = models.ForeignKey(Document, related_name='versions')  # order by created_at
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    file = models.FileField()

    @property
    def hash(self):
        return hashlib.md5(self.file.read()).hexdigest()

    class Meta:
        ordering = ['updated_at',]


class RawAgency(models.Model):

    name = models.TextField()
    type = models.IntegerField()


class RawCommand(models.Model):

    agency = models.ForeignKey(RawAgency, related_name='commands')
    name = models.TextField()


class RawTopic(models.Model):

    solicitation = models.TextField()
    program = models.TextField()
    agency = models.ForeignKey(RawAgency, related_name='topics')
    title = models.TextField(primary_key=True)
    text = models.TextField()
    keywords = models.TextField(null=True)
    background = models.TextField(null=True)
    airplatform = models.NullBooleanField()
    chembiodefense = models.NullBooleanField()
    infosystems = models.NullBooleanField()
    groundseaveh = models.NullBooleanField()
    materials = models.NullBooleanField()
    biomedical = models.NullBooleanField()
    sensors = models.NullBooleanField()
    electronics = models.NullBooleanField()
    battlespace = models.NullBooleanField()
    spaceplatform = models.NullBooleanField()
    humansystems = models.NullBooleanField()
    weapons = models.NullBooleanField()
    nucleartech = models.NullBooleanField()
    command = models.ForeignKey(RawCommand, related_name='topics')
    tpoc = models.TextField(null=True)
    tpocphone = models.TextField(null=True)
    tpocfax = models.TextField(null=True)
    tpocemail = models.TextField(null=True)
    tpocoffsym = models.TextField(null=True)
    tpoc2 = models.TextField(null=True)
    tpoc2phone = models.TextField(null=True)
    tpoc2fax = models.TextField(null=True)
    tpoc2email = models.TextField(null=True)
    tpoc2offsym = models.TextField(null=True)
    tpoc3 = models.TextField(null=True)
    tpoc3phone = models.TextField(null=True)
    tpoc3fax = models.TextField(null=True)
    tpoc3email = models.TextField(null=True)
    tpoc3offsym = models.TextField(null=True)
    tpoc4 = models.TextField(null=True)
    tpoc4phone = models.TextField(null=True)
    tpoc4fax = models.TextField(null=True)
    tpoc4email = models.TextField(null=True)
    tpoc4offsym = models.TextField(null=True)
    acqprogram = models.TextField(null=True)
    acqpoc = models.TextField(null=True)
    acqphone = models.TextField(null=True)
    acqfax = models.TextField(null=True)
    acqemail = models.TextField(null=True)
    acqinterest = models.TextField(null=True)
    meetcriteria = models.TextField(null=True)
    rationale = models.TextField(null=True)
    itar = models.NullBooleanField()
    previously_submitted = models.NullBooleanField()
    previously_approved = models.NullBooleanField()
    prior_solicitation = models.NullBooleanField()
    renewable_energy = models.IntegerField(null=True)
    manufacturing = models.IntegerField(null=True)
    topic = models.TextField(null=True)
    prior_topic_no = models.TextField(null=True)
    recommend2 = models.TextField(null=True)
    direct2phase2 = models.IntegerField(null=True)
