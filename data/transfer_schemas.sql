-- ddlgenerator imports from JSON in a not-so-normalized fashion.
-- This script converts from that data, in the ``import`` schema, to our
-- proper production schema.

-- TODO: check against duplicates that differ only by case

SET search_path=public;

-- programs

INSERT INTO public.programs (program)
SELECT DISTINCT program FROM import.topics;

-- topics

INSERT INTO public.topics (topic_number,
                           solicitation_id,
                           url,
                           title,
                           description,
                           objective,
                           pre_release_date,
                           proposals_begin_date,
                           proposals_end_date)
SELECT                     topic_number,
                           solicitation_id,
                           url,
                           title,
                           description,
                           objective,
                           pre_release_date,
                           proposals_begin_date,
                           proposals_end_date
FROM    import.topics i;

UPDATE public.topics t
SET    program_id = p.id
FROM   public.programs p,
       import.topics i
WHERE  i.program = p.program
AND    t.topic_number = i.topic_number;

-- checking work
select program, count(*) from import.topics group by program;
select program_id, count(*) from public.topics group by program_id;

-- areas

INSERT INTO public.areas (area)
SELECT DISTINCT areas FROM import.areas;

INSERT INTO public.topicsareas (topic_id, area_id)
SELECT DISTINCT t.id,
                a.id
FROM   public.topics t
JOIN   import.topics it ON (t.topic_number = it.topic_number)
JOIN   import.areas ia ON (it.topics_id = ia.topics_id)
JOIN   public.areas a ON (ia.areas = a.area);

SELECT areas, count(*) FROM import.areas GROUP BY areas ORDER BY areas;
SELECT a.area, count(*)
FROM   public.areas a
JOIN   public.topicsareas ta ON (ta.area_id = a.id)
GROUP BY a.area ORDER BY a.area;

-- keywords

INSERT INTO public.keywords (keyword, created_at, updated_at)
SELECT DISTINCT i.keywords, current_timestamp, current_timestamp
FROM   import.keywords i
WHERE  i.keywords NOT IN (SELECT keyword FROM public.keywords);

INSERT INTO public.topicskeywords (topic_id, keyword_id)
SELECT DISTINCT t.id,
                k.id
FROM   public.topics t
JOIN   import.topics it ON (t.topic_number = it.topic_number)
JOIN   import.keywords ik ON (it.topics_id = ik.topics_id)
JOIN   public.keywords k ON (ik.keywords = k.keyword);

SELECT COUNT(DISTINCT keywords) FROM import.keywords;
SELECT COUNT(DISTINCT keyword_id) FROM public.topicskeywords;


-- participating components

INSERT INTO public.participatingcomponents (participatingcomponent)
SELECT DISTINCT i.participating_components
FROM   import.participating_components i;

INSERT INTO public.participatingcomponentstopics (topic_id, participatingcomponent_id)
SELECT DISTINCT t.id,
                p.id
FROM   public.topics t
JOIN   import.topics it ON (t.topic_number = it.topic_number)
JOIN   import.participating_components ip ON (it.topics_id = ip.topics_id)
JOIN   public.participatingcomponents p ON (ip.participating_components = p.participatingcomponent);

SELECT participating_components, COUNT(*) FROM import.participating_components GROUP BY participating_components;

SELECT COUNT(DISTINCT participating_components) FROM import.participating_components;
SELECT COUNT(DISTINCT participatingcomponent_id) FROM public.participatingcomponentstopics;

-- phases

INSERT INTO public.phases (phase, topic_id)
SELECT DISTINCT
       p.phases,
       t.id
FROM   import.phases p
JOIN   import.topics it ON (p.topics_id = it.topics_id)
JOIN   public.topics t ON (it.topic_number = t.topic_number);

-- references
INSERT INTO public.references (reference, topic_id)
SELECT DISTINCT
       ir._references,
       t.id
FROM   import._references ir
JOIN   import.topics it ON (ir.topics_id = it.topics_id)
JOIN   public.topics t ON (it.topic_number = t.topic_number);

-- extract agency from topic number
UPDATE public.topics t
SET    topic_number = SUBSTRING(t.topic_number from '(.*?)\s+\('),
       agency = SUBSTRING(t.topic_number from '.*?\s+\((.*?)\)')
WHERE  t.topic_number LIKE '% %)%';

