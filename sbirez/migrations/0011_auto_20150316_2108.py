# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0010_auto_20150316_1808'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='subworkflow',
            field=models.ForeignKey(null=True, to='sbirez.Workflow', blank=True, related_name='subworkflow_of'),
            preserve_default=True,
        ),
    ]
