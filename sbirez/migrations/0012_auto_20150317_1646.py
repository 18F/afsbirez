# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0011_auto_20150317_1630'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='validation_msg',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
         migrations.AddField(
            model_name='question',
            name='default',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
