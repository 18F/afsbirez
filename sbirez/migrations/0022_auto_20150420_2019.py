# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0021_auto_20150420_2018'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='parent',
        ),
        migrations.RemoveField(
            model_name='question',
            name='subworkflow',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
        migrations.DeleteModel(
            name='Workflow',
        ),
    ]
