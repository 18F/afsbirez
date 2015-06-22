# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0024_auto_20150612_1611'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='data',
            field=django_pgjson.fields.JsonField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='solicitation',
            name='element',
            field=models.ForeignKey(related_name='element', verbose_name='Workflow', null=True, to='sbirez.Element'),
        ),
        migrations.AlterField(
            model_name='solicitation',
            name='pre_release_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='solicitation',
            name='proposals_begin_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='solicitation',
            name='proposals_end_date',
            field=models.DateField(),
        ),
    ]
