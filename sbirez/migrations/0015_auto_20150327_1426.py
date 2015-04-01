# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0014_auto_20150319_1730'),
    ]

    operations = [
        migrations.CreateModel(
            name='Element',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('name', models.TextField()),
                ('human', models.TextField(null=True, blank=True)),
                ('element_type', models.TextField(default='str')),
                ('order', models.IntegerField()),
                ('multiplicity', models.TextField(null=True, blank=True)),
                ('required', models.NullBooleanField(default=False)),
                ('default', models.TextField(null=True, blank=True)),
                ('help', models.TextField(null=True, blank=True)),
                ('validation', models.TextField(null=True, blank=True)),
                ('validation_msg', models.TextField(null=True, blank=True)),
                ('ask_if', models.TextField(null=True, blank=True)),
                ('parent', models.ForeignKey(null=True, related_name='children', to='sbirez.Element')),
            ],
            options={
                'ordering': ['order'],
            },
            bases=(models.Model,),
        ),
    ]
