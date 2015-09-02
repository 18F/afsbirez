# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0029_auto_20150804_2055'),
    ]

    operations = [
        migrations.CreateModel(
            name='PasswordHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('password', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='sbirezuser',
            name='password_expires',
            field=models.DateTimeField(null=True),
        ),
        migrations.RunSQL(sql="UPDATE sbirez_sbirezuser set password_expires=now()+'60 days'"),
        migrations.AddField(
            model_name='passwordhistory',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='prior_passwords'),
        ),
    ]
