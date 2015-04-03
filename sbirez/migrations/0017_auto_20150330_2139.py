# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime
from django.db import models, migrations

def create_solicitation(apps, schema_editor):
    Topic = apps.get_model("sbirez", "Topic")
    Solicitation = apps.get_model("sbirez", "Solicitation")

    ft = Topic.objects.first()
    if ft is not None:
        sol = Solicitation.objects.create(name=ft.solicitation_id, 
            pre_release_date=ft.pre_release_date,
            proposals_begin_date=ft.proposals_begin_date,
            proposals_end_date=ft.proposals_end_date,
            element=None)
        sol.save()

def add_topic_fields(apps, schema_editor):
    Topic = apps.get_model("sbirez", "Topic")
    Solicitation = apps.get_model("sbirez", "Solicitation")

    fs = Solicitation.objects.first()
    if fs is not None:
        for topic in Topic.objects.all():
            topic.solicitation_id = fs.name
            topic.pre_release_date = fs.pre_release_date
            topic.proposals_begin_date = fs.proposals_begin_date
            topic.proposals_end_date = fs.proposals_end_date 
            topic.save()

def no_op(apps, schema_editor):
    return

def set_solicitation_id(apps, schema_editor):
    Topic = apps.get_model("sbirez", "Topic")
    Solicitation = apps.get_model("sbirez", "Solicitation")

    fs = Solicitation.objects.first()
    if fs is not None:
        for topic in Topic.objects.all():
            topic.solicitation_id = fs
            topic.save()

class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0016_auto_20150331_1737'),
    ]

    operations = [
        migrations.CreateModel(
            name='Solicitation',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.TextField(unique=True)),
                ('pre_release_date', models.DateTimeField()),
                ('proposals_begin_date', models.DateTimeField()),
                ('proposals_end_date', models.DateTimeField()),
                ('element', models.ForeignKey(to='sbirez.Element', related_name='element', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RunPython(create_solicitation, add_topic_fields),
        migrations.AlterField(
            model_name='topic',
            name='pre_release_date',
            field=models.DateTimeField(default=datetime.datetime.now),
            preserve_default=True
        ),
        migrations.RemoveField(
            model_name='topic',
            name='pre_release_date',
        ),
        migrations.AlterField(
            model_name='topic',
            name='proposals_begin_date',
            field=models.DateTimeField(default=datetime.datetime.now),
            preserve_default=True
        ),
        migrations.RemoveField(
            model_name='topic',
            name='proposals_begin_date',
        ),
        migrations.AlterField(
            model_name='topic',
            name='proposals_end_date',
            field=models.DateTimeField(default=datetime.datetime.now),
            preserve_default=True
        ),
        migrations.RemoveField(
            model_name='topic',
            name='proposals_end_date',
        ),
        migrations.AlterField(
            model_name='topic',
            name='solicitation_id',
            field=models.TextField(default=' '),
            preserve_default=True
        ),
        migrations.RemoveField(
            model_name='topic',
            name='solicitation_id',
        ),
        migrations.AddField(
            model_name='topic',
            name='solicitation',
            field=models.ForeignKey(to='sbirez.Solicitation', related_name='solicitation', null=True),
            preserve_default=True,
        ),
        migrations.RunPython(set_solicitation_id, no_op),
    ]
