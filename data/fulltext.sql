WITH subq AS (
  SELECT t.id,
         setweight(to_tsvector(string_agg(coalesce(t.title, ''), ' ')), 'A') ||
         setweight(to_tsvector(string_agg(coalesce(t.description, ''), ' ')), 'B') ||
         setweight(to_tsvector(string_agg(coalesce(a.area, ''), ' ')), 'A') ||
         setweight(to_tsvector(string_agg(coalesce(k.keyword, ''), ' ')), 'A')
         AS weights
  FROM   topics t
  JOIN   topicsareas ta ON (t.id = ta.topic_id)
  JOIN   areas a ON (ta.area_id = a.id)
  JOIN   topicskeywords tk ON (t.id = tk.topic_id)
  JOIN   keywords k ON (tk.keyword_id = k.id)
  GROUP BY t.id)
UPDATE topics
SET    full_text = (SELECT weights FROM subq
                    WHERE  topics.id = subq.id);

CREATE INDEX topics_fulltext_idx ON topics USING gin(full_text);
