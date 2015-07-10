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
            name='Jargon',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.TextField(unique=True)),
                ('html', models.TextField()),
                ('elements', models.ManyToManyField(to='sbirez.Element', related_name='jargons', null=True, blank=True)),
            ],
        ),
    ]
