# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0028_auto_20150724_2049'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
