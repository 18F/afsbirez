# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('area', models.TextField(unique=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('keyword', models.CharField(unique=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Phase',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('phase', models.TextField(unique=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('reference', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('topic_number', models.TextField(unique=True)),
                ('solicitation_id', models.TextField()),
                ('url', models.TextField(unique=True)),
                ('title', models.TextField()),
                ('agency', models.TextField(blank=True, null=True)),
                ('program', models.CharField(choices=[('SBIR', 'SBIR'), ('STTR', 'STTR')], max_length=10)),
                ('description', models.TextField()),
                ('objective', models.TextField()),
                ('pre_release_date', models.DateTimeField()),
                ('proposals_begin_date', models.DateTimeField()),
                ('proposals_end_date', models.DateTimeField()),
                ('fts', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='reference',
            name='topic',
            field=models.ForeignKey(to='sbirez.Topic'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='phase',
            name='topic',
            field=models.ForeignKey(to='sbirez.Topic'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='keyword',
            name='topics',
            field=models.ManyToManyField(blank=True, null=True, to='sbirez.Topic'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='area',
            name='topics',
            field=models.ManyToManyField(blank=True, null=True, to='sbirez.Topic'),
            preserve_default=True,
        ),
    ]
