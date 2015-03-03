SET search_path=public;

WITH subq AS (
  SELECT t.id,
         setweight(to_tsvector(string_agg(coalesce(t.title, ''), ' ')), 'A') ||
         setweight(to_tsvector(string_agg(coalesce(t.description, ''), ' ')), 'B') ||
         setweight(to_tsvector(string_agg(coalesce(a.area, ''), ' ')), 'A') ||
         setweight(to_tsvector(string_agg(coalesce(k.keyword, ''), ' ')), 'A')
         AS weights
  FROM   sbirez_topic t
  JOIN   sbirez_area_topics ta ON (t.id = ta.topic_id)
  JOIN   sbirez_area a ON (ta.area_id = a.id)
  JOIN   sbirez_keyword_topics tk ON (t.id = tk.topic_id)
  JOIN   sbirez_keyword k ON (tk.keyword_id = k.id)
  GROUP BY t.id)
UPDATE sbirez_topic
SET    fts = (SELECT weights FROM subq
              WHERE  sbirez_topic.id = subq.id);

-- appears to be created by sqlalchemy-searchable already
-- CREATE INDEX topics_fulltext_idx ON topics USING gin(full_text);
