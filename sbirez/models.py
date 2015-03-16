from django.db import models
from django.utils import timezone
from djorm_pgfulltext.fields import VectorField
from djorm_pgfulltext.models import SearchManager
from django.conf import settings
from custom_user.models import AbstractEmailUser

class SbirezUser(AbstractEmailUser):
    name = models.TextField()

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


class Workflow(models.Model):
    name = models.TextField(blank=False)
    validation = models.TextField()


class Question(models.Model):
    name = models.TextField(blank=False)
    order = models.IntegerField(blank=False)
    parent = models.ForeignKey(Workflow, related_name='questions')

    # Each question should be EITHER an actual question...
    data_type = models.TextField(default='str')
    required = models.BooleanField(default=False)
    human = models.TextField(blank=True)
    help = models.TextField(blank=True)
    validation = models.TextField(blank=True)

    # ... OR a sub-workflow
    subworkflow = models.ForeignKey(Workflow, related_name='subworkflow_of')

    class Meta:
        ordering = ['order',]
