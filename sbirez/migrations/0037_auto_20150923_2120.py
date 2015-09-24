# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0036_auto_20150923_1908'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commercializedproject',
            old_name='federal_phase_ii_contract_number',
            new_name='cost_saving_program',
        ),
        migrations.AddField(
            model_name='commercializedproject',
            name='federal_phase_iii_contract_number',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='commercializedproject',
            name='federal_program',
            field=models.TextField(null=True, blank=True),
        ),
    ]
