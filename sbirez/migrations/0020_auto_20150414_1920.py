# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0019_auto_20150406_0018'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentVersion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('note', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('file', models.FileField(null=True, upload_to='')),
            ],
            options={
                'ordering': ['updated_at'],
            },
        ),
        migrations.RemoveField(
            model_name='document',
            name='file',
        ),
        migrations.AddField(
            model_name='documentversion',
            name='document',
            field=models.ForeignKey(related_name='versions', to='sbirez.Document'),
        ),
    ]
