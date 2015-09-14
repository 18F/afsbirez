# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0031_auto_20150828_1751'),
    ]

    operations = [
        migrations.CreateModel(
            name='PointOfContactRelationship',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('order', models.IntegerField()),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.AddField(
            model_name='person',
            name='office',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='pointofcontactrelationship',
            name='poc',
            field=models.ForeignKey(to='sbirez.Person'),
        ),
        migrations.AddField(
            model_name='pointofcontactrelationship',
            name='topic',
            field=models.ForeignKey(to='sbirez.Topic'),
        ),
        migrations.AddField(
            model_name='topic',
            name='tech_points_of_contact',
            field=models.ManyToManyField(through='sbirez.PointOfContactRelationship', related_name='topics', blank=True, to='sbirez.Person'),
        ),
    ]
