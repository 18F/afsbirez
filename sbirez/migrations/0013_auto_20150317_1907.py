# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import djorm_pgfulltext.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0012_auto_20150317_1646'),
    ]

    operations = [
        migrations.CreateModel(
            name='Proposal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('submitted_at', models.DateTimeField(auto_now=True)),
                ('data', jsonfield.fields.JSONField()),
                ('firm', models.ForeignKey(to='sbirez.Firm', related_name='proposals')),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='proposals')),
                ('topic', models.ForeignKey(to='sbirez.Topic', related_name='proposals')),
                ('workflow', models.ForeignKey(to='sbirez.Workflow', related_name='proposals')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
