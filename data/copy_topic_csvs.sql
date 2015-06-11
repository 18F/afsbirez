-- Used by sbirez/management/commands/importtopics to copy CSVs extracted from
-- a MS Access database into the ``sbirez_raw*`` tables
DELETE FROM sbirez_rawtopic;
DELETE FROM sbirez_rawcommand;
DELETE FROM sbirez_rawagency;
\copy sbirez_rawagency from 'data/agency.csv' with csv header;
set constraints all deferred;
begin transaction;
\copy sbirez_rawcommand from 'data/command.csv' with csv header;
delete from sbirez_rawcommand where agency_id not in (select id from sbirez_rawagency);
commit;
\copy sbirez_rawtopic from 'data/topic.csv' with csv header;

-- Solicitation label in the MDB dump is different from that actually used at the
-- SBIR website, so havet the user pass the desired label for the import

UPDATE sbirez_rawtopic
SET    solicitation = ':solicitaion';

-- This will destroy and submitted proposal data

DELETE
FROM   sbirez_proposal
WHERE  topic_id IN
  ( SELECT id FROM sbirez_topic WHERE solicitation_id =
    ( SELECT id FROM sbirez_solicitation WHERE name = :solicitation )
  );

DELETE
FROM   sbirez_reference
WHERE  topic_id IN
  ( SELECT id FROM sbirez_topic WHERE solicitation_id =
    ( SELECT id FROM sbirez_solicitation WHERE name = :solicitation )
  );

DELETE
FROM   sbirez_phase
WHERE  topic_id IN
  ( SELECT id FROM sbirez_topic WHERE solicitation_id =
    ( SELECT id FROM sbirez_solicitation WHERE name = :solicitation)
  );

DELETE
FROM   sbirez_area_topics
WHERE  topic_id IN
  ( SELECT id FROM sbirez_topic WHERE solicitation_id =
    ( SELECT id FROM sbirez_solicitation WHERE name = :solicitation)
  );

DELETE
FROM   sbirez_keyword_topics
WHERE  topic_id IN
  ( SELECT id FROM sbirez_topic WHERE solicitation_id =
    ( SELECT id FROM sbirez_solicitation WHERE name = :solicitation)
  );

DELETE FROM sbirez_keyword WHERE id NOT IN (SELECT keyword_id FROM sbirez_keyword_topics);

DELETE
FROM   sbirez_topic
WHERE  solicitation_id =
  ( SELECT id FROM sbirez_solicitation WHERE name = :solicitation);

INSERT INTO sbirez_topic
  (  topic_number,
     solicitation_id,
     url,
     title,
     agency,
     program,
     description,
     objective,
     fts )
SELECT
    rt.topic,
    S.id AS solicitation_id,
    NULL AS url,
    rt.title,
    ra.name AS agency,
    rt.program,
    (regexp_matches(text, 'DESCRIPTION:(.*?)PHASE I:'))[1] AS description,
    (regexp_matches(text, 'OBJECTIVE:(.*?)DESCRIPTION:'))[1] AS objective,
    TSVECTOR('')  -- will be re-indexed with the `indextopics` management command after completion
FROM sbirez_rawtopic rt
JOIN sbirez_rawagency ra ON rt.agency_id = ra.id
JOIN sbirez_solicitation s ON (s.name = :solicitation);

UPDATE sbirez_topic
SET
       description = regexp_replace(description, '\s+$', ''),
       objective = regexp_replace(objective, '\s+$', '');

UPDATE sbirez_topic
SET
       description = regexp_replace(description, '^\s+', ''),
       objective = regexp_replace(objective, '^\s+', '');

INSERT INTO sbirez_reference
  ( reference, topic_id)
SELECT regexp_split_to_table(trim((regexp_matches(text, 'REFERENCES:(.*)'))[1]), '[\r\n]{2,}'),
       t.id
FROM   sbirez_topic t
JOIN   sbirez_rawtopic rt ON (t.topic_number = rt.topic);

DELETE
FROM   sbirez_reference
WHERE  reference = '';

INSERT INTO sbirez_phase
  ( phase, topic_id)
SELECT regexp_split_to_table(trim((regexp_matches(text, '(PHASE I:.*?)REFERENCES'))[1]), '[\r\n]{2,}(?=PHASE)'),
       t.id
FROM   sbirez_topic t
JOIN   sbirez_rawtopic rt ON (t.topic_number = rt.topic);

UPDATE sbirez_phase
SET    phase = TRIM(phase);

-- keywords

INSERT INTO sbirez_keyword (keyword, created_at, updated_at)
SELECT DISTINCT regexp_split_to_table(lower(keywords), ',\s*'),
       current_timestamp, current_timestamp
FROM sbirez_rawtopic
EXCEPT SELECT keyword, current_timestamp, current_timestamp FROM sbirez_keyword;

WITH rk AS (
  SELECT topic,
         regexp_split_to_table(lower(rt.keywords), ',\s*') keyword
  FROM   sbirez_rawtopic rt )
INSERT INTO sbirez_keyword_topics
  ( keyword_id, topic_id )
SELECT k.id,
       t.id
FROM   sbirez_keyword k
JOIN   rk ON (rk.keyword = lower(k.keyword))
JOIN   sbirez_topic t ON (rk.topic = t.topic_number);

-- areas

INSERT INTO sbirez_area (area)
SELECT * FROM
  ( VALUES ('Air Platform'),
           ('Chem/Bio Defense'),
           ('Information Systems'),
           ('Ground/Sea Vehicles'),
           ('Materials/Processes'),
           ('Biomedical'),
           ('Sensors'),
           ('Electronics'),
           ('Battlespace'),
           ('Human Systems'),
           ('Nuclear Technology')
    ) AS tmp (area)
WHERE NOT EXISTS
  ( SELECT 1 FROM sbirez_area WHERE sbirez_area.area = tmp.area );

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Air Platform')
WHERE  rt.airplatform = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Chem/Bio Defense')
WHERE  rt.chembiodefense = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Information Systems')
WHERE  rt.infosystems = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Ground/Sea Vehicles')
WHERE  rt.groundseaveh = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Materials/Processes')
WHERE  rt.materials = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Biomedical')
WHERE  rt.biomedical = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Sensors')
WHERE  rt.sensors = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Electronics')
WHERE  rt.electronics = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Battlespace')
WHERE  rt.battlespace = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Human Systems')
WHERE  rt.humansystems = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Weapons')
WHERE  rt.weapons = true;

INSERT INTO sbirez_area_topics
  ( area_id, topic_id )
SELECT a.id,
       t.id
FROM   sbirez_rawtopic rt
JOIN   sbirez_topic t ON (rt.topic = t.topic_number)
JOIN   sbirez_area a ON (a.area = 'Nuclear Technology')
WHERE  rt.nucleartech = true;
