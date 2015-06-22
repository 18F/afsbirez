# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0025_auto_20150619_1901'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkflowDefinition',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('source', django_pgjson.fields.JsonField()),
                ('workflow', models.OneToOneField(to='sbirez.Element')),
            ],
        ),
    ]
