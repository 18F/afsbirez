# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0030_auto_20150817_1927'),
    ]

    operations = [
        migrations.AlterField(
            model_name='area',
            name='topics',
            field=models.ManyToManyField(blank=True, to='sbirez.Topic', related_name='areas'),
        ),
        migrations.AlterField(
            model_name='document',
            name='proposals',
            field=models.ManyToManyField(blank=True, to='sbirez.Proposal'),
        ),
        migrations.AlterField(
            model_name='jargon',
            name='elements',
            field=models.ManyToManyField(blank=True, to='sbirez.Element', related_name='jargons'),
        ),
        migrations.AlterField(
            model_name='keyword',
            name='topics',
            field=models.ManyToManyField(blank=True, to='sbirez.Topic', related_name='keywords'),
        ),
        migrations.AlterField(
            model_name='naics',
            name='firms',
            field=models.ManyToManyField(blank=True, to='sbirez.Firm', related_name='naics'),
        ),
        migrations.AlterField(
            model_name='topic',
            name='saved_by',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL, related_name='saved_topics'),
        ),
    ]
