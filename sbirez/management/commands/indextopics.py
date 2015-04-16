from django.db import connection, transaction
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    args = ''
    help = 'Updates the full text search index for topics'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        cursor.execute('''\
            WITH subq AS (
              SELECT t.id,
                     setweight(to_tsvector(string_agg(coalesce(t.title, ''), ' ')), 'A') ||
                     setweight(to_tsvector(string_agg(coalesce(t.description, ''), ' ')), 'B') ||
                     setweight(to_tsvector(string_agg(coalesce(a.area, ''), ' ')), 'A') ||
                     setweight(to_tsvector(string_agg(coalesce(k.keyword, ''), ' ')), 'A')
                     AS weights
              FROM sbirez_topic t
              LEFT JOIN sbirez_area_topics ta ON (t.id = ta.topic_id)
              LEFT JOIN sbirez_area a ON (ta.area_id = a.id)
              LEFT JOIN sbirez_keyword_topics tk ON (t.id = tk.topic_id)
              LEFT JOIN sbirez_keyword k ON (tk.keyword_id = k.id)
              GROUP BY t.id)
            UPDATE sbirez_topic
            SET fts = (SELECT weights FROM subq
                       WHERE  sbirez_topic.id = subq.id);\
''')
        #transaction.set_dirty()        
        transaction.commit()



