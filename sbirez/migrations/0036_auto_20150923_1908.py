# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0035_auto_20150916_2002'),
    ]

    operations = [
        migrations.AddField(
            model_name='firm',
            name='commercialization_index',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='firm',
            name='ipo_from_sbir_sttr',
            field=models.NullBooleanField(),
        ),
        migrations.AddField(
            model_name='firm',
            name='phone',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='commercializedproject',
            name='firm',
            field=models.ForeignKey(to='sbirez.Firm', null=True, blank=True),
        ),
    ]
