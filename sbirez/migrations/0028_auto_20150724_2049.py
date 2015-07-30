# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0027_auto_20150724_2048'),
    ]

    operations = [
        migrations.AddField(
            model_name='proposal',
            name='submitted_at',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='proposal',
            name='verified_at',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
