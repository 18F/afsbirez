# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0020_auto_20150414_1920'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documentversion',
            name='file',
            field=models.FileField(upload_to=''),
        ),
        migrations.RunSQL(sql="""
            ALTER TABLE sbirez_proposal
            ALTER COLUMN data TYPE JSON USING (data::JSON)""",
            reverse_sql="""ALTER TABLE sbirez_proposal
                           ALTER COLUMN data TYPE text"""),
    ]
