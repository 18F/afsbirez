# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0013_auto_20150317_1907'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='data',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='ask_if',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='data_type',
            field=models.TextField(null=True, default='str'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='default',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='help',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='human',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='required',
            field=models.NullBooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='validation',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='validation_msg',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='proposal',
            name='title',
            field=models.TextField(default='Dummy Title'),
            preserve_default=False,
        ),
    ]
