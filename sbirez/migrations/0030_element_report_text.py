# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0029_auto_20150804_2055'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='report_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
