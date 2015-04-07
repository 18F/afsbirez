# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0018_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='solicitation',
            field=models.ForeignKey(default=1, related_name='solicitation', to='sbirez.Solicitation'),
            preserve_default=False,
        ),
    ]
