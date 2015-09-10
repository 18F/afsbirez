# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0031_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='report_question_number',
            field=models.TextField(blank=True, null=True),
        ),
    ]
