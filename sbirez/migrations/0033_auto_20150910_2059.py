# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0032_auto_20150910_0836'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='pointofcontactrelationship',
            options={'ordering': ['priority']},
        ),
        migrations.RenameField(
            model_name='pointofcontactrelationship',
            old_name='order',
            new_name='priority',
        ),
    ]
