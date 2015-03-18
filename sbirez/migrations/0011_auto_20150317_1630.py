# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0010_auto_20150312_2041'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('name', models.TextField()),
                ('order', models.IntegerField()),
                ('data_type', models.TextField(default='str')),
                ('required', models.BooleanField(default=False)),
                ('human', models.TextField(blank=True)),
                ('help', models.TextField(blank=True)),
                ('validation', models.TextField(blank=True)),
                ('ask_if', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['order'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('name', models.TextField()),
                ('validation', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='question',
            name='parent',
            field=models.ForeignKey(to='sbirez.Workflow', related_name='questions'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='subworkflow',
            field=models.ForeignKey(blank=True, to='sbirez.Workflow', null=True, related_name='subworkflow_of'),
            preserve_default=True,
        ),
    ]
