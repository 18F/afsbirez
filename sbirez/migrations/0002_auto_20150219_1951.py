# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phase',
            name='phase',
            field=models.TextField(),
            preserve_default=True,
        ),
    ]
