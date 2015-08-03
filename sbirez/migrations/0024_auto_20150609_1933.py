# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0023_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='RawAgency',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('type', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='RawCommand',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('agency', models.ForeignKey(related_name='commands', to='sbirez.RawAgency')),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='RawTopic',
            fields=[
                ('solicitation', models.TextField()),
                ('program', models.TextField()),
                ('agency', models.ForeignKey(related_name='topics', to='sbirez.RawAgency')),
                ('title', models.TextField(primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('keywords', models.TextField(null=True)),
                ('background', models.TextField(null=True)),
                ('airplatform', models.NullBooleanField()),
                ('chembiodefense', models.NullBooleanField()),
                ('infosystems', models.NullBooleanField()),
                ('groundseaveh', models.NullBooleanField()),
                ('materials', models.NullBooleanField()),
                ('biomedical', models.NullBooleanField()),
                ('sensors', models.NullBooleanField()),
                ('electronics', models.NullBooleanField()),
                ('battlespace', models.NullBooleanField()),
                ('spaceplatform', models.NullBooleanField()),
                ('humansystems', models.NullBooleanField()),
                ('weapons', models.NullBooleanField()),
                ('nucleartech', models.NullBooleanField()),
                ('command', models.ForeignKey(related_name='topics', to='sbirez.RawCommand')),
                ('tpoc', models.TextField(null=True)),
                ('tpocphone', models.TextField(null=True)),
                ('tpocfax', models.TextField(null=True)),
                ('tpocemail', models.TextField(null=True)),
                ('tpocoffsym', models.TextField(null=True)),
                ('tpoc2', models.TextField(null=True)),
                ('tpoc2phone', models.TextField(null=True)),
                ('tpoc2fax', models.TextField(null=True)),
                ('tpoc2email', models.TextField(null=True)),
                ('tpoc2offsym', models.TextField(null=True)),
                ('tpoc3', models.TextField(null=True)),
                ('tpoc3phone', models.TextField(null=True)),
                ('tpoc3fax', models.TextField(null=True)),
                ('tpoc3email', models.TextField(null=True)),
                ('tpoc3offsym', models.TextField(null=True)),
                ('tpoc4', models.TextField(null=True)),
                ('tpoc4phone', models.TextField(null=True)),
                ('tpoc4fax', models.TextField(null=True)),
                ('tpoc4email', models.TextField(null=True)),
                ('tpoc4offsym', models.TextField(null=True)),
                ('acqprogram', models.TextField(null=True)),
                ('acqpoc', models.TextField(null=True)),
                ('acqphone', models.TextField(null=True)),
                ('acqfax', models.TextField(null=True)),
                ('acqemail', models.TextField(null=True)),
                ('acqinterest', models.TextField(null=True)),
                ('meetcriteria', models.TextField(null=True)),
                ('rationale', models.TextField(null=True)),
                ('itar', models.NullBooleanField()),
                ('previously_submitted', models.NullBooleanField()),
                ('previously_approved', models.NullBooleanField()),
                ('prior_solicitation', models.NullBooleanField()),
                ('renewable_energy', models.IntegerField(null=True)),
                ('manufacturing', models.IntegerField(null=True)),
                ('topic', models.TextField(null=True)),
                ('prior_topic_no', models.TextField(null=True)),
                ('recommend2', models.TextField(null=True)),
                ('direct2phase2', models.IntegerField(null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='topic',
            name='url',
            field=models.TextField(unique=True, null=True, blank=True),
        ),
    ]
