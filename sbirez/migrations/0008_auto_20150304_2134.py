# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sbirez', '0007_auto_20150303_1801'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='savedtopic',
            name='topic',
        ),
        migrations.RemoveField(
            model_name='savedtopic',
            name='user',
        ),
        migrations.DeleteModel(
            name='SavedTopic',
        ),
        migrations.AddField(
            model_name='topic',
            name='saved_by',
            field=models.ManyToManyField(related_name='saved_topics', null=True, to=settings.AUTH_USER_MODEL, blank=True),
            preserve_default=True,
        ),
    ]
