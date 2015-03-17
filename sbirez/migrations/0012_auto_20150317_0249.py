# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0011_auto_20150316_2108'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='ask_if',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
