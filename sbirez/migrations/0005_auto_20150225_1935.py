# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0004_auto_20150223_2159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='area',
            name='topics',
            field=models.ManyToManyField(null=True, blank=True, related_name='areas', to='sbirez.Topic'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='keyword',
            name='topics',
            field=models.ManyToManyField(null=True, blank=True, related_name='keywords', to='sbirez.Topic'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='phase',
            name='topic',
            field=models.ForeignKey(related_name='phases', to='sbirez.Topic'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='reference',
            name='topic',
            field=models.ForeignKey(related_name='references', to='sbirez.Topic'),
            preserve_default=True,
        ),
    ]

"""
        Manually removing this operation - I don't understand its purpose, and it causes

        'CREATE INDEX "sbirez_topic_fts_64561dfd2a97ef59_uniq" ON "sbirez_topic" ("fts")'

        which PostgreSQL rejects with

        django.db.utils.OperationalError: index row requires 10552 bytes, maximum size is 8191

        and anyway we Do Not Want a unique index on this.

        Apparently one more case of django migrations not knowing how to handle a TSVECTOR column.

        migrations.AlterField(
            model_name='topic',
            name='fts',
            field=djorm_pgfulltext.fields.VectorField(null=True, default='', db_index=True, serialize=False, editable=False),
            preserve_default=True,
        ),
"""
