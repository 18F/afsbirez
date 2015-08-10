# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0027_merge'),
    ]

    operations = [
        migrations.RenameField(
            model_name='proposal',
            old_name='submitted_at',
            new_name='created_at',
        ),
        migrations.AlterField(
            model_name='proposal',
            name='data',
            field=django_pgjson.fields.JsonField(blank=True, null=True),
        ),
    ]
