import hashlib

from django.db import models
from django.utils import timezone
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager
from django.conf import settings
from custom_user.models import AbstractEmailUser
from rest_framework import serializers

class Address(models.Model):
    street = models.TextField()
    street2 = models.TextField(null=True, blank=True)
    city = models.TextField()
    state = models.TextField()
    zip = models.TextField()

class Person(models.Model):
    name = models.TextField()
    title = models.TextField(null=True)
    email = models.TextField(null=True)
    phone = models.TextField(null=True)
    fax = models.TextField(null=True)

class Firm(models.Model):
    name = models.TextField(unique=True)
    tax_id = models.TextField(unique=True, blank=True, null=True)
    sbc_id = models.TextField(unique=True, blank=True, null=True)
    duns_id = models.TextField(unique=True, blank=True, null=True)
    cage_code = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)
    address = models.ForeignKey(Address, null=True)
    point_of_contact = models.ForeignKey(Person, null=True)
    founding_year = models.IntegerField(null=True)
    phase1_count = models.IntegerField(null=True)
    phase1_year = models.IntegerField(null=True)
    phase2_count = models.IntegerField(null=True)
    phase2_year = models.IntegerField(null=True)
    phase2_employees = models.IntegerField(null=True)
    current_employees = models.IntegerField(null=True)
    patent_count = models.IntegerField(null=True)
    total_revenue_range = models.TextField(null=True)
    revenue_percent = models.IntegerField(null=True)

    def __str__(self):
        return self.name

class SbirezUser(AbstractEmailUser):
    name = models.TextField()
    firm = models.ForeignKey(Firm, null=True)

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
    validation = models.TextField(null=True, blank=True)
    element_type = models.TextField(default='str')
    # workflow, group, line_item, read_only_text, or scalar type
    order = models.IntegerField(blank=False)
    parent = models.ForeignKey('Element', related_name='children', null=True)
    multiplicity = models.TextField(null=True, blank=True)
    # comma-separated list of names: collect one group for each name
    # integer: collect up to N unnamed groups
    # null: just collect one

    required = models.NullBooleanField(default=False)
    default = models.TextField(null=True, blank=True)
    help = models.TextField(null=True, blank=True)
    validation = models.TextField(null=True, blank=True)
    validation_msg = models.TextField(null=True, blank=True)
    ask_if = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['order',]

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

    def parentage(self):
        if self.parent:
            result = self.parent.parentage()
        else:
            result = []
        result.append(self.name)
        return result

    def lookup_in_data(self, data):
        for p in self.parentage()[1:]:  # [0] is the top workflow name
            if p in data:
                data = data[p]
            else:
                raise KeyError('%s not in %s' % (p, data.keys()))
        return data

class Solicitation(models.Model):
    name = models.TextField(unique=True)
    element = models.ForeignKey(Element, related_name='element', null=True)
    pre_release_date = models.DateTimeField()
    proposals_begin_date = models.DateTimeField()
    proposals_end_date = models.DateTimeField()

    @property
    def days_to_close(self):
        return (self.proposals_end_date - timezone.now()).days


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
    url = models.TextField(unique=True)
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
    submitted_at = models.DateTimeField(auto_now=True)
    title = models.TextField()
    data = models.TextField(null=True, blank=True)


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
