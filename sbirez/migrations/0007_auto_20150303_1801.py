# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sbirez', '0006_auto_20150302_2037'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedTopic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('topic', models.ForeignKey(related_name='savedtopics', to='sbirez.Topic')),
                ('user', models.ForeignKey(related_name='savedtopics', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
