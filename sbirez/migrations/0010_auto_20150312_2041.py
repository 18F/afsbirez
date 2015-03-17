# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields

class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0009_auto_20150313_1659'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('street', models.TextField()),
                ('street2', models.TextField(blank=True, null=True)),
                ('city', models.TextField()),
                ('state', models.TextField()),
                ('zip', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Firm',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.TextField(unique=True)),
                ('tax_id', models.TextField(unique=True, blank=True, null=True)),
                ('sbc_id', models.TextField(unique=True, blank=True, null=True)),
                ('duns_id', models.TextField(unique=True, blank=True, null=True)),
                ('cage_code', models.TextField(blank=True, null=True)),
                ('website', models.TextField(blank=True, null=True)),
                ('founding_year', models.IntegerField(null=True)),
                ('phase1_count', models.IntegerField(null=True)),
                ('phase1_year', models.IntegerField(null=True)),
                ('phase2_count', models.IntegerField(null=True)),
                ('phase2_year', models.IntegerField(null=True)),
                ('phase2_employees', models.IntegerField(null=True)),
                ('current_employees', models.IntegerField(null=True)),
                ('patent_count', models.IntegerField(null=True)),
                ('total_revenue_range', models.TextField(null=True)),
                ('revenue_percent', models.IntegerField(null=True)),
                ('address', models.ForeignKey(null=True, to='sbirez.Address')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.TextField()),
                ('title', models.TextField(null=True)),
                ('email', models.TextField(null=True)),
                ('phone', models.TextField(null=True)),
                ('fax', models.TextField(null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='firm',
            name='point_of_contact',
            field=models.ForeignKey(null=True, to='sbirez.Person'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='sbirezuser',
            name='firm',
            field=models.ForeignKey(to='sbirez.Firm', null=True),
            preserve_default=True,
        ),
    ]
