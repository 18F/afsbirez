from django.db import models

# from pg_fts.fields import TSVectorField

class Area(models.Model):
    area = models.TextField(unique=True)
    topics = models.ManyToManyField('Topic', blank=True, null=True)

class Keyword(models.Model):
    keyword = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    topics = models.ManyToManyField('Topic', blank=True, null=True)

class Phase(models.Model):
    phase = models.TextField()
    topic = models.ForeignKey('Topic')

class Reference(models.Model):
    reference = models.TextField()
    topic = models.ForeignKey('Topic')

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
    fts = models.TextField()



