# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0015_auto_20150327_1426'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proposal',
            name='workflow',
            field=models.ForeignKey(related_name='proposals', to='sbirez.Element'),
            preserve_default=True,
        ),
    ]
