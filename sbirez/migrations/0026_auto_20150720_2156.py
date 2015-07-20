# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0025_auto_20150706_2356'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='required',
            field=models.TextField(default='False'),
        ),
    ]
