-- ddlgenerator imports from JSON in a not-so-normalized fashion.
-- This script converts from that data, in the ``import`` schema, to our
-- proper production schema.

-- TODO: check against duplicates that differ only by case

SET search_path=public;

-- topics

INSERT INTO public.sbirez_topic (topic_number,
                                 solicitation_id,
                                 url,
                                 title,
                                 program,
                                 description,
                                 objective,
                                 pre_release_date,
                                 proposals_begin_date,
                                 proposals_end_date,
                                 fts)
SELECT                           topic_number,
                                 solicitation_id,
                                 url,
                                 title,
                                 program,
                                 description,
                                 objective,
                                 pre_release_date,
                                 proposals_begin_date,
                                 proposals_end_date,
                                 'fts stuff'
FROM    import.topics i;

-- checking work
select program, count(*) from import.topics group by program;
select program, count(*) from public.sbirez_topic group by program;

-- areas

INSERT INTO public.sbirez_area (area)
SELECT DISTINCT areas FROM import.areas;

INSERT INTO public.sbirez_area_topics (topic_id, area_id)
SELECT DISTINCT t.id,
                a.id
FROM   public.sbirez_topic t
JOIN   import.topics it ON (t.topic_number = it.topic_number)
JOIN   import.areas ia ON (it.topics_id = ia.topics_id)
JOIN   public.sbirez_area a ON (ia.areas = a.area);

SELECT areas, count(*) FROM import.areas GROUP BY areas ORDER BY areas;
SELECT a.area, count(*)
FROM   public.sbirez_area a
JOIN   public.sbirez_area_topics ta ON (ta.area_id = a.id)
GROUP BY a.area ORDER BY a.area;

-- keywords

INSERT INTO public.sbirez_keyword (keyword, created_at, updated_at)
SELECT DISTINCT i.keywords, current_timestamp, current_timestamp
FROM   import.keywords i
WHERE  i.keywords NOT IN (SELECT keyword FROM public.sbirez_keyword);

INSERT INTO public.sbirez_keyword_topics (topic_id, keyword_id)
SELECT DISTINCT t.id,
                k.id
FROM   public.sbirez_topic t
JOIN   import.topics it ON (t.topic_number = it.topic_number)
JOIN   import.keywords ik ON (it.topics_id = ik.topics_id)
JOIN   public.sbirez_keyword k ON (ik.keywords = k.keyword);

SELECT COUNT(DISTINCT keywords) FROM import.keywords;
SELECT COUNT(DISTINCT keyword_id) FROM public.sbirez_keyword_topics;


-- phases

INSERT INTO public.sbirez_phase (phase, topic_id)
SELECT DISTINCT
       p.phases,
       t.id
FROM   import.phases p
JOIN   import.topics it ON (p.topics_id = it.topics_id)
JOIN   public.sbirez_topic t ON (it.topic_number = t.topic_number);

-- references
INSERT INTO public.sbirez_reference (reference, topic_id)
SELECT DISTINCT
       ir._references,
       t.id
FROM   import._references ir
JOIN   import.topics it ON (ir.topics_id = it.topics_id)
JOIN   public.sbirez_topic t ON (it.topic_number = t.topic_number);

-- extract agency from topic number
UPDATE public.sbirez_topic t
SET    topic_number = SUBSTRING(t.topic_number from '(.*?)\s+\('),
       agency = SUBSTRING(t.topic_number from '.*?\s+\((.*?)\)')
WHERE  t.topic_number LIKE '% %)%';

