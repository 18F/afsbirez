# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0016_auto_20150331_1737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sbirezuser',
            name='groups',
            field=models.ManyToManyField(verbose_name='groups', related_name='user_set', related_query_name='user', blank=True, to='auth.Group', help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        ),
        migrations.AlterField(
            model_name='sbirezuser',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
    ]
