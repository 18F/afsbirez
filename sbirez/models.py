from django.db import models
from django.utils import timezone
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager
from django.conf import settings
from custom_user.models import AbstractEmailUser

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

class Topic(models.Model):
    PROGRAM_CHOICES = (
        ("SBIR", "SBIR"),
        ("STTR", "STTR"),
        )

    topic_number = models.TextField(unique=True)
    solicitation_id = models.TextField()
    url = models.TextField(unique=True)
    title = models.TextField()
    agency = models.TextField(blank=True, null=True)
    program = models.CharField(max_length=10, choices=PROGRAM_CHOICES)
    description = models.TextField()
    objective = models.TextField()
    pre_release_date = models.DateTimeField()
    proposals_begin_date = models.DateTimeField()
    proposals_end_date = models.DateTimeField()
    fts = VectorField()
    saved_by = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                      blank=True, null=True,
                                      related_name='saved_topics')

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

    objects = SearchManager(fields=None, search_field='fts',
                           auto_update_search_field=False)

