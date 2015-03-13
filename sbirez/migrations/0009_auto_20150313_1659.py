# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0008_auto_20150304_2134'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='fts',
            field=djorm_pgfulltext.fields.VectorField(null=True, editable=False, default='', db_index=True, serialize=False),
            preserve_default=True,
        ),
    ]

    # working around some inadequacies in our django fts module.
    # drop/create index is for: https://github.com/djangonauts/djorm-ext-pgfulltext/issues/45
    # load fixture loads the data, but the SQL statement after it builds the fts field.
    operations = [
        migrations.RunSQL("DROP INDEX IF EXISTS sbirez_topic_fts;"),
        migrations.RunSQL("CREATE INDEX sbirez_topic_fts ON sbirez_topic USING gin(fts);"),
        migrations.RunSQL("SET search_path=public; WITH subq AS (SELECT t.id, setweight(to_tsvector(string_agg(coalesce(t.title, ''), ' ')), 'A') || setweight(to_tsvector(string_agg(coalesce(t.description, ''), ' ')), 'B') ||setweight(to_tsvector(string_agg(coalesce(a.area, ''), ' ')), 'A') || setweight(to_tsvector(string_agg(coalesce(k.keyword, ''), ' ')), 'A') AS weights FROM sbirez_topic t JOIN sbirez_area_topics ta ON (t.id = ta.topic_id) JOIN sbirez_area a ON (ta.area_id = a.id) JOIN sbirez_keyword_topics tk ON (t.id = tk.topic_id) JOIN sbirez_keyword k ON (tk.keyword_id = k.id) GROUP BY t.id) UPDATE sbirez_topic SET fts = (SELECT weights FROM subq WHERE  sbirez_topic.id = subq.id);")
    ]