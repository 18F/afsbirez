DELETE FROM public.participatingcomponentstopics;
DELETE FROM public.participatingcomponents;
DELETE FROM public.topicskeywords;
DELETE FROM public.topicsareas;
DELETE FROM public.references;
DELETE FROM public.topics;
DELETE FROM public.areas;
DELETE FROM public.programs;
DELETE FROM public.keywords WHERE id NOT IN (SELECT keyword_id FROM public.documentskeywords);
