# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import djorm_pgfulltext.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sbirez', '0003_auto_20150219_1959'),
    ]

    operations = [
        migrations.RunSQL("""ALTER TABLE sbirez_topic ALTER COLUMN fts TYPE tsvector USING (fts::tsvector)""",
                          reverse_sql="""ALTER TABLE sbirez_topic ALTER COLUMN fts TYPE text USING (fts::text)""")
    ]

    # we don't use the auto-generated migrations.AlterField, because that throws an error:
    # django.db.utils.ProgrammingError: column "fts" cannot be cast automatically to type tsvector
    # HINT:  Specify a USING expression to perform the conversion.
    # sql was
    # ALTER TABLE "sbirez_topic" ALTER COLUMN "fts" TYPE tsvector, ALTER COLUMN "fts" SET DEFAULT %s



