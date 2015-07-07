# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_pgjson.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0024_auto_20150612_1611'),
    ]

    operations = [
        migrations.CreateModel(
            name='Naics',
            fields=[
                ('code', models.TextField(serialize=False, primary_key=True)),
                ('description', models.TextField()),
            ],
        ),
        migrations.AlterField(
            model_name='element',
            name='parent',
            field=models.ForeignKey(null=True, to='sbirez.Element', blank=True, related_name='children'),
        ),
        migrations.AlterField(
            model_name='firm',
            name='address',
            field=models.ForeignKey(null=True, to='sbirez.Address', blank=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='current_employees',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='founding_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='patent_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='phase1_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='phase1_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='phase2_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='phase2_employees',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='phase2_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='point_of_contact',
            field=models.ForeignKey(null=True, to='sbirez.Person', blank=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='revenue_percent',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='firm',
            name='total_revenue_range',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='email',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='fax',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='phone',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='title',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='sbirezuser',
            name='firm',
            field=models.ForeignKey(null=True, to='sbirez.Firm', blank=True),
        ),
        migrations.AddField(
            model_name='naics',
            name='firms',
            field=models.ManyToManyField(blank=True, null=True, related_name='naics', to='sbirez.Firm'),
        ),
    ]
