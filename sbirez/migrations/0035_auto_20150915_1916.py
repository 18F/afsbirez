# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0034_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommercializedProject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('agency', models.TextField()),
                ('year_of_award', models.IntegerField()),
                ('topic_number', models.TextField()),
                ('contract_number', models.TextField()),
                ('last_updated', models.DateTimeField()),
                ('project_title', models.TextField()),
                ('federal', models.BooleanField()),
                ('federal_agency', models.TextField(null=True, blank=True)),
                ('federal_phase_ii_contract_number', models.TextField(null=True, blank=True)),
                ('manufacturing', models.TextField(null=True, blank=True, choices=[('unit', 'Unit process level manufacturing'), ('machine', 'Machine level manufacturing'), ('systems', 'Systems level manufacturing'), ('env_soc', 'Environmental/societal level manufacturing')])),
                ('cost_saving', models.BooleanField()),
                ('cost_saving_explanation', models.TextField(null=True, blank=True)),
                ('cost_saving_agency', models.TextField(null=True, blank=True)),
                ('cost_saving_amount', models.IntegerField(null=True, blank=True)),
                ('cost_savings_type', models.TextField(null=True, blank=True, choices=[('annual', 'Annual Savings'), ('lifecycle', 'Life-cycle Savings'), ('unit', 'Per Unit Savings')])),
                ('narrative', models.TextField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Income',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('amount', models.IntegerField()),
                ('project', models.ForeignKey(to='sbirez.CommercializedProject')),
            ],
        ),
        migrations.CreateModel(
            name='IncomeSource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('income_type', models.TextField(choices=[('sales', 'Sales to'), ('additional_investment', 'Additional Investment from')])),
                ('order_key', models.TextField()),
                ('name', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='income',
            name='source',
            field=models.ForeignKey(to='sbirez.IncomeSource'),
        ),
        migrations.AddField(
            model_name='commercializedproject',
            name='incomes',
            field=models.ManyToManyField(to='sbirez.IncomeSource', through='sbirez.Income'),
        ),
        migrations.AddField(
            model_name='commercializedproject',
            name='poc',
            field=models.ForeignKey(to='sbirez.Person'),
        ),
    ]
