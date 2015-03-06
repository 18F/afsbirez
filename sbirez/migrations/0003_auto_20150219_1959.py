# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0002_auto_20150219_1951'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='fts',
            field=models.TextField(blank=True, null=True),
            preserve_default=True,
        ),
    ]
