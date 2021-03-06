--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: import; Type: SCHEMA; Schema: -; Owner: catherine
--

CREATE SCHEMA import;


ALTER SCHEMA import OWNER TO catherine;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = import, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: _references; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE _references (
    _references character varying(523) NOT NULL,
    topics_id integer NOT NULL
);


ALTER TABLE import._references OWNER TO catherine;

--
-- Name: areas; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE areas (
    areas character varying(19) NOT NULL,
    topics_id integer NOT NULL
);


ALTER TABLE import.areas OWNER TO catherine;

--
-- Name: keywords; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE keywords (
    keywords character varying(59) NOT NULL,
    topics_id integer NOT NULL
);


ALTER TABLE import.keywords OWNER TO catherine;

--
-- Name: participating_components; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE participating_components (
    participating_components character varying(9) NOT NULL,
    topics_id integer NOT NULL
);


ALTER TABLE import.participating_components OWNER TO catherine;

--
-- Name: phases; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE phases (
    phases character varying(512) NOT NULL,
    topics_id integer NOT NULL
);


ALTER TABLE import.phases OWNER TO catherine;

--
-- Name: topics; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE topics (
    topic_number character varying(21) NOT NULL,
    pre_release_date timestamp without time zone NOT NULL,
    url character varying(61) NOT NULL,
    solicitation_id character varying(15) NOT NULL,
    proposals_end_date timestamp without time zone NOT NULL,
    program character varying(4) NOT NULL,
    proposals_begin_date timestamp without time zone NOT NULL,
    objective character varying(250) NOT NULL,
    description character varying(6638) NOT NULL,
    title character varying(154) NOT NULL,
    topics_id integer NOT NULL
);


ALTER TABLE import.topics OWNER TO catherine;

--
-- Name: topics_topics_id_seq; Type: SEQUENCE; Schema: import; Owner: catherine
--

CREATE SEQUENCE topics_topics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE import.topics_topics_id_seq OWNER TO catherine;

--
-- Name: topics_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: import; Owner: catherine
--

ALTER SEQUENCE topics_topics_id_seq OWNED BY topics.topics_id;


SET search_path = public, pg_catalog;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO sbirez;

--
-- Name: areas; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE areas (
    id integer NOT NULL,
    area text NOT NULL
);


ALTER TABLE public.areas OWNER TO sbirez;

--
-- Name: areas_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE areas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.areas_id_seq OWNER TO sbirez;

--
-- Name: areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE areas_id_seq OWNED BY areas.id;


--
-- Name: connections; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE connections (
    id integer NOT NULL,
    user_id integer NOT NULL,
    provider_id character varying(255),
    provider_user_id character varying(255),
    access_token character varying(255),
    secret character varying(255),
    display_name character varying(255),
    full_name character varying(255),
    profile_url character varying(512),
    image_url character varying(512),
    rank integer
);


ALTER TABLE public.connections OWNER TO sbirez;

--
-- Name: connections_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE connections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.connections_id_seq OWNER TO sbirez;

--
-- Name: connections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE connections_id_seq OWNED BY connections.id;


--
-- Name: contents; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE contents (
    id integer NOT NULL,
    version integer,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    change_log text,
    content bytea,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    document_id integer
);


ALTER TABLE public.contents OWNER TO sbirez;

--
-- Name: contents_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE contents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contents_id_seq OWNER TO sbirez;

--
-- Name: contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE contents_id_seq OWNED BY contents.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE documents (
    id integer NOT NULL,
    name character varying(255),
    description text,
    filepath character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    organization_id integer
);


ALTER TABLE public.documents OWNER TO sbirez;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.documents_id_seq OWNER TO sbirez;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE documents_id_seq OWNED BY documents.id;


--
-- Name: documentskeywords; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE documentskeywords (
    document_id integer,
    keyword_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.documentskeywords OWNER TO sbirez;

--
-- Name: documentsproposals; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE documentsproposals (
    document_id integer,
    proposal_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.documentsproposals OWNER TO sbirez;

--
-- Name: keywords; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE keywords (
    id integer NOT NULL,
    keyword character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.keywords OWNER TO sbirez;

--
-- Name: keywords_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE keywords_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.keywords_id_seq OWNER TO sbirez;

--
-- Name: keywords_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE keywords_id_seq OWNED BY keywords.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE organizations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    duns character varying(255),
    ein character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.organizations OWNER TO sbirez;

--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organizations_id_seq OWNER TO sbirez;

--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE organizations_id_seq OWNED BY organizations.id;


--
-- Name: organizationsusers; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE organizationsusers (
    organization_id integer,
    user_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.organizationsusers OWNER TO sbirez;

--
-- Name: participatingcomponents; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE participatingcomponents (
    id integer NOT NULL,
    participatingcomponent text NOT NULL
);


ALTER TABLE public.participatingcomponents OWNER TO sbirez;

--
-- Name: participatingcomponents_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE participatingcomponents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.participatingcomponents_id_seq OWNER TO sbirez;

--
-- Name: participatingcomponents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE participatingcomponents_id_seq OWNED BY participatingcomponents.id;


--
-- Name: participatingcomponentstopics; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE participatingcomponentstopics (
    topic_id integer,
    participatingcomponent_id integer
);


ALTER TABLE public.participatingcomponentstopics OWNER TO sbirez;

--
-- Name: phases; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE phases (
    id integer NOT NULL,
    phase text NOT NULL,
    topic_id integer NOT NULL
);


ALTER TABLE public.phases OWNER TO sbirez;

--
-- Name: phases_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE phases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.phases_id_seq OWNER TO sbirez;

--
-- Name: phases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE phases_id_seq OWNED BY phases.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE programs (
    id integer NOT NULL,
    program text
);


ALTER TABLE public.programs OWNER TO sbirez;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE programs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.programs_id_seq OWNER TO sbirez;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE programs_id_seq OWNED BY programs.id;


--
-- Name: proposals; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE proposals (
    id integer NOT NULL,
    name character varying(255),
    description text,
    sbir_topic_reference character varying(255),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    organization_id integer
);


ALTER TABLE public.proposals OWNER TO sbirez;

--
-- Name: proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE proposals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.proposals_id_seq OWNER TO sbirez;

--
-- Name: proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE proposals_id_seq OWNED BY proposals.id;


--
-- Name: references; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE "references" (
    id integer NOT NULL,
    reference text NOT NULL,
    topic_id integer NOT NULL
);


ALTER TABLE public."references" OWNER TO sbirez;

--
-- Name: references_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE references_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.references_id_seq OWNER TO sbirez;

--
-- Name: references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE references_id_seq OWNED BY "references".id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE roles (
    id integer NOT NULL,
    name character varying(80),
    description character varying(255)
);


ALTER TABLE public.roles OWNER TO sbirez;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO sbirez;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- Name: roles_users; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE roles_users (
    user_id integer,
    role_id integer
);


ALTER TABLE public.roles_users OWNER TO sbirez;

--
-- Name: topics; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE topics (
    id integer NOT NULL,
    topic_number text NOT NULL,
    solicitation_id text NOT NULL,
    url text NOT NULL,
    title text NOT NULL,
    program_id integer,
    description text NOT NULL,
    objective text NOT NULL,
    pre_release_date timestamp without time zone NOT NULL,
    proposals_begin_date timestamp without time zone NOT NULL,
    proposals_end_date timestamp without time zone NOT NULL,
    full_text tsvector,
    agency text
);


ALTER TABLE public.topics OWNER TO sbirez;

--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE topics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_id_seq OWNER TO sbirez;

--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE topics_id_seq OWNED BY topics.id;


--
-- Name: topicsareas; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE topicsareas (
    topic_id integer,
    area_id integer
);


ALTER TABLE public.topicsareas OWNER TO sbirez;

--
-- Name: topicskeywords; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE topicskeywords (
    topic_id integer,
    keyword_id integer
);


ALTER TABLE public.topicskeywords OWNER TO sbirez;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying(128) NOT NULL,
    password character varying(120),
    active boolean,
    secret character varying(64),
    confirmed_at timestamp without time zone,
    last_login_at timestamp without time zone,
    current_login_at timestamp without time zone,
    last_login_ip character varying(100),
    current_login_ip character varying(100),
    login_count integer,
    name character varying(255),
    title character varying(255)
);


ALTER TABLE public.users OWNER TO sbirez;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO sbirez;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: workflows; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE workflows (
    id integer NOT NULL,
    name character varying(255),
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    proposal_id integer
);


ALTER TABLE public.workflows OWNER TO sbirez;

--
-- Name: workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE workflows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workflows_id_seq OWNER TO sbirez;

--
-- Name: workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE workflows_id_seq OWNED BY workflows.id;


--
-- Name: workflowstepresults; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE workflowstepresults (
    id integer NOT NULL,
    result text,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workflowstep_id integer
);


ALTER TABLE public.workflowstepresults OWNER TO sbirez;

--
-- Name: workflowstepresults_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE workflowstepresults_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workflowstepresults_id_seq OWNER TO sbirez;

--
-- Name: workflowstepresults_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE workflowstepresults_id_seq OWNED BY workflowstepresults.id;


--
-- Name: workflowsteps; Type: TABLE; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE TABLE workflowsteps (
    id integer NOT NULL,
    name character varying(255),
    description text,
    work text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    workflow_id integer
);


ALTER TABLE public.workflowsteps OWNER TO sbirez;

--
-- Name: workflowsteps_id_seq; Type: SEQUENCE; Schema: public; Owner: sbirez
--

CREATE SEQUENCE workflowsteps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workflowsteps_id_seq OWNER TO sbirez;

--
-- Name: workflowsteps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sbirez
--

ALTER SEQUENCE workflowsteps_id_seq OWNED BY workflowsteps.id;


SET search_path = import, pg_catalog;

--
-- Name: topics_id; Type: DEFAULT; Schema: import; Owner: catherine
--

ALTER TABLE ONLY topics ALTER COLUMN topics_id SET DEFAULT nextval('topics_topics_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY areas ALTER COLUMN id SET DEFAULT nextval('areas_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY connections ALTER COLUMN id SET DEFAULT nextval('connections_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY contents ALTER COLUMN id SET DEFAULT nextval('contents_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY documents ALTER COLUMN id SET DEFAULT nextval('documents_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY keywords ALTER COLUMN id SET DEFAULT nextval('keywords_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY organizations ALTER COLUMN id SET DEFAULT nextval('organizations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY participatingcomponents ALTER COLUMN id SET DEFAULT nextval('participatingcomponents_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY phases ALTER COLUMN id SET DEFAULT nextval('phases_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY programs ALTER COLUMN id SET DEFAULT nextval('programs_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY proposals ALTER COLUMN id SET DEFAULT nextval('proposals_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY "references" ALTER COLUMN id SET DEFAULT nextval('references_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY topics ALTER COLUMN id SET DEFAULT nextval('topics_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY workflows ALTER COLUMN id SET DEFAULT nextval('workflows_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY workflowstepresults ALTER COLUMN id SET DEFAULT nextval('workflowstepresults_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY workflowsteps ALTER COLUMN id SET DEFAULT nextval('workflowsteps_id_seq'::regclass);


SET search_path = import, pg_catalog;

--
-- Data for Name: _references; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY _references (_references, topics_id) FROM stdin;
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY areas (areas, topics_id) FROM stdin;
\.


--
-- Data for Name: keywords; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY keywords (keywords, topics_id) FROM stdin;
\.


--
-- Data for Name: participating_components; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY participating_components (participating_components, topics_id) FROM stdin;
\.


--
-- Data for Name: phases; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY phases (phases, topics_id) FROM stdin;
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY topics (topic_number, pre_release_date, url, solicitation_id, proposals_end_date, program, proposals_begin_date, objective, description, title, topics_id) FROM stdin;
\.


--
-- Name: topics_topics_id_seq; Type: SEQUENCE SET; Schema: import; Owner: catherine
--

SELECT pg_catalog.setval('topics_topics_id_seq', 2, false);


SET search_path = public, pg_catalog;

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY alembic_version (version_num) FROM stdin;
1871a2a2013
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY areas (id, area) FROM stdin;
1	Space Platforms
8	Air Platform
2	Weapons
7	Information Systems
\.


--
-- Name: areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('areas_id_seq', 11, false);


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY connections (id, user_id, provider_id, provider_user_id, access_token, secret, display_name, full_name, profile_url, image_url, rank) FROM stdin;
\.


--
-- Name: connections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('connections_id_seq', 2, false);


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY contents (id, version, start_date, end_date, change_log, content, created_at, updated_at, document_id) FROM stdin;
\.


--
-- Name: contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('contents_id_seq', 2, false);


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY documents (id, name, description, filepath, created_at, updated_at, organization_id) FROM stdin;
\.


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('documents_id_seq', 2, false);


--
-- Data for Name: documentskeywords; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY documentskeywords (document_id, keyword_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: documentsproposals; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY documentsproposals (document_id, proposal_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: keywords; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY keywords (id, keyword, created_at, updated_at) FROM stdin;
536	detection	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
211	environmental sensors	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
34	Pico Satellite Propulsion	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
788	combined extreme environment strain measurement	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
785	high speed airframes	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
705	turbomachine	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
35	weapon effects	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
824	thermal emission imaging	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
420	lethality	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
403	reconnaissance	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
987	data distribution	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
567	background/foreground separation	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
779	fault analysis	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
905	space-based	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
368	algorithms	2015-02-09 12:48:57.571837-05	2015-02-09 12:48:57.571837-05
\.


--
-- Name: keywords_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('keywords_id_seq', 1011, false);


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY organizations (id, name, duns, ein, created_at, updated_at) FROM stdin;
\.


--
-- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('organizations_id_seq', 2, false);


--
-- Data for Name: organizationsusers; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY organizationsusers (organization_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: participatingcomponents; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY participatingcomponents (id, participatingcomponent) FROM stdin;
5	Air Force
2	ARMY
4	SOCOM
1	DHP
\.


--
-- Name: participatingcomponents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('participatingcomponents_id_seq', 7, false);


--
-- Data for Name: participatingcomponentstopics; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY participatingcomponentstopics (topic_id, participatingcomponent_id) FROM stdin;
11	5
76	5
160	2
114	2
11	2
129	2
11	4
3	4
38	1
14	1
69	5
186	5
51	5
76	2
76	1
160	1
164	4
\.


--
-- Data for Name: phases; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY phases (id, phase, topic_id) FROM stdin;
303	PHASE I:  The contractor will develop the concept(s) through modeling, simulation and analysis.  A small-scale demonstration or computer simulation to show proof-of-principle is highly desirable. Merit and feasibility must be clearly demonstrated during this phase.	11
20	PHASE II:  Develop the imaging exploitation or processing concept and its associated detection algorithms ensuing from Phase I. Via lab sensor prototype with surrogate scenes and/or mining existing data streams, demonstrate the sensing concept and performance of the implemented detection algorithms.	76
95	PHASE III:  DoD applications are for existing cubesats and other small platforms. Commercial applications include the use of distributed nanosatellite constellations for communications and environmental sensing.	160
86	PHASE II:  Develop, demonstrate, and deliver a prototype accelerated information delivery noncontacting, 3-D, full-field strain system that can operate within the combined thermal static/dynamic loading conditions characteristic of a hypersonic flight environment.  The prototype must be suitable for use on component-level tests on high-temperature metallic and nonmetallic aerospace structures.	114
129	PHASE I:  Perform trade study, including aircraft integration impacts to identify best power generation technology.  Design a power generation system, and define the critical functions to be demonstrated in Phase II.  Develop a transition plan and business case analysis. Document technology gaps that prevent development of more effective solutions.	129
475	PHASE II:  Develop, demonstrate, and verify the concept technology using high fidelity simulation environment and benchtop stimuli representing notional environment being sensed.  Deliverables consist of component demonstration hardware, experimental data, and high fidelity simulations.	11
19	PHASE III:  The military and commercial application is useful in modern photographic arts and cinema and may have application in high-speed manufacturing and quality assurance processes.	38
41	PHASE I:  Demonstrate the accuracy and precision of a prototype optical system concept for spatial and temperature resolution.	14
100	PHASE III:  Work with the DoD to demonstrate that the prototype developed during Phase II can also be applied to DoD systems and software. Further demonstrate and deploy the capability within diverse environments.	69
42	PHASE III:  Military Applications:  All networked systems where reconfiguration is required including unmanned aerial systems (UASs), ground vehicles, ships, and aircraft.\r\nCommercial Applications:  Wide spread, including UASs, automotive, medical, and many other implementations.	186
122	PHASE III:  The tracking of in-air disturbances (shock waves, thermal conduction) is both applicable for military and commercial use (educational institutions, manufacturing and assessment of heat flow in housing).  Airline manufacturers can use the technology to build better cabins that withstand explosions.	3
83	PHASE III:  In this phase, the uses of the Phase II product by the military, Homeland Security, law enforcement, and by commercial entities are substantially the same.	51
510	PHASE III:  Military Application: Apply technology to high speed airframes being used to deliver a payload for tactical military missions.  Commercial Application: Apply technology to valid flight sensing on future intercontinental high speed commercial transports, or low earth orbit air vehicles.	11
110	PHASE III:  Military: The techniques and algorithms thus originated may find application in OPIR asset replenishment and modernization initiatives. \r\nCommercial: The techniques and algorithms may enable new value-added data products for civilian remote sensing or dim signal processing.	76
11	PHASE I:  Research detection, acquisition, track, classification, identification, discrimination, and terminal guidance algorithms and processing for long range air launched weapons.  Address standoff engagement of boosting targets. Include inertial requirements, target state data, and in-flight update requirements as necessary.  Show by simulation, the design addresses current and projected threats.	164
\.


--
-- Name: phases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('phases_id_seq', 565, false);


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY programs (id, program) FROM stdin;
2	SBIR
1	STTR
\.


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('programs_id_seq', 3, false);


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY proposals (id, name, description, sbir_topic_reference, start_date, end_date, created_at, updated_at, organization_id) FROM stdin;
\.


--
-- Name: proposals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('proposals_id_seq', 2, false);


--
-- Data for Name: references; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY "references" (id, reference, topic_id) FROM stdin;
185	5. Joint Publication 1-02. Department of Defense Dictionary of Military and Associated Terms. (November 2010, as amended through 15 April 2013).	76
186	1.  MIL-STD-1316D, Fuze Design, Safety Criteria for.	11
405	4. S. Kennedy and T. Mosher, The Rise and Fall of the Capital Asset: An Investigation into the Aerospace Industry Dynamics and Emerging Small Satellite Missions, 20th Annual AIAA/USU Conference on Small Satellites, Aug 14-17, 2006, Logan, UT.	160
67	2. Grant, B.M.B., Stone H.J., and Withers, P.J., et al., "High-temperature strain field measurement using digital image correlation," J. Strain Anal. Eng. 2009; 44(4): 263271.	114
171	5. NASA Factsheet FS-2000-03-010-JSC, "THE 21st CENTURY SPACE SHUTTLE," Space Shuttle Auxiliary Power Units, http://www.nasa.gov/centers/johnson/about/resources/jscfacts/index.html.	129
284	3.  Joint Ordnance Test Procedure (JOTP) - 053; Electrical Stress Test.	11
350	1. One-shot gigapixel camera offers a future beyond flat sensors, Digital Photography Review, Jun 2012, Richard Butler.	38
35	1. Hawkins, W. R., Kidd, C. T., and Carter, J. S.  A New Heat Transfer Capability for Application in Hypersonic Flow Using Multiple Schmidt-Boelter Gages.  AIAA Paper 99-0945.	14
115	2.  Thwarting cyber-attack reconnaissance with inconsistency and deception. Rowe, N and Goh, HC. s.l. : Information Assurance and Security Workshop, 2007. IEEE SMC, 2007.	69
23	5. Opendds web site:  http://www.opendds.org/.	186
220	1.  L. Li, W. Huang, I. Gu, and Q. Tian, Statistical Modeling of Complex Backgrounds for Foreground Object Detection, IEEE Transactions on Image Processing, 13(11):14591472, 2004.	51
81	1.  Natural-background-oriented Schlieren imaging, June 2009, Penn State University, Michael Hargather, Gary Settles.	3
582	2.  Joint Ordnance Test Procedure (JOTP) -052; Guideline for qualification of fuzes, safe and arm (S&A) devices, and ignition safety devices.	11
36	1. Thompson, Loren B, "Missile Defense, The Boost Phase Advantage, The Lexington Institute, 12 June 2009,  http://www.lexingtoninstitute.org/library/resources/documents/MissleDefense/MD_BoostPhaseAdvtg.pdf.	164
295	1. Levy, Bernard C., Principles of Signal Detection and Parameter Estimation, Springer, New York, NY, 2010.	76
\.


--
-- Name: references_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('references_id_seq', 733, false);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY roles (id, name, description) FROM stdin;
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('roles_id_seq', 2, false);


--
-- Data for Name: roles_users; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY roles_users (user_id, role_id) FROM stdin;
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY topics (id, topic_number, solicitation_id, url, title, program_id, description, objective, pre_release_date, proposals_begin_date, proposals_end_date, full_text, agency) FROM stdin;
11	AF151-190  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46471	Environmental Sensors for High Speed Airframes	2	Safety critical systems rely on environmental sensors to determine if an air vehicle is in a valid flight condition. Current environment sensors used for enabling payloads in conventional air launched vehicles include sensing airspeed (wind driven turbines or pitot tubes), sensing of setback at launch, sensing a programmed flight maneuver, etc. New classes of air launched vehicles are being researched that will maintain a sustained Mach 3 to Mach 6+ as they journey to their destination. Environmental sensors are needed to sense the transition from subsonic captive carry flight to sustained hypersonic flight for the purposes of making a valid flight determination that will be used to enable or activate a payload. In addition to sensing hypersonic unique environments, it is desirable to scavenge power from the environment being sensed such that this environment must be present to provide power to a portion of the safety critical subsystem.\r\n\r\nInnovative concepts for sensing valid flight and scavenging power should be able to sense and report the transition from subsonic to hypersonic flight by measuring unique stimuli associated with the different high speed airframes of interest. Concepts should have minimal or no impact on performance of the high speed airframe. The airframes being researched include liquid and solid fuel rocket concepts along with scramjet propulsion. Any concept that needs to access airflow outside of the air vehicle's skin or thermal protection system must address survivability and correct operation.  Sensors mounted inside the airframe must meet the mil temp requirements of -56 degrees C to +75 degrees C. Sensors mounted on or integrated with the propulsion section must survive and operated correctly in their planned environment.\r\n\r\nSafety requirements dictate that the environmental sensors and their support circuitry will be dedicated to supporting the safety critical subsystem. The environmental sensor itself and the wiring between the environmental sensor(s) and the safety critical subsystem cannot be shared with any other subsystem on the airframe. To facilitate safety analysis for determining adverse failure modes of the environmental sensors, sensing devices and support circuitry should use discrete components and discreet logic elements.\r\n\r\nThis topic also needs to address artificial generation of the chosen environment(s) to enable bench top fly out simulations such that environmental sensor performance margins can be tested. If artificial generation of the chosen environment(s) is too complex to achieve under this project during Phase II, then a project plan for developing that environmental simulator needs to be generated as part of this effort.\r\n\r\nUnderstanding the Air Force system safety design philosophy is critical to performing this effort. The references describe the requirements for safety critical sensing and future qualification testing that will be required before the new environmental sensing techniques can be implemented on a tactical airframe.	Investigate innovative environmental sensing techniques that meet the needs of safety critical subsystems across the various classes of hypersonic air vehicles being researched.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'+75':278B,735B,1192B,1649B '-56':274B,731B,1188B,1645B '3':91B,548B,1005B,1462B '6':94B,551B,1008B,1465B 'abl':184B,641B,1098B,1555B 'access':243B,700B,1157B,1614B 'achiev':413B,870B,1327B,1784B 'activ':134B,591B,1048B,1505B 'addit':138B,595B,1052B,1509B 'address':257B,377B,714B,834B,1171B,1291B,1628B,1748B 'advers':352B,809B,1266B,1723B 'air':36B,53B,79B,248B,440B,493B,510B,536B,705B,897B,950B,967B,993B,1162B,1354B,1407B,1424B,1450B,1619B,1811B 'airflow':244B,701B,1158B,1615B 'airfram':6A,12A,18A,24A,206B,222B,224B,266B,345B,481B,663B,679B,681B,723B,802B,938B,1120B,1136B,1138B,1180B,1259B,1395B,1577B,1593B,1595B,1637B,1716B,1852B,1858A,1863A 'airspe':58B,515B,972B,1429B 'along':234B,691B,1148B,1605B 'also':374B,831B,1288B,1745B 'analysi':349B,806B,1263B,1720B,1865A 'artifici':378B,402B,835B,859B,1292B,1316B,1749B,1773B 'associ':200B,657B,1114B,1571B 'bench':387B,844B,1301B,1758B 'c':276B,280B,733B,737B,1190B,1194B,1647B,1651B 'cannot':336B,793B,1250B,1707B 'captiv':111B,568B,1025B,1482B 'carri':112B,569B,1026B,1483B 'chosen':382B,406B,839B,863B,1296B,1320B,1753B,1777B 'circuitri':309B,363B,766B,820B,1223B,1277B,1680B,1734B 'class':77B,534B,991B,1448B 'complex':411B,868B,1325B,1782B 'compon':367B,824B,1281B,1738B 'concept':174B,209B,233B,239B,631B,666B,690B,696B,1088B,1123B,1147B,1153B,1545B,1580B,1604B,1610B 'condit':43B,500B,957B,1414B 'convent':52B,509B,966B,1423B 'correct':260B,294B,717B,751B,1174B,1208B,1631B,1665B 'critic':26B,171B,317B,334B,447B,459B,483B,628B,774B,791B,904B,916B,940B,1085B,1231B,1248B,1361B,1373B,1397B,1542B,1688B,1705B,1818B,1830B 'current':44B,501B,958B,1415B 'dedic':312B,769B,1226B,1683B 'degre':275B,279B,732B,736B,1189B,1193B,1646B,1650B 'describ':454B,911B,1368B,1825B 'design':444B,901B,1358B,1815B 'desir':146B,603B,1060B,1517B 'destin':100B,557B,1014B,1471B 'determin':33B,126B,351B,490B,583B,808B,947B,1040B,1265B,1404B,1497B,1722B 'develop':425B,882B,1339B,1796B 'devic':360B,817B,1274B,1731B 'dictat':301B,758B,1215B,1672B 'differ':203B,660B,1117B,1574B 'discreet':369B,826B,1283B,1740B 'discret':366B,823B,1280B,1737B 'driven':60B,517B,974B,1431B 'effort':437B,451B,894B,908B,1351B,1365B,1808B,1822B 'element':371B,828B,1285B,1742B 'enabl':49B,132B,386B,506B,589B,843B,963B,1046B,1300B,1420B,1503B,1757B 'environ':45B,143B,152B,158B,298B,383B,407B,502B,600B,609B,615B,755B,840B,864B,959B,1057B,1066B,1072B,1212B,1297B,1321B,1416B,1514B,1523B,1529B,1669B,1754B,1778B 'environment':1A,7A,13A,19A,30B,101B,304B,320B,328B,357B,394B,427B,472B,487B,558B,761B,777B,785B,814B,851B,884B,929B,944B,1015B,1218B,1234B,1242B,1271B,1308B,1341B,1386B,1401B,1472B,1675B,1691B,1699B,1728B,1765B,1798B,1843B,1859A 'etc':75B,532B,989B,1446B 'facilit':347B,804B,1261B,1718B 'failur':353B,810B,1267B,1724B 'fault':1864A 'fli':389B,846B,1303B,1760B 'flight':42B,73B,113B,117B,125B,178B,195B,499B,530B,570B,574B,582B,635B,652B,956B,987B,1027B,1031B,1039B,1092B,1109B,1413B,1444B,1484B,1488B,1496B,1549B,1566B 'forc':441B,898B,1355B,1812B 'fuel':231B,688B,1145B,1602B 'futur':462B,919B,1376B,1833B 'generat':379B,403B,432B,836B,860B,889B,1293B,1317B,1346B,1750B,1774B,1803B 'high':4A,10A,16A,22A,204B,220B,661B,677B,1118B,1134B,1575B,1591B,1861A 'hyperson':116B,141B,194B,573B,598B,651B,1030B,1055B,1108B,1487B,1512B,1565B,1857A 'ii':419B,876B,1333B,1790B 'impact':215B,672B,1129B,1586B 'implement':477B,934B,1391B,1848B 'includ':56B,227B,513B,684B,970B,1141B,1427B,1598B 'innov':173B,630B,1087B,1544B 'insid':264B,721B,1178B,1635B 'integr':285B,742B,1199B,1656B 'interest':208B,665B,1122B,1579B 'journey':97B,554B,1011B,1468B 'launch':54B,69B,80B,511B,526B,537B,968B,983B,994B,1425B,1440B,1451B 'liquid':228B,685B,1142B,1599B 'logic':370B,827B,1284B,1741B 'mach':90B,93B,547B,550B,1004B,1007B,1461B,1464B 'maintain':87B,544B,1001B,1458B 'make':122B,579B,1036B,1493B 'maneuv':74B,531B,988B,1445B 'margin':397B,854B,1311B,1768B 'measur':197B,654B,1111B,1568B 'meet':268B,725B,1182B,1639B 'mil':270B,727B,1184B,1641B 'minim':212B,669B,1126B,1583B 'mode':354B,811B,1268B,1725B 'mount':263B,282B,720B,739B,1177B,1196B,1634B,1653B 'must':159B,256B,267B,290B,616B,713B,724B,747B,1073B,1170B,1181B,1204B,1530B,1627B,1638B,1661B 'need':104B,241B,375B,429B,561B,698B,832B,886B,1018B,1155B,1289B,1343B,1475B,1612B,1746B,1800B 'new':76B,471B,533B,928B,990B,1385B,1447B,1842B 'oper':261B,293B,718B,750B,1175B,1207B,1632B,1664B 'outsid':245B,702B,1159B,1616B 'part':434B,891B,1348B,1805B 'payload':50B,136B,507B,593B,964B,1050B,1421B,1507B 'perform':217B,396B,449B,674B,853B,906B,1131B,1310B,1363B,1588B,1767B,1820B 'phase':418B,875B,1332B,1789B 'philosophi':445B,902B,1359B,1816B 'pitot':63B,520B,977B,1434B 'plan':297B,423B,754B,880B,1211B,1337B,1668B,1794B 'portion':167B,624B,1081B,1538B 'power':149B,164B,181B,606B,621B,638B,1063B,1078B,1095B,1520B,1535B,1552B 'present':161B,618B,1075B,1532B 'program':72B,529B,986B,1443B 'project':416B,422B,873B,879B,1330B,1336B,1787B,1793B 'propuls':237B,288B,694B,745B,1151B,1202B,1608B,1659B 'protect':254B,711B,1168B,1625B 'provid':163B,620B,1077B,1534B 'purpos':120B,577B,1034B,1491B 'qualif':463B,920B,1377B,1834B 'refer':453B,910B,1367B,1824B 'reli':28B,485B,942B,1399B 'report':188B,645B,1102B,1559B 'requir':272B,300B,456B,468B,729B,757B,913B,925B,1186B,1214B,1370B,1382B,1643B,1671B,1827B,1839B 'research':84B,226B,541B,683B,998B,1140B,1455B,1597B 'rocket':232B,689B,1146B,1603B 'safeti':25B,170B,299B,316B,333B,348B,443B,458B,482B,627B,756B,773B,790B,805B,900B,915B,939B,1084B,1213B,1230B,1247B,1262B,1357B,1372B,1396B,1541B,1670B,1687B,1704B,1719B,1814B,1829B 'scaveng':148B,180B,605B,637B,1062B,1094B,1519B,1551B 'scramjet':236B,693B,1150B,1607B 'section':289B,746B,1203B,1660B 'sens':57B,65B,70B,106B,140B,154B,176B,186B,359B,460B,473B,514B,522B,527B,563B,597B,611B,633B,643B,816B,917B,930B,971B,979B,984B,1020B,1054B,1068B,1090B,1100B,1273B,1374B,1387B,1428B,1436B,1441B,1477B,1511B,1525B,1547B,1557B,1730B,1831B,1844B 'sensor':2A,8A,14A,20A,31B,46B,102B,262B,281B,305B,321B,329B,358B,395B,488B,503B,559B,719B,738B,762B,778B,786B,815B,852B,945B,960B,1016B,1176B,1195B,1219B,1235B,1243B,1272B,1309B,1402B,1417B,1473B,1633B,1652B,1676B,1692B,1700B,1729B,1766B,1860A 'setback':67B,524B,981B,1438B 'share':338B,795B,1252B,1709B 'simul':391B,428B,848B,885B,1305B,1342B,1762B,1799B 'skin':251B,708B,1165B,1622B 'solid':230B,687B,1144B,1601B 'speed':5A,11A,17A,23A,205B,221B,662B,678B,1119B,1135B,1576B,1592B,1862A 'stimuli':199B,656B,1113B,1570B 'subson':110B,192B,567B,649B,1024B,1106B,1481B,1563B 'subsystem':172B,318B,335B,342B,629B,775B,792B,799B,1086B,1232B,1249B,1256B,1543B,1689B,1706B,1713B 'support':308B,314B,362B,765B,771B,819B,1222B,1228B,1276B,1679B,1685B,1733B 'surviv':258B,291B,715B,748B,1172B,1205B,1629B,1662B 'sustain':89B,115B,546B,572B,1003B,1029B,1460B,1486B 'system':27B,255B,442B,484B,712B,899B,941B,1169B,1356B,1398B,1626B,1813B 'tactic':480B,937B,1394B,1851B 'techniqu':474B,931B,1388B,1845B 'temp':271B,728B,1185B,1642B 'test':400B,464B,857B,921B,1314B,1378B,1771B,1835B 'thermal':253B,710B,1167B,1624B 'top':388B,845B,1302B,1759B 'topic':373B,830B,1287B,1744B 'transit':108B,190B,565B,647B,1022B,1104B,1479B,1561B 'tube':64B,521B,978B,1435B 'turbin':61B,518B,975B,1432B 'understand':438B,895B,1352B,1809B 'uniqu':142B,198B,599B,655B,1056B,1112B,1513B,1569B 'use':47B,130B,365B,504B,587B,822B,961B,1044B,1279B,1418B,1501B,1736B 'valid':41B,124B,177B,498B,581B,634B,955B,1038B,1091B,1412B,1495B,1548B 'vehicl':37B,55B,81B,249B,494B,512B,538B,706B,951B,969B,995B,1163B,1408B,1426B,1452B,1620B 'weapon':1853A,1854A,1855A,1856A 'wind':59B,516B,973B,1430B 'wire':325B,782B,1239B,1696B	\N
76	AF15-AT25  (AirForce)	DoD STTR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46492	Dim Phenomena Detection and Exploitation Techniques for WFOV Staring OPIR	1	The advent of staring imaging for OPIR (Overhead Persistent Infrared) enables detection concepts otherwise impractical for scanning sensors. Of interest are concepts, phenomenology studies, techniques, and algorithms that exploit novel dim phenomena (targets, events, environmental phenomena of military relevance) in support of Battlespace Awareness and Missile Warning (strategic and theater) from existing and potential Wide Field of View (WFOV) OPIR sensors.\r\n\r\nDim phenomena may encompass any events which do not differ strongly in detectable signature (either radiance, spectral emission band, or other characteristics) from the common background, common background clutter, or noise; but which signifies or is caused by an event or object of interest to military users. Accordingly, dim phenomena may include man-created occurrences, such as small explosions (potentially even those occurring inside internal combustion engines); natural occurrences, such as topsoil warming; and combinations of both, such as solar glints off metallic bodies.\r\n\r\nAny dim phenomenon which has implications for the Air Forces Missile Warning mission (that is, any phenomenon which provides advance knowledge of an impending or active missile launch) is of interest. Any dim phenomenon whose detection supports Battlespace Awareness is also of interest. A definition of Battlespace Awareness may be derived from the maritime domain awareness discussion in DoD Dictionary of Military and Associated Terms Joint Publication 1-02 (Ref 5) -- "the effective understanding of everything associated with the battlespace that could impact the mission.\r\n\r\nWFOV, for the purposes of this solicitation, is defined as 6 to 18 degrees earth viewing (from GEO) with pixel footprints (GSD) on the order of 2-3km. The infrared regime for OPIR is considered to span 1-14 microns, with particular interest in the MWIR and especially the SWIR see-to-ground bands. It is anticipated that the most potent enabling concepts will involve novel clutter suppression and mitigation for see-to-ground bands, as well as new track-before-detect approaches. However, novel concepts unrelated to clutter suppression/mitigation or see-to-ground bands will also be considered, especially if their direct relevance to either Missile Warning or Battlespace Awareness can be described.\r\n\r\nThe methods developed under this topic should advance the technology beyond state-of-the-art. It is expected that the potential offeror has a reasonable knowledge of existing state-of-the-art technologies.	Develop concepts and algorithms for exploiting Wide Field of View (WFOV) Overhead Persistent Infrared (OPIR) sensors to detect and distinguish dim or novel signatures.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'-02':286B,672B,1058B,1444B,1830B,2216B,2602B '-14':342B,728B,1114B,1500B,1886B,2272B,2658B '-3':330B,716B,1102B,1488B,1874B,2260B,2646B '1':285B,341B,671B,727B,1057B,1113B,1443B,1499B,1829B,1885B,2215B,2271B,2601B,2657B '18':315B,701B,1087B,1473B,1859B,2245B,2631B '2':329B,715B,1101B,1487B,1873B,2259B,2645B '5':288B,674B,1060B,1446B,1832B,2218B,2604B '6':313B,699B,1085B,1471B,1857B,2243B,2629B 'accord':179B,565B,951B,1337B,1723B,2109B,2495B 'activ':243B,629B,1015B,1401B,1787B,2173B,2559B 'advanc':237B,429B,623B,815B,1009B,1201B,1395B,1587B,1781B,1973B,2167B,2359B,2553B,2745B 'advent':72B,458B,844B,1230B,1616B,2002B,2388B 'air':225B,611B,997B,1383B,1769B,2155B,2541B 'algorithm':97B,483B,869B,1255B,1641B,2027B,2413B,2790A 'also':258B,404B,644B,790B,1030B,1176B,1416B,1562B,1802B,1948B,2188B,2334B,2574B,2720B 'anticip':361B,747B,1133B,1519B,1905B,2291B,2677B 'approach':389B,775B,1161B,1547B,1933B,2319B,2705B 'art':437B,455B,823B,841B,1209B,1227B,1595B,1613B,1981B,1999B,2367B,2385B,2753B,2771B 'associ':281B,294B,667B,680B,1053B,1066B,1439B,1452B,1825B,1838B,2211B,2224B,2597B,2610B 'awar':114B,256B,265B,273B,418B,500B,642B,651B,659B,804B,886B,1028B,1037B,1045B,1190B,1272B,1414B,1423B,1431B,1576B,1658B,1800B,1809B,1817B,1962B,2044B,2186B,2195B,2203B,2348B,2430B,2572B,2581B,2589B,2734B 'background':157B,159B,543B,545B,929B,931B,1315B,1317B,1701B,1703B,2087B,2089B,2473B,2475B 'band':150B,358B,380B,402B,536B,744B,766B,788B,922B,1130B,1152B,1174B,1308B,1516B,1538B,1560B,1694B,1902B,1924B,1946B,2080B,2288B,2310B,2332B,2466B,2674B,2696B,2718B 'base':2797A 'battlespac':113B,255B,264B,297B,417B,499B,641B,650B,683B,803B,885B,1027B,1036B,1069B,1189B,1271B,1413B,1422B,1455B,1575B,1657B,1799B,1808B,1841B,1961B,2043B,2185B,2194B,2227B,2347B,2429B,2571B,2580B,2613B,2733B 'beyond':432B,818B,1204B,1590B,1976B,2362B,2748B 'bodi':216B,602B,988B,1374B,1760B,2146B,2532B 'caus':168B,554B,940B,1326B,1712B,2098B,2484B 'characterist':153B,539B,925B,1311B,1697B,2083B,2469B 'clutter':160B,371B,395B,546B,757B,781B,932B,1143B,1167B,1318B,1529B,1553B,1704B,1915B,1939B,2090B,2301B,2325B,2476B,2687B,2711B 'combin':207B,593B,979B,1365B,1751B,2137B,2523B 'combust':198B,584B,970B,1356B,1742B,2128B,2514B 'common':156B,158B,542B,544B,928B,930B,1314B,1316B,1700B,1702B,2086B,2088B,2472B,2474B 'concept':83B,92B,367B,392B,469B,478B,753B,778B,855B,864B,1139B,1164B,1241B,1250B,1525B,1550B,1627B,1636B,1911B,1936B,2013B,2022B,2297B,2322B,2399B,2408B,2683B,2708B 'consid':338B,406B,724B,792B,1110B,1178B,1496B,1564B,1882B,1950B,2268B,2336B,2654B,2722B 'could':299B,685B,1071B,1457B,1843B,2229B,2615B 'creat':186B,572B,958B,1344B,1730B,2116B,2502B 'defin':311B,697B,1083B,1469B,1855B,2241B,2627B 'definit':262B,648B,1034B,1420B,1806B,2192B,2578B 'degre':316B,702B,1088B,1474B,1860B,2246B,2632B 'deriv':268B,654B,1040B,1426B,1812B,2198B,2584B 'describ':421B,807B,1193B,1579B,1965B,2351B,2737B 'detect':3A,13A,23A,33A,43A,53A,63A,82B,144B,253B,388B,468B,530B,639B,774B,854B,916B,1025B,1160B,1240B,1302B,1411B,1546B,1626B,1688B,1797B,1932B,2012B,2074B,2183B,2318B,2398B,2460B,2569B,2704B,2793A 'develop':424B,810B,1196B,1582B,1968B,2354B,2740B 'dictionari':277B,663B,1049B,1435B,1821B,2207B,2593B 'differ':141B,527B,913B,1299B,1685B,2071B,2457B 'dim':1A,11A,21A,31A,41A,51A,61A,101B,132B,180B,218B,250B,487B,518B,566B,604B,636B,873B,904B,952B,990B,1022B,1259B,1290B,1338B,1376B,1408B,1645B,1676B,1724B,1762B,1794B,2031B,2062B,2110B,2148B,2180B,2417B,2448B,2496B,2534B,2566B 'direct':410B,796B,1182B,1568B,1954B,2340B,2726B 'discuss':274B,660B,1046B,1432B,1818B,2204B,2590B 'dod':276B,662B,1048B,1434B,1820B,2206B,2592B 'domain':272B,658B,1044B,1430B,1816B,2202B,2588B 'earth':317B,703B,1089B,1475B,1861B,2247B,2633B 'effect':290B,676B,1062B,1448B,1834B,2220B,2606B 'either':146B,413B,532B,799B,918B,1185B,1304B,1571B,1690B,1957B,2076B,2343B,2462B,2729B 'electro':2788A 'electro-opt':2787A 'emiss':149B,535B,921B,1307B,1693B,2079B,2465B 'enabl':81B,366B,467B,752B,853B,1138B,1239B,1524B,1625B,1910B,2011B,2296B,2397B,2682B 'encompass':135B,521B,907B,1293B,1679B,2065B,2451B 'engin':199B,585B,971B,1357B,1743B,2129B,2515B 'environment':105B,491B,877B,1263B,1649B,2035B,2421B 'especi':351B,407B,737B,793B,1123B,1179B,1509B,1565B,1895B,1951B,2281B,2337B,2667B,2723B 'even':193B,579B,965B,1351B,1737B,2123B,2509B 'event':104B,137B,171B,490B,523B,557B,876B,909B,943B,1262B,1295B,1329B,1648B,1681B,1715B,2034B,2067B,2101B,2420B,2453B,2487B 'everyth':293B,679B,1065B,1451B,1837B,2223B,2609B 'exist':122B,450B,508B,836B,894B,1222B,1280B,1608B,1666B,1994B,2052B,2380B,2438B,2766B 'expect':440B,826B,1212B,1598B,1984B,2370B,2756B 'exploit':5A,15A,25A,35A,45A,55A,65A,99B,485B,871B,1257B,1643B,2029B,2415B 'explos':191B,577B,963B,1349B,1735B,2121B,2507B 'field':126B,512B,898B,1284B,1670B,2056B,2442B 'footprint':323B,709B,1095B,1481B,1867B,2253B,2639B 'forc':226B,612B,998B,1384B,1770B,2156B,2542B 'geo':320B,706B,1092B,1478B,1864B,2250B,2636B 'glint':213B,599B,985B,1371B,1757B,2143B,2529B 'ground':357B,379B,401B,743B,765B,787B,1129B,1151B,1173B,1515B,1537B,1559B,1901B,1923B,1945B,2287B,2309B,2331B,2673B,2695B,2717B 'gsd':324B,710B,1096B,1482B,1868B,2254B,2640B 'howev':390B,776B,1162B,1548B,1934B,2320B,2706B 'imag':75B,461B,847B,1233B,1619B,2005B,2391B 'impact':300B,686B,1072B,1458B,1844B,2230B,2616B 'impend':241B,627B,1013B,1399B,1785B,2171B,2557B 'implic':222B,608B,994B,1380B,1766B,2152B,2538B 'impract':85B,471B,857B,1243B,1629B,2015B,2401B 'includ':183B,569B,955B,1341B,1727B,2113B,2499B 'infrar':80B,333B,466B,719B,852B,1105B,1238B,1491B,1624B,1877B,2010B,2263B,2396B,2649B,2794A 'insid':196B,582B,968B,1354B,1740B,2126B,2512B 'interest':90B,175B,248B,260B,346B,476B,561B,634B,646B,732B,862B,947B,1020B,1032B,1118B,1248B,1333B,1406B,1418B,1504B,1634B,1719B,1792B,1804B,1890B,2020B,2105B,2178B,2190B,2276B,2406B,2491B,2564B,2576B,2662B 'intern':197B,583B,969B,1355B,1741B,2127B,2513B 'involv':369B,755B,1141B,1527B,1913B,2299B,2685B 'joint':283B,669B,1055B,1441B,1827B,2213B,2599B 'km':331B,717B,1103B,1489B,1875B,2261B,2647B 'knowledg':238B,448B,624B,834B,1010B,1220B,1396B,1606B,1782B,1992B,2168B,2378B,2554B,2764B 'launch':245B,631B,1017B,1403B,1789B,2175B,2561B 'man':185B,571B,957B,1343B,1729B,2115B,2501B 'man-creat':184B,570B,956B,1342B,1728B,2114B,2500B 'maritim':271B,657B,1043B,1429B,1815B,2201B,2587B 'may':134B,182B,266B,520B,568B,652B,906B,954B,1038B,1292B,1340B,1424B,1678B,1726B,1810B,2064B,2112B,2196B,2450B,2498B,2582B 'metal':215B,601B,987B,1373B,1759B,2145B,2531B 'method':423B,809B,1195B,1581B,1967B,2353B,2739B 'micron':343B,729B,1115B,1501B,1887B,2273B,2659B 'militari':108B,177B,279B,494B,563B,665B,880B,949B,1051B,1266B,1335B,1437B,1652B,1721B,1823B,2038B,2107B,2209B,2424B,2493B,2595B 'missil':116B,228B,244B,414B,502B,614B,630B,800B,888B,1000B,1016B,1186B,1274B,1386B,1402B,1572B,1660B,1772B,1788B,1958B,2046B,2158B,2174B,2344B,2432B,2544B,2560B,2730B 'mission':230B,302B,616B,688B,1002B,1074B,1388B,1460B,1774B,1846B,2160B,2232B,2546B,2618B 'mitig':374B,760B,1146B,1532B,1918B,2304B,2690B 'mwir':349B,735B,1121B,1507B,1893B,2279B,2665B 'natur':200B,586B,972B,1358B,1744B,2130B,2516B 'new':384B,770B,1156B,1542B,1928B,2314B,2700B 'nois':162B,548B,934B,1320B,1706B,2092B,2478B 'novel':100B,370B,391B,486B,756B,777B,872B,1142B,1163B,1258B,1528B,1549B,1644B,1914B,1935B,2030B,2300B,2321B,2416B,2686B,2707B 'object':173B,559B,945B,1331B,1717B,2103B,2489B 'occur':195B,581B,967B,1353B,1739B,2125B,2511B 'occurr':187B,201B,573B,587B,959B,973B,1345B,1359B,1731B,1745B,2117B,2131B,2503B,2517B 'offeror':444B,830B,1216B,1602B,1988B,2374B,2760B 'opir':10A,20A,30A,40A,50A,60A,70A,77B,130B,336B,463B,516B,722B,849B,902B,1108B,1235B,1288B,1494B,1621B,1674B,1880B,2007B,2060B,2266B,2393B,2446B,2652B 'optic':2789A 'order':327B,713B,1099B,1485B,1871B,2257B,2643B 'otherwis':84B,470B,856B,1242B,1628B,2014B,2400B 'overhead':78B,464B,850B,1236B,1622B,2008B,2394B 'particular':345B,731B,1117B,1503B,1889B,2275B,2661B 'persist':79B,465B,851B,1237B,1623B,2009B,2395B 'phenomena':2A,12A,22A,32A,42A,52A,62A,102B,106B,133B,181B,488B,492B,519B,567B,874B,878B,905B,953B,1260B,1264B,1291B,1339B,1646B,1650B,1677B,1725B,2032B,2036B,2063B,2111B,2418B,2422B,2449B,2497B 'phenomenolog':93B,479B,865B,1251B,1637B,2023B,2409B 'phenomenon':219B,234B,251B,605B,620B,637B,991B,1006B,1023B,1377B,1392B,1409B,1763B,1778B,1795B,2149B,2164B,2181B,2535B,2550B,2567B 'pixel':322B,708B,1094B,1480B,1866B,2252B,2638B 'platform':2774A,2776A,2778A,2780A,2782A,2784A,2786A 'potent':365B,751B,1137B,1523B,1909B,2295B,2681B 'potenti':124B,192B,443B,510B,578B,829B,896B,964B,1215B,1282B,1350B,1601B,1668B,1736B,1987B,2054B,2122B,2373B,2440B,2508B,2759B 'provid':236B,622B,1008B,1394B,1780B,2166B,2552B 'public':284B,670B,1056B,1442B,1828B,2214B,2600B 'purpos':306B,692B,1078B,1464B,1850B,2236B,2622B 'radianc':147B,533B,919B,1305B,1691B,2077B,2463B 'reason':447B,833B,1219B,1605B,1991B,2377B,2763B 'ref':287B,673B,1059B,1445B,1831B,2217B,2603B 'regim':334B,720B,1106B,1492B,1878B,2264B,2650B 'relev':109B,411B,495B,797B,881B,1183B,1267B,1569B,1653B,1955B,2039B,2341B,2425B,2727B 'scan':87B,473B,859B,1245B,1631B,2017B,2403B 'see':355B,377B,399B,741B,763B,785B,1127B,1149B,1171B,1513B,1535B,1557B,1899B,1921B,1943B,2285B,2307B,2329B,2671B,2693B,2715B 'see-to-ground':354B,376B,398B,740B,762B,784B,1126B,1148B,1170B,1512B,1534B,1556B,1898B,1920B,1942B,2284B,2306B,2328B,2670B,2692B,2714B 'sensor':88B,131B,474B,517B,860B,903B,1246B,1289B,1632B,1675B,2018B,2061B,2404B,2447B,2791A 'signatur':145B,531B,917B,1303B,1689B,2075B,2461B 'signifi':165B,551B,937B,1323B,1709B,2095B,2481B 'small':190B,576B,962B,1348B,1734B,2120B,2506B 'solar':212B,598B,984B,1370B,1756B,2142B,2528B 'solicit':309B,695B,1081B,1467B,1853B,2239B,2625B 'space':2773A,2775A,2777A,2779A,2781A,2783A,2785A,2796A 'space-bas':2795A 'span':340B,726B,1112B,1498B,1884B,2270B,2656B 'spectral':148B,534B,920B,1306B,1692B,2078B,2464B 'stare':9A,19A,29A,39A,49A,59A,69A,74B,460B,846B,1232B,1618B,2004B,2390B 'state':434B,452B,820B,838B,1206B,1224B,1592B,1610B,1978B,1996B,2364B,2382B,2750B,2768B 'state-of-the-art':433B,451B,819B,837B,1205B,1223B,1591B,1609B,1977B,1995B,2363B,2381B,2749B,2767B 'strateg':118B,504B,890B,1276B,1662B,2048B,2434B 'strong':142B,528B,914B,1300B,1686B,2072B,2458B 'studi':94B,480B,866B,1252B,1638B,2024B,2410B 'support':111B,254B,497B,640B,883B,1026B,1269B,1412B,1655B,1798B,2041B,2184B,2427B,2570B 'suppress':372B,758B,1144B,1530B,1916B,2302B,2688B 'suppression/mitigation':396B,782B,1168B,1554B,1940B,2326B,2712B 'swir':353B,739B,1125B,1511B,1897B,2283B,2669B 'target':103B,489B,875B,1261B,1647B,2033B,2419B 'techniqu':6A,16A,26A,36A,46A,56A,66A,95B,481B,867B,1253B,1639B,2025B,2411B 'technolog':431B,456B,817B,842B,1203B,1228B,1589B,1614B,1975B,2000B,2361B,2386B,2747B,2772B 'term':282B,668B,1054B,1440B,1826B,2212B,2598B 'theater':120B,506B,892B,1278B,1664B,2050B,2436B 'topic':427B,813B,1199B,1585B,1971B,2357B,2743B 'topsoil':204B,590B,976B,1362B,1748B,2134B,2520B 'track':386B,772B,1158B,1544B,1930B,2316B,2702B,2792A 'track-before-detect':385B,771B,1157B,1543B,1929B,2315B,2701B 'understand':291B,677B,1063B,1449B,1835B,2221B,2607B 'unrel':393B,779B,1165B,1551B,1937B,2323B,2709B 'user':178B,564B,950B,1336B,1722B,2108B,2494B 'view':128B,318B,514B,704B,900B,1090B,1286B,1476B,1672B,1862B,2058B,2248B,2444B,2634B 'warm':205B,591B,977B,1363B,1749B,2135B,2521B 'warn':117B,229B,415B,503B,615B,801B,889B,1001B,1187B,1275B,1387B,1573B,1661B,1773B,1959B,2047B,2159B,2345B,2433B,2545B,2731B 'well':382B,768B,1154B,1540B,1926B,2312B,2698B 'wfov':8A,18A,28A,38A,48A,58A,68A,129B,303B,515B,689B,901B,1075B,1287B,1461B,1673B,1847B,2059B,2233B,2445B,2619B 'whose':252B,638B,1024B,1410B,1796B,2182B,2568B 'wide':125B,511B,897B,1283B,1669B,2055B,2441B	\N
160	AF151-066  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46371	Monopropellant Thrusters for Cubesats	2	Cubesats are an emerging class of responsive spacecraft.  Cubesats are small, yet capable platforms, with mass between 4 kg (3U) to 10 kg (6U) and constrained volumes of 3,000 cm3 to 6,000 cm3.  These small spacecraft are demonstrating tremendous potential for low-cost access to space. However, militarily useful missions require spacecraft maneuverability. Presently, only cold gas propulsion with low velocity change (delta V) capability (	Enable military utility of cubesats by providing responsive propulsive capability.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'000':46B,50B,114B,118B,182B,186B,250B,254B '10':38B,106B,174B,242B '3':45B,113B,181B,249B '3u':36B,104B,172B,240B '4':34B,102B,170B,238B '6':49B,117B,185B,253B '6u':40B,108B,176B,244B 'access':63B,131B,199B,267B 'capabl':29B,84B,97B,152B,165B,220B,233B,288B 'chang':81B,149B,217B,285B 'chemic':303A 'class':21B,89B,157B,225B 'cm3':47B,51B,115B,119B,183B,187B,251B,255B 'cold':75B,143B,211B,279B 'constrain':42B,110B,178B,246B 'cost':62B,130B,198B,266B 'cubesat':4A,8A,12A,16A,17B,25B,85B,93B,153B,161B,221B,229B,297A 'delta':82B,150B,218B,286B 'demonstr':56B,124B,192B,260B 'emerg':20B,88B,156B,224B 'gas':76B,144B,212B,280B 'howev':66B,134B,202B,270B 'kg':35B,39B,103B,107B,171B,175B,239B,243B 'low':61B,79B,129B,147B,197B,215B,265B,283B 'low-cost':60B,128B,196B,264B 'maneuver':72B,140B,208B,276B 'mass':32B,100B,168B,236B 'micro':302A 'micro-chem':301A 'militarili':67B,135B,203B,271B 'mission':69B,137B,205B,273B 'monopropel':1A,5A,9A,13A,305A 'pico':298A 'platform':30B,98B,166B,234B,290A,292A,294A,296A 'potenti':58B,126B,194B,262B 'present':73B,141B,209B,277B 'propuls':77B,145B,213B,281B,300A,304A 'requir':70B,138B,206B,274B 'respons':23B,91B,159B,227B 'satellit':299A 'small':27B,53B,95B,121B,163B,189B,231B,257B 'space':65B,133B,201B,269B,289A,291A,293A,295A 'spacecraft':24B,54B,71B,92B,122B,139B,160B,190B,207B,228B,258B,275B 'thruster':2A,6A,10A,14A 'tremend':57B,125B,193B,261B 'use':68B,136B,204B,272B 'v':83B,151B,219B,287B 'veloc':80B,148B,216B,284B 'volum':43B,111B,179B,247B 'yet':28B,96B,164B,232B	\N
114	AF151-069  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46374	Noncontacting Full-Field Real-Time Strain Measurement System for Air Platforms in Combined Extreme Environments	2	The U.S. Air Force has a critical need for non-contacting sensor technologies applicable to structural response strain measurements in extreme and harsh environments.  Game-changing reusable high-speed air platforms critical to the global reach and superiority of tomorrows Air Force will experience long-duration, time-varying, non-periodic, combined and intense, thermo-mechanical-acoustic loads over significant portions of their structure.  Designing and fielding these platforms requires the capability to experimentally verify and validate structural response, life prediction and durability assessment models and methods under these complex and challenging loading environments.\r\n\r\nLack of the necessary knowledge has resulted in significant repair and replacement costs for exhaust nozzles and exhaust-washed structures of existing Air Force platforms operating under combined, thermo-acoustic-mechanical loads, even when these loads are far more benign than those associated with hypersonic flight.  A full-field, real-time, strain measurement system would fill a critical gap in the capabilities needed for efficient and effective life testing of these complex structural components and would enable verification and validation of computational methods and models used for structural analysis, design and reliability assessment.\r\n\r\nWhile some noncontact methods, such as full-field digital image correlation (DIC) can go beyond point-wise strain measurements by providing the strain field over a reasonable-sized region of the structure under test, these methods are typically only able to provide detailed strain data after the test is over, due to the large volume of data that must be processed from the images that are used to extract the strain fields. The suitability of these non-contact methods to deliver real-time, full-field, strain measurement, which can be used for feedback control during the test, is severely limited. Moreover, the efficacy of these methods decays at high temperatures due to the de-correlation effects related to radiant light emanating from the sample at the upper end of the temperature regime, which is where the information is often most-desired.\r\n\r\nThe goal of this effort would be to develop a non-contacting, full-field, strain measurement system that can provide real-time or quasi-real-time strain data for structures at temperatures in excess of 1,800 degrees F, simultaneously subjected to high levels of broadband acoustic loading (165 dB, 0 to 1000Hz).\r\n\r\nTo successfully perform the work described in this topic area, offerors may request to use unique facilities/equipment in the possession of the U.S. Government located onsite at Wright-Patterson Air Force Base, Ohio, during the Phase II effort. Accordingly, the following items of base support may be provided, on a no-charge-for-use basis, to the successful offeror, subject to availability:  The facilities/equipment include the FASTCAM SA5 ultra high-speed video system (1 megapixel at 7,500 fps) and a 20,000 lbf electro-dynamic shaker with liquid cooled grips for high temperature testing.	Develop integrated noncontacting full-field real-time strain measurement system to interrogate full-field strains in combined extreme thermal (>1800 degrees F) & acoustic (about 165dB, 0 to 1000Hz) loading conditions for use in hypersonic vehicles.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'0':470B,973B,1476B,1979B '000':558B,1061B,1564B,2067B '1':455B,549B,958B,1052B,1461B,1555B,1964B,2058B '1000hz':472B,975B,1478B,1981B '165':468B,971B,1474B,1977B '20':557B,1060B,1563B,2066B '500':553B,1056B,1559B,2062B '7':552B,1055B,1558B,2061B '800':456B,959B,1462B,1965B 'abl':309B,812B,1315B,1818B 'accord':512B,1015B,1518B,2021B 'acoust':132B,201B,466B,635B,704B,969B,1138B,1207B,1472B,1641B,1710B,1975B 'air':12A,29A,46A,63A,71B,101B,113B,193B,503B,574B,604B,616B,696B,1006B,1077B,1107B,1119B,1199B,1509B,1580B,1610B,1622B,1702B,2012B,2081A,2083A,2085A,2087A 'analysi':262B,765B,1268B,1771B 'applic':83B,586B,1089B,1592B 'area':482B,985B,1488B,1991B 'assess':159B,266B,662B,769B,1165B,1272B,1668B,1775B 'associ':214B,717B,1220B,1723B 'avail':536B,1039B,1542B,2045B 'base':505B,517B,1008B,1020B,1511B,1523B,2014B,2026B 'basi':529B,1032B,1535B,2038B 'benign':211B,714B,1217B,1720B 'beyond':282B,785B,1288B,1791B 'broadband':465B,968B,1471B,1974B 'capabl':147B,235B,650B,738B,1153B,1241B,1656B,1744B 'challeng':167B,670B,1173B,1676B 'chang':96B,599B,1102B,1605B 'charg':526B,1029B,1532B,2035B 'combin':15A,32A,49A,66A,126B,198B,629B,701B,1132B,1204B,1635B,1707B,2089A 'complex':165B,245B,668B,748B,1171B,1251B,1674B,1754B 'compon':247B,750B,1253B,1756B 'comput':255B,758B,1261B,1764B 'contact':80B,348B,428B,583B,851B,931B,1086B,1354B,1434B,1589B,1857B,1937B 'control':366B,869B,1372B,1875B 'cool':566B,1069B,1572B,2075B 'correl':278B,388B,781B,891B,1284B,1394B,1787B,1897B 'cost':182B,685B,1188B,1691B 'critic':75B,103B,231B,578B,606B,734B,1081B,1109B,1237B,1584B,1612B,1740B 'data':314B,326B,447B,817B,829B,950B,1320B,1332B,1453B,1823B,1835B,1956B 'db':469B,972B,1475B,1978B 'de':387B,890B,1393B,1896B 'de-correl':386B,889B,1392B,1895B 'decay':379B,882B,1385B,1888B 'degre':457B,960B,1463B,1966B 'deliv':351B,854B,1357B,1860B 'describ':478B,981B,1484B,1987B 'design':140B,263B,643B,766B,1146B,1269B,1649B,1772B 'desir':415B,918B,1421B,1924B 'detail':312B,815B,1318B,1821B 'develop':424B,927B,1430B,1933B 'dic':279B,782B,1285B,1788B 'digit':276B,779B,1282B,1785B 'due':320B,383B,823B,886B,1326B,1389B,1829B,1892B 'durabl':158B,661B,1164B,1667B 'durat':119B,622B,1125B,1628B 'dynam':562B,1065B,1568B,2071B 'effect':240B,389B,743B,892B,1246B,1395B,1749B,1898B 'efficaci':375B,878B,1381B,1884B 'effici':238B,741B,1244B,1747B 'effort':420B,511B,923B,1014B,1426B,1517B,1929B,2020B 'electro':561B,1064B,1567B,2070B 'electro-dynam':560B,1063B,1566B,2069B 'eman':394B,897B,1400B,1903B 'enabl':250B,753B,1256B,1759B 'end':401B,904B,1407B,1910B 'environ':17A,34A,51A,68A,93B,169B,596B,672B,1099B,1175B,1602B,1678B,2091A 'even':204B,707B,1210B,1713B 'excess':453B,956B,1459B,1962B 'exhaust':184B,188B,687B,691B,1190B,1194B,1693B,1697B 'exhaust-wash':187B,690B,1193B,1696B 'exist':192B,695B,1198B,1701B 'experi':116B,619B,1122B,1625B 'experiment':149B,652B,1155B,1658B 'extract':338B,841B,1344B,1847B 'extrem':16A,33A,50A,67A,90B,593B,1096B,1599B,2090A 'f':458B,961B,1464B,1967B 'facilities/equipment':489B,538B,992B,1041B,1495B,1544B,1998B,2047B 'far':209B,712B,1215B,1718B 'fastcam':541B,1044B,1547B,2050B 'feedback':365B,868B,1371B,1874B 'field':4A,21A,38A,55A,142B,221B,275B,292B,341B,357B,431B,645B,724B,778B,795B,844B,860B,934B,1148B,1227B,1281B,1298B,1347B,1363B,1437B,1651B,1730B,1784B,1801B,1850B,1866B,1940B,2106A 'fill':229B,732B,1235B,1738B 'flight':217B,720B,1223B,1726B 'follow':514B,1017B,1520B,2023B 'forc':72B,114B,194B,504B,575B,617B,697B,1007B,1078B,1120B,1200B,1510B,1581B,1623B,1703B,2013B 'fps':554B,1057B,1560B,2063B 'full':3A,20A,37A,54A,220B,274B,356B,430B,723B,777B,859B,933B,1226B,1280B,1362B,1436B,1729B,1783B,1865B,1939B,2105A 'full-field':2A,19A,36A,53A,219B,273B,355B,429B,722B,776B,858B,932B,1225B,1279B,1361B,1435B,1728B,1782B,1864B,1938B,2104A 'game':95B,598B,1101B,1604B 'game-chang':94B,597B,1100B,1603B 'gap':232B,735B,1238B,1741B 'global':106B,609B,1112B,1615B 'go':281B,784B,1287B,1790B 'goal':417B,920B,1423B,1926B 'govern':496B,999B,1502B,2005B 'grip':567B,1070B,1573B,2076B 'harsh':92B,595B,1098B,1601B 'high':99B,381B,462B,545B,569B,602B,884B,965B,1048B,1072B,1105B,1387B,1468B,1551B,1575B,1608B,1890B,1971B,2054B,2078B,2095A 'high-spe':98B,544B,601B,1047B,1104B,1550B,1607B,2053B 'high-temperatur':2094A 'hyperson':216B,719B,1222B,1725B 'ii':510B,1013B,1516B,2019B 'imag':277B,333B,780B,836B,1283B,1339B,1786B,1842B 'includ':539B,1042B,1545B,2048B 'inform':410B,913B,1416B,1919B 'intens':128B,631B,1134B,1637B 'item':515B,1018B,1521B,2024B 'knowledg':174B,677B,1180B,1683B 'lack':170B,673B,1176B,1679B 'larg':323B,826B,1329B,1832B 'lbf':559B,1062B,1565B,2068B 'level':463B,966B,1469B,1972B 'life':155B,241B,658B,744B,1161B,1247B,1664B,1750B 'light':393B,896B,1399B,1902B 'limit':372B,875B,1378B,1881B 'liquid':565B,1068B,1571B,2074B 'load':133B,168B,203B,207B,467B,636B,671B,706B,710B,970B,1139B,1174B,1209B,1213B,1473B,1642B,1677B,1712B,1716B,1976B 'locat':497B,1000B,1503B,2006B 'long':118B,621B,1124B,1627B 'long-dur':117B,620B,1123B,1626B 'may':484B,519B,987B,1022B,1490B,1525B,1993B,2028B 'measur':9A,26A,43A,60A,88B,226B,287B,359B,433B,591B,729B,790B,862B,936B,1094B,1232B,1293B,1365B,1439B,1597B,1735B,1796B,1868B,1942B,2093A,2098A,2103A,2108A 'mechan':131B,202B,634B,705B,1137B,1208B,1640B,1711B 'megapixel':550B,1053B,1556B,2059B 'method':162B,256B,270B,305B,349B,378B,665B,759B,773B,808B,852B,881B,1168B,1262B,1276B,1311B,1355B,1384B,1671B,1765B,1779B,1814B,1858B,1887B 'model':160B,258B,663B,761B,1166B,1264B,1669B,1767B 'moreov':373B,876B,1379B,1882B 'most-desir':413B,916B,1419B,1922B 'must':328B,831B,1334B,1837B 'necessari':173B,676B,1179B,1682B 'need':76B,236B,579B,739B,1082B,1242B,1585B,1745B 'no-charge-for-us':524B,1027B,1530B,2033B 'non':79B,124B,347B,427B,582B,627B,850B,930B,1085B,1130B,1353B,1433B,1588B,1633B,1856B,1936B 'non-contact':78B,346B,426B,581B,849B,929B,1084B,1352B,1432B,1587B,1855B,1935B 'non-period':123B,626B,1129B,1632B 'noncontact':1A,18A,35A,52A,269B,772B,1275B,1778B 'nozzl':185B,688B,1191B,1694B 'offeror':483B,533B,986B,1036B,1489B,1539B,1992B,2042B 'often':412B,915B,1418B,1921B 'ohio':506B,1009B,1512B,2015B 'onsit':498B,1001B,1504B,2007B 'oper':196B,699B,1202B,1705B 'patterson':502B,1005B,1508B,2011B 'perform':475B,978B,1481B,1984B 'period':125B,628B,1131B,1634B 'phase':509B,1012B,1515B,2018B 'platform':13A,30A,47A,64A,102B,144B,195B,605B,647B,698B,1108B,1150B,1201B,1611B,1653B,1704B,2082A,2084A,2086A,2088A 'point':284B,787B,1290B,1793B 'point-wis':283B,786B,1289B,1792B 'portion':136B,639B,1142B,1645B 'possess':492B,995B,1498B,2001B 'predict':156B,659B,1162B,1665B 'process':330B,833B,1336B,1839B 'provid':289B,311B,437B,521B,792B,814B,940B,1024B,1295B,1317B,1443B,1527B,1798B,1820B,1946B,2030B 'quasi':443B,946B,1449B,1952B 'quasi-real-tim':442B,945B,1448B,1951B 'radiant':392B,895B,1398B,1901B 'reach':107B,610B,1113B,1616B 'real':6A,23A,40A,57A,223B,353B,439B,444B,726B,856B,942B,947B,1229B,1359B,1445B,1450B,1732B,1862B,1948B,1953B,2100A 'real-tim':5A,22A,39A,56A,222B,352B,438B,725B,855B,941B,1228B,1358B,1444B,1731B,1861B,1947B,2099A 'reason':296B,799B,1302B,1805B 'reasonable-s':295B,798B,1301B,1804B 'regim':405B,908B,1411B,1914B 'region':298B,801B,1304B,1807B 'relat':390B,893B,1396B,1899B 'reliabl':265B,768B,1271B,1774B 'repair':179B,682B,1185B,1688B 'replac':181B,684B,1187B,1690B 'request':485B,988B,1491B,1994B 'requir':145B,648B,1151B,1654B 'respons':86B,154B,589B,657B,1092B,1160B,1595B,1663B 'result':176B,679B,1182B,1685B 'reusabl':97B,600B,1103B,1606B 'sa5':542B,1045B,1548B,2051B 'sampl':397B,900B,1403B,1906B 'sensor':81B,584B,1087B,1590B 'sever':371B,874B,1377B,1880B 'shaker':563B,1066B,1569B,2072B 'signific':135B,178B,638B,681B,1141B,1184B,1644B,1687B 'simultan':459B,962B,1465B,1968B 'size':297B,800B,1303B,1806B 'speed':100B,546B,603B,1049B,1106B,1552B,1609B,2055B 'strain':8A,25A,42A,59A,87B,225B,286B,291B,313B,340B,358B,432B,446B,590B,728B,789B,794B,816B,843B,861B,935B,949B,1093B,1231B,1292B,1297B,1319B,1346B,1364B,1438B,1452B,1596B,1734B,1795B,1800B,1822B,1849B,1867B,1941B,1955B,2092A,2097A,2102A,2107A 'structur':85B,139B,153B,190B,246B,261B,301B,449B,588B,642B,656B,693B,749B,764B,804B,952B,1091B,1145B,1159B,1196B,1252B,1267B,1307B,1455B,1594B,1648B,1662B,1699B,1755B,1770B,1810B,1958B 'subject':460B,534B,963B,1037B,1466B,1540B,1969B,2043B 'success':474B,532B,977B,1035B,1480B,1538B,1983B,2041B 'suitabl':343B,846B,1349B,1852B 'superior':109B,612B,1115B,1618B 'support':518B,1021B,1524B,2027B 'system':10A,27A,44A,61A,227B,434B,548B,730B,937B,1051B,1233B,1440B,1554B,1736B,1943B,2057B 'technolog':82B,585B,1088B,1591B 'temperatur':382B,404B,451B,570B,885B,907B,954B,1073B,1388B,1410B,1457B,1576B,1891B,1913B,1960B,2079B,2096A 'test':242B,303B,317B,369B,571B,745B,806B,820B,872B,1074B,1248B,1309B,1323B,1375B,1577B,1751B,1812B,1826B,1878B,2080B 'thermo':130B,200B,633B,703B,1136B,1206B,1639B,1709B 'thermo-acoustic-mechan':199B,702B,1205B,1708B 'thermo-mechanical-acoust':129B,632B,1135B,1638B 'time':7A,24A,41A,58A,121B,224B,354B,440B,445B,624B,727B,857B,943B,948B,1127B,1230B,1360B,1446B,1451B,1630B,1733B,1863B,1949B,1954B,2101A 'time-vari':120B,623B,1126B,1629B 'tomorrow':111B,614B,1117B,1620B 'topic':481B,984B,1487B,1990B 'typic':307B,810B,1313B,1816B 'u.s':70B,495B,573B,998B,1076B,1501B,1579B,2004B 'ultra':543B,1046B,1549B,2052B 'uniqu':488B,991B,1494B,1997B 'upper':400B,903B,1406B,1909B 'use':259B,336B,363B,487B,528B,762B,839B,866B,990B,1031B,1265B,1342B,1369B,1493B,1534B,1768B,1845B,1872B,1996B,2037B 'valid':152B,253B,655B,756B,1158B,1259B,1661B,1762B 'vari':122B,625B,1128B,1631B 'verif':251B,754B,1257B,1760B 'verifi':150B,653B,1156B,1659B 'video':547B,1050B,1553B,2056B 'volum':324B,827B,1330B,1833B 'wash':189B,692B,1195B,1698B 'wise':285B,788B,1291B,1794B 'work':477B,980B,1483B,1986B 'would':228B,249B,421B,731B,752B,924B,1234B,1255B,1427B,1737B,1758B,1930B 'wright':501B,1004B,1507B,2010B 'wright-patterson':500B,1003B,1506B,2009B	\N
129	AF15-AT39  (AirForce)	DoD STTR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46503	Power Generation for Long Duration Hypersonic Platforms	1	This topic pursues novel solutions for power generation for long duration hypersonic applications.   It is anticipated that the electrical power required will be at least 1 MW for 30 to 60 minutes at flight speeds of Mach 5 to Mach 6, at altitudes above 50 kft.  Envisioned combined cycle engine systems will not have a rotating core to drive a gearbox at speeds beyond Mach 3, thus, subsystems that are traditionally mechanically powered through a gearbox must be driven electrically, either directly through motor drives, or indirectly through an electrically pumped/pressured hydraulic accumulator.  Because these platforms are not expected to have rotating core propulsion engines at hypersonic speeds, prime electrical power generation could be driven by very high temperature ram or bleed air, derived from an enviromentally-friendly expendable monopropellant, or possibly even harvested heat  or flow energy using a thermoelectric, thermionic, or magnetohydrodynamic conversion process.  Other power generation processes will be considered if able meet the requirements.  With the high power level and long duration required, stored energy in the form of batteries is not expected to be a solution path unless combined with other power generation systems.  Power generation solutions that also provide significant cooling/heat sinking for mission systems are desired if feasible.   \r\n\r\nOver the past 50 years, there have been several aircraft flown in similar altitudes and high speed ranges of interest, but there are significant differences for the envisioned hypersonic platform due to the use of air-breathing propulsion rather than rocket propulsion.  Possibly the most successful of these rocket-based platforms was the circa 1960s X-15, with demonstrated speeds in excess of Mach 6 and altitudes greater than 200 kft. (1)   The two auxiliary power units on this aircraft used the same monopropellant as the rocket engines, hydrogen peroxide, to drive the electrical generators and hydraulic pumps; and liquid nitrogen to cool the cabin, electronics, and APU bearings. (1),(2)  Similarly, the Space Shuttle also used three monopropellant auxiliary power units (APUs), but used hydrazine, for mechanical power for the hydraulic systems as well as electrical power generation.   Each Shuttle APU was a 400 shaft-hp turbomachine that, through a gearbox, powered two hydraulic pumps and an alternator.  Each turbine could provide 5,000 Btu/min of cooling heat sink for the hydraulic system.  There were also three water spray cooling systems for the pumps and turbomachines. (3),(4)    Aside from the main engines, the highest-risk equipment on the Space Shuttle were the APUs; and there was a strong desire to replace these with batteries and motors for improved safety and reliability. (5)	This objective is to develop novel power generation solutions for long duration hypersonic applications.  The electrical power required will be at least 1 MW for 30 to 60 minutes at flight speeds of Mach 5 to 6, at altitudes above 50 kft.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'-15':294B,729B,1164B,1599B '000':403B,838B,1273B,1708B '1':54B,309B,347B,489B,744B,782B,924B,1179B,1217B,1359B,1614B,1652B '1960':291B,726B,1161B,1596B '2':348B,783B,1218B,1653B '200':307B,742B,1177B,1612B '3':94B,426B,529B,861B,964B,1296B,1399B,1731B '30':57B,492B,927B,1362B '4':427B,862B,1297B,1732B '400':382B,817B,1252B,1687B '5':66B,402B,463B,501B,837B,898B,936B,1272B,1333B,1371B,1707B,1768B '50':73B,238B,508B,673B,943B,1108B,1378B,1543B '6':69B,302B,504B,737B,939B,1172B,1374B,1607B '60':59B,494B,929B,1364B 'abl':184B,619B,1054B,1489B 'accumul':121B,556B,991B,1426B 'air':151B,271B,586B,706B,1021B,1141B,1456B,1576B,1769A,1771A,1773A,1775A 'air-breath':270B,705B,1140B,1575B 'aircraft':244B,317B,679B,752B,1114B,1187B,1549B,1622B 'also':223B,353B,415B,658B,788B,850B,1093B,1223B,1285B,1528B,1658B,1720B 'altern':397B,832B,1267B,1702B 'altitud':71B,248B,304B,506B,683B,739B,941B,1118B,1174B,1376B,1553B,1609B 'anticip':44B,479B,914B,1349B 'applic':41B,476B,911B,1346B 'apu':345B,379B,780B,814B,1215B,1249B,1650B,1684B 'apus':360B,444B,795B,879B,1230B,1314B,1665B,1749B 'asid':428B,863B,1298B,1733B 'auxiliari':312B,357B,747B,792B,1182B,1227B,1617B,1662B,1781A 'base':286B,721B,1156B,1591B 'batteri':203B,455B,638B,890B,1073B,1325B,1508B,1760B 'bear':346B,781B,1216B,1651B 'beyond':92B,527B,962B,1397B 'bleed':150B,585B,1020B,1455B 'breath':272B,707B,1142B,1577B 'btu/min':404B,839B,1274B,1709B 'cabin':342B,777B,1212B,1647B 'circa':290B,725B,1160B,1595B 'combin':76B,213B,511B,648B,946B,1083B,1381B,1518B 'consid':182B,617B,1052B,1487B 'convers':174B,609B,1044B,1479B 'cool':340B,406B,419B,775B,841B,854B,1210B,1276B,1289B,1645B,1711B,1724B 'cooling/heat':226B,661B,1096B,1531B 'core':85B,131B,520B,566B,955B,1001B,1390B,1436B 'could':141B,400B,576B,835B,1011B,1270B,1446B,1705B 'cycl':77B,512B,947B,1382B 'demonstr':296B,731B,1166B,1601B 'deriv':152B,587B,1022B,1457B 'desir':232B,450B,667B,885B,1102B,1320B,1537B,1755B 'differ':259B,694B,1129B,1564B 'direct':110B,545B,980B,1415B 'drive':87B,113B,329B,522B,548B,764B,957B,983B,1199B,1392B,1418B,1634B 'driven':107B,143B,542B,578B,977B,1013B,1412B,1448B 'due':265B,700B,1135B,1570B 'durat':5A,12A,19A,26A,39B,195B,474B,630B,909B,1065B,1344B,1500B 'either':109B,544B,979B,1414B 'electr':47B,108B,118B,138B,331B,374B,482B,543B,553B,573B,766B,809B,917B,978B,988B,1008B,1201B,1244B,1352B,1413B,1423B,1443B,1636B,1679B 'electron':343B,778B,1213B,1648B 'energi':167B,198B,602B,633B,1037B,1068B,1472B,1503B 'engin':78B,133B,325B,432B,513B,568B,760B,867B,948B,1003B,1195B,1302B,1383B,1438B,1630B,1737B 'enviroment':156B,591B,1026B,1461B 'enviromentally-friend':155B,590B,1025B,1460B 'envis':75B,262B,510B,697B,945B,1132B,1380B,1567B 'equip':437B,872B,1307B,1742B 'even':162B,597B,1032B,1467B 'excess':299B,734B,1169B,1604B 'expect':127B,206B,562B,641B,997B,1076B,1432B,1511B 'expend':158B,593B,1028B,1463B 'feasibl':234B,669B,1104B,1539B 'flight':62B,497B,932B,1367B 'flow':166B,601B,1036B,1471B 'flown':245B,680B,1115B,1550B 'form':201B,636B,1071B,1506B 'friend':157B,592B,1027B,1462B 'gearbox':89B,104B,390B,524B,539B,825B,959B,974B,1260B,1394B,1409B,1695B 'generat':2A,9A,16A,23A,36B,140B,178B,217B,220B,332B,376B,471B,575B,613B,652B,655B,767B,811B,906B,1010B,1048B,1087B,1090B,1202B,1246B,1341B,1445B,1483B,1522B,1525B,1637B,1681B,1779A 'greater':305B,740B,1175B,1610B 'harvest':163B,598B,1033B,1468B 'heat':164B,407B,599B,842B,1034B,1277B,1469B,1712B 'high':146B,190B,250B,581B,625B,685B,1016B,1060B,1120B,1451B,1495B,1555B 'highest':435B,870B,1305B,1740B 'highest-risk':434B,869B,1304B,1739B 'hp':385B,820B,1255B,1690B 'hydraul':120B,334B,369B,393B,411B,555B,769B,804B,828B,846B,990B,1204B,1239B,1263B,1281B,1425B,1639B,1674B,1698B,1716B 'hydrazin':363B,798B,1233B,1668B 'hydrogen':326B,761B,1196B,1631B 'hyperson':6A,13A,20A,27A,40B,135B,263B,475B,570B,698B,910B,1005B,1133B,1345B,1440B,1568B,1777A 'improv':459B,894B,1329B,1764B 'indirect':115B,550B,985B,1420B 'interest':254B,689B,1124B,1559B 'kft':74B,308B,509B,743B,944B,1178B,1379B,1613B 'least':53B,488B,923B,1358B 'level':192B,627B,1062B,1497B 'liquid':337B,772B,1207B,1642B 'long':4A,11A,18A,25A,38B,194B,473B,629B,908B,1064B,1343B,1499B 'mach':65B,68B,93B,301B,500B,503B,528B,736B,935B,938B,963B,1171B,1370B,1373B,1398B,1606B 'magnetohydrodynam':173B,608B,1043B,1478B 'main':431B,866B,1301B,1736B 'mechan':100B,365B,535B,800B,970B,1235B,1405B,1670B 'meet':185B,620B,1055B,1490B 'minut':60B,495B,930B,1365B 'mission':229B,664B,1099B,1534B 'monopropel':159B,321B,356B,594B,756B,791B,1029B,1191B,1226B,1464B,1626B,1661B 'motor':112B,457B,547B,892B,982B,1327B,1417B,1762B 'must':105B,540B,975B,1410B 'mw':55B,490B,925B,1360B 'nitrogen':338B,773B,1208B,1643B 'novel':32B,467B,902B,1337B 'past':237B,672B,1107B,1542B 'path':211B,646B,1081B,1516B 'peroxid':327B,762B,1197B,1632B 'platform':7A,14A,21A,28A,124B,264B,287B,559B,699B,722B,994B,1134B,1157B,1429B,1569B,1592B,1770A,1772A,1774A,1776A 'possibl':161B,278B,596B,713B,1031B,1148B,1466B,1583B 'power':1A,8A,15A,22A,35B,48B,101B,139B,177B,191B,216B,219B,313B,358B,366B,375B,391B,470B,483B,536B,574B,612B,626B,651B,654B,748B,793B,801B,810B,826B,905B,918B,971B,1009B,1047B,1061B,1086B,1089B,1183B,1228B,1236B,1245B,1261B,1340B,1353B,1406B,1444B,1482B,1496B,1521B,1524B,1618B,1663B,1671B,1680B,1696B,1778A,1782A 'prime':137B,572B,1007B,1442B 'process':175B,179B,610B,614B,1045B,1049B,1480B,1484B 'propuls':132B,273B,277B,567B,708B,712B,1002B,1143B,1147B,1437B,1578B,1582B 'provid':224B,401B,659B,836B,1094B,1271B,1529B,1706B 'pump':335B,394B,423B,770B,829B,858B,1205B,1264B,1293B,1640B,1699B,1728B 'pumped/pressured':119B,554B,989B,1424B 'pursu':31B,466B,901B,1336B 'ram':148B,583B,1018B,1453B 'rang':252B,687B,1122B,1557B 'rather':274B,709B,1144B,1579B 'reliabl':462B,897B,1332B,1767B 'replac':452B,887B,1322B,1757B 'requir':49B,187B,196B,484B,622B,631B,919B,1057B,1066B,1354B,1492B,1501B 'risk':436B,871B,1306B,1741B 'rocket':276B,285B,324B,711B,720B,759B,1146B,1155B,1194B,1581B,1590B,1629B 'rocket-bas':284B,719B,1154B,1589B 'rotat':84B,130B,519B,565B,954B,1000B,1389B,1435B 'safeti':460B,895B,1330B,1765B 'sever':243B,678B,1113B,1548B 'shaft':384B,819B,1254B,1689B 'shaft-hp':383B,818B,1253B,1688B 'shuttl':352B,378B,441B,787B,813B,876B,1222B,1248B,1311B,1657B,1683B,1746B 'signific':225B,258B,660B,693B,1095B,1128B,1530B,1563B 'similar':247B,349B,682B,784B,1117B,1219B,1552B,1654B 'sink':227B,408B,662B,843B,1097B,1278B,1532B,1713B 'solut':33B,210B,221B,468B,645B,656B,903B,1080B,1091B,1338B,1515B,1526B 'space':351B,440B,786B,875B,1221B,1310B,1656B,1745B 'speed':63B,91B,136B,251B,297B,498B,526B,571B,686B,732B,933B,961B,1006B,1121B,1167B,1368B,1396B,1441B,1556B,1602B 'spray':418B,853B,1288B,1723B 'store':197B,632B,1067B,1502B 'strong':449B,884B,1319B,1754B 'subsystem':96B,531B,966B,1401B 'success':281B,716B,1151B,1586B 'system':79B,218B,230B,370B,412B,420B,514B,653B,665B,805B,847B,855B,949B,1088B,1100B,1240B,1282B,1290B,1384B,1523B,1535B,1675B,1717B,1725B 'temperatur':147B,582B,1017B,1452B 'thermion':171B,606B,1041B,1476B 'thermoelectr':170B,605B,1040B,1475B 'three':355B,416B,790B,851B,1225B,1286B,1660B,1721B 'thus':95B,530B,965B,1400B 'topic':30B,465B,900B,1335B 'tradit':99B,534B,969B,1404B 'turbin':399B,834B,1269B,1704B 'turbomachin':386B,425B,821B,860B,1256B,1295B,1691B,1730B,1780A 'two':311B,392B,746B,827B,1181B,1262B,1616B,1697B 'unit':314B,359B,749B,794B,1184B,1229B,1619B,1664B,1783A 'unless':212B,647B,1082B,1517B 'use':168B,268B,318B,354B,362B,603B,703B,753B,789B,797B,1038B,1138B,1188B,1224B,1232B,1473B,1573B,1623B,1659B,1667B 'water':417B,852B,1287B,1722B 'well':372B,807B,1242B,1677B 'x':293B,728B,1163B,1598B 'year':239B,674B,1109B,1544B	\N
3	AF151-174  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46459	Background-Oriented Schlieren 3D (BOS-3D)	2	Warhead arena testing has been accomplished to characterize the fragmentation of Air Force warheads, but has made little progress in understanding the interaction of shock/pressure waves with surrounding structures, targets and secondary debris.  There is a Department of Defense-wide requirement to understand the lethality and collateral damage effects for current weaponry, as well as those that are designed to minimize collateral damage.  General requirements for a 3D shock wave tracking system are: \r\n1. Integrate with existing and planned arena data collection techniques. \r\n2. Determine a method to map a weapon blast pressure wave and time-sync its movement in order to correlate its movement with fragment position and velocity data (produced by a separate program).	Identify and develop analysis techniques and tools to measure and map the three-dimensional movement of a blast pressure wave after a warhead explosion.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':139B,257B,375B,493B,611B,729B,847B,965B '2':149B,267B,385B,503B,621B,739B,857B,975B '3d':5A,8A,13A,16A,21A,24A,29A,32A,37A,40A,45A,48A,53A,56A,61A,64A,133B,251B,369B,487B,605B,723B,841B,959B 'accomplish':70B,188B,306B,424B,542B,660B,778B,896B 'air':76B,194B,312B,430B,548B,666B,784B,902B 'arena':66B,145B,184B,263B,302B,381B,420B,499B,538B,617B,656B,735B,774B,853B,892B,971B,1023A 'background':2A,10A,18A,26A,34A,42A,50A,58A 'background-ori':1A,9A,17A,25A,33A,41A,49A,57A 'blast':157B,275B,393B,511B,629B,747B,865B,983B 'bos':7A,15A,23A,31A,39A,47A,55A,63A 'bos-3d':6A,14A,22A,30A,38A,46A,54A,62A 'character':72B,190B,308B,426B,544B,662B,780B,898B 'collater':112B,127B,230B,245B,348B,363B,466B,481B,584B,599B,702B,717B,820B,835B,938B,953B,1027A 'collect':147B,265B,383B,501B,619B,737B,855B,973B 'correl':169B,287B,405B,523B,641B,759B,877B,995B 'current':116B,234B,352B,470B,588B,706B,824B,942B 'damag':113B,128B,231B,246B,349B,364B,467B,482B,585B,600B,703B,718B,821B,836B,939B,954B,1028A 'data':146B,177B,264B,295B,382B,413B,500B,531B,618B,649B,736B,767B,854B,885B,972B,1003B 'debri':97B,215B,333B,451B,569B,687B,805B,923B 'defens':104B,222B,340B,458B,576B,694B,812B,930B 'defense-wid':103B,221B,339B,457B,575B,693B,811B,929B 'depart':101B,219B,337B,455B,573B,691B,809B,927B 'design':124B,242B,360B,478B,596B,714B,832B,950B 'determin':150B,268B,386B,504B,622B,740B,858B,976B 'effect':114B,232B,350B,468B,586B,704B,822B,940B,1022A 'exist':142B,260B,378B,496B,614B,732B,850B,968B 'forc':77B,195B,313B,431B,549B,667B,785B,903B 'fragment':74B,173B,192B,291B,310B,409B,428B,527B,546B,645B,664B,763B,782B,881B,900B,999B 'general':129B,247B,365B,483B,601B,719B,837B,955B 'integr':140B,258B,376B,494B,612B,730B,848B,966B 'interact':87B,205B,323B,441B,559B,677B,795B,913B 'lethal':110B,228B,346B,464B,582B,700B,818B,936B,1024A 'littl':82B,200B,318B,436B,554B,672B,790B,908B 'made':81B,199B,317B,435B,553B,671B,789B,907B 'map':154B,272B,390B,508B,626B,744B,862B,980B 'method':152B,270B,388B,506B,624B,742B,860B,978B 'minim':126B,244B,362B,480B,598B,716B,834B,952B 'movement':165B,171B,283B,289B,401B,407B,519B,525B,637B,643B,755B,761B,873B,879B,991B,997B 'munit':1025A 'order':167B,285B,403B,521B,639B,757B,875B,993B 'orient':3A,11A,19A,27A,35A,43A,51A,59A 'plan':144B,262B,380B,498B,616B,734B,852B,970B 'posit':174B,292B,410B,528B,646B,764B,882B,1000B 'pressur':158B,276B,394B,512B,630B,748B,866B,984B,1017A 'produc':178B,296B,414B,532B,650B,768B,886B,1004B 'program':182B,300B,418B,536B,654B,772B,890B,1008B 'progress':83B,201B,319B,437B,555B,673B,791B,909B 'requir':106B,130B,224B,248B,342B,366B,460B,484B,578B,602B,696B,720B,814B,838B,932B,956B 'schlieren':4A,12A,20A,28A,36A,44A,52A,60A,1029A 'secondari':96B,214B,332B,450B,568B,686B,804B,922B 'separ':181B,299B,417B,535B,653B,771B,889B,1007B 'shock':134B,252B,370B,488B,606B,724B,842B,960B,1019A 'shock/pressure':89B,207B,325B,443B,561B,679B,797B,915B 'structur':93B,211B,329B,447B,565B,683B,801B,919B 'surround':92B,210B,328B,446B,564B,682B,800B,918B 'sync':163B,281B,399B,517B,635B,753B,871B,989B 'system':137B,255B,373B,491B,609B,727B,845B,963B 'target':94B,212B,330B,448B,566B,684B,802B,920B 'techniqu':148B,266B,384B,502B,620B,738B,856B,974B 'test':67B,185B,303B,421B,539B,657B,775B,893B,1026A 'time':162B,280B,398B,516B,634B,752B,870B,988B 'time-sync':161B,279B,397B,515B,633B,751B,869B,987B 'track':136B,254B,372B,490B,608B,726B,844B,962B 'understand':85B,108B,203B,226B,321B,344B,439B,462B,557B,580B,675B,698B,793B,816B,911B,934B 'veloc':176B,294B,412B,530B,648B,766B,884B,1002B 'warhead':65B,78B,183B,196B,301B,314B,419B,432B,537B,550B,655B,668B,773B,786B,891B,904B 'wave':90B,135B,159B,208B,253B,277B,326B,371B,395B,444B,489B,513B,562B,607B,631B,680B,725B,749B,798B,843B,867B,916B,961B,985B,1018A,1020A 'weapon':156B,274B,392B,510B,628B,746B,864B,982B,1009A,1010A,1011A,1012A,1013A,1014A,1015A,1016A,1021A 'weaponri':117B,235B,353B,471B,589B,707B,825B,943B 'well':119B,237B,355B,473B,591B,709B,827B,945B 'wide':105B,223B,341B,459B,577B,695B,813B,931B	\N
38	AF151-175  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46460	Gigapixel High-Speed Optical Sensor Tracking (GHOST)	2	Warhead arena testing has been accomplished to characterize the fragmentation of Air Force warheads, but has done so using expensive and time-consuming technologies (usually involving firing into bundles and finding the fragments by hand).  There is a Department of Defense-wide requirement to better characterize the size and shape of fragments from munitions, in order to determine the lethality and collateral damage effects for current high-explosive weaponry, as well as those that are designed to minimize collateral damage.  General requirements for high resolution fragment photography:\r\n1. integration with existing and planned arena data collection techniques; \r\n2. determine how to integrate multiple cameras to produce gigapixel or near gigapixel images with integration times (shutter speeds) of 2-3 microseconds; \r\n\r\nCommercial gigapixel technology is a new field with the first commercial camera already available.  The ability to produce high speed gigapixel images requires the development of the technology discussed here.	Develop photographic technology to enhance our ability to determine fragment physical characteristics in-flight.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'-3':170B,323B,476B,629B,782B,935B '1':139B,292B,445B,598B,751B,904B '2':149B,169B,302B,322B,455B,475B,608B,628B,761B,781B,914B,934B 'abil':187B,340B,493B,646B,799B,952B 'accomplish':54B,207B,360B,513B,666B,819B 'air':60B,213B,366B,519B,672B,825B 'alreadi':184B,337B,490B,643B,796B,949B 'arena':50B,145B,203B,298B,356B,451B,509B,604B,662B,757B,815B,910B,972A 'avail':185B,338B,491B,644B,797B,950B 'better':95B,248B,401B,554B,707B,860B 'bundl':78B,231B,384B,537B,690B,843B 'camera':155B,183B,308B,336B,461B,489B,614B,642B,767B,795B,920B,948B 'character':56B,96B,209B,249B,362B,402B,515B,555B,668B,708B,821B,861B 'collater':112B,130B,265B,283B,418B,436B,571B,589B,724B,742B,877B,895B,976A 'collect':147B,300B,453B,606B,759B,912B 'commerci':172B,182B,325B,335B,478B,488B,631B,641B,784B,794B,937B,947B 'consum':72B,225B,378B,531B,684B,837B 'current':116B,269B,422B,575B,728B,881B 'damag':113B,131B,266B,284B,419B,437B,572B,590B,725B,743B,878B,896B,977A 'data':146B,299B,452B,605B,758B,911B 'defens':91B,244B,397B,550B,703B,856B 'defense-wid':90B,243B,396B,549B,702B,855B 'depart':88B,241B,394B,547B,700B,853B 'design':127B,280B,433B,586B,739B,892B 'determin':108B,150B,261B,303B,414B,456B,567B,609B,720B,762B,873B,915B 'develop':196B,349B,502B,655B,808B,961B 'discuss':200B,353B,506B,659B,812B,965B 'done':65B,218B,371B,524B,677B,830B 'effect':114B,267B,420B,573B,726B,879B,975A 'exist':142B,295B,448B,601B,754B,907B 'expens':68B,221B,374B,527B,680B,833B 'explos':119B,272B,425B,578B,731B,884B 'field':178B,331B,484B,637B,790B,943B 'find':80B,233B,386B,539B,692B,845B 'fire':76B,229B,382B,535B,688B,841B 'first':181B,334B,487B,640B,793B,946B 'forc':61B,214B,367B,520B,673B,826B 'fragment':58B,82B,102B,137B,211B,235B,255B,290B,364B,388B,408B,443B,517B,541B,561B,596B,670B,694B,714B,749B,823B,847B,867B,902B,978A 'general':132B,285B,438B,591B,744B,897B 'ghost':8A,16A,24A,32A,40A,48A 'gigapixel':1A,9A,17A,25A,33A,41A,158B,161B,173B,192B,311B,314B,326B,345B,464B,467B,479B,498B,617B,620B,632B,651B,770B,773B,785B,804B,923B,926B,938B,957B 'hand':84B,237B,390B,543B,696B,849B 'high':3A,11A,19A,27A,35A,43A,118B,135B,190B,271B,288B,343B,424B,441B,496B,577B,594B,649B,730B,747B,802B,883B,900B,955B 'high-explos':117B,270B,423B,576B,729B,882B 'high-spe':2A,10A,18A,26A,34A,42A 'imag':162B,193B,315B,346B,468B,499B,621B,652B,774B,805B,927B,958B 'integr':140B,153B,164B,293B,306B,317B,446B,459B,470B,599B,612B,623B,752B,765B,776B,905B,918B,929B 'involv':75B,228B,381B,534B,687B,840B 'lethal':110B,263B,416B,569B,722B,875B,973A 'microsecond':171B,324B,477B,630B,783B,936B 'minim':129B,282B,435B,588B,741B,894B 'multipl':154B,307B,460B,613B,766B,919B 'munit':104B,257B,410B,563B,716B,869B,979A 'near':160B,313B,466B,619B,772B,925B 'new':177B,330B,483B,636B,789B,942B 'optic':5A,13A,21A,29A,37A,45A 'order':106B,259B,412B,565B,718B,871B 'photographi':138B,291B,444B,597B,750B,903B 'plan':144B,297B,450B,603B,756B,909B 'produc':157B,189B,310B,342B,463B,495B,616B,648B,769B,801B,922B,954B 'requir':93B,133B,194B,246B,286B,347B,399B,439B,500B,552B,592B,653B,705B,745B,806B,858B,898B,959B 'resolut':136B,289B,442B,595B,748B,901B 'sensor':6A,14A,22A,30A,38A,46A 'shape':100B,253B,406B,559B,712B,865B 'shutter':166B,319B,472B,625B,778B,931B 'size':98B,251B,404B,557B,710B,863B 'speed':4A,12A,20A,28A,36A,44A,167B,191B,320B,344B,473B,497B,626B,650B,779B,803B,932B,956B 'techniqu':148B,301B,454B,607B,760B,913B 'technolog':73B,174B,199B,226B,327B,352B,379B,480B,505B,532B,633B,658B,685B,786B,811B,838B,939B,964B 'test':51B,204B,357B,510B,663B,816B,980A 'time':71B,165B,224B,318B,377B,471B,530B,624B,683B,777B,836B,930B 'time-consum':70B,223B,376B,529B,682B,835B 'track':7A,15A,23A,31A,39A,47A 'use':67B,220B,373B,526B,679B,832B 'usual':74B,227B,380B,533B,686B,839B 'warhead':49B,62B,202B,215B,355B,368B,508B,521B,661B,674B,814B,827B 'weapon':966A,967A,968A,969A,970A,971A,974A 'weaponri':120B,273B,426B,579B,732B,885B 'well':122B,275B,428B,581B,734B,887B 'wide':92B,245B,398B,551B,704B,857B	\N
14	AF151-176  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46461	Temperature/Heat Flux Imaging of an Aerodynamic Model in High-Temperature, Continuous-Flow Wind Tunnels	2	Time resolved surface temperature and heat flux measurements of aerodynamic models are needed during continuous, high Mach number, wind tunnel testing.  Currently, heat flux measurements are typically performed at discrete points using small-diameter Schmidt-Boelter heat flux gages that are difficult to install within a model and often damaged at prolonged exposure to high temperatures. Two test facilities at the Arnold Engineering Development Complex, Tenn., with this need are Tunnel B, with a stagnation temperature range from 416 to 750 K and a stagnation pressure range from 40 to 900 psi, and Tunnel C, with a stagnation temperature range from 933 to 1200 K and a stagnation pressure range from 200 to 2000 psi. Noncontact, optical-based techniques that provide continuous, global measurements over the entire model surface are needed to obtain comprehensive data and greatly improve testing efficiency.  Optical methods could be used to measure heat flux directly or measurement of surface temperature, from which heat flux data could be determined using numerical modeling of the test models internal heating.  The optical methods could be based on characteristics of the model surface, such as its infrared emission or changes in emissivity (e.g., direct, multispectral, or hyperspectral thermal imaging). Methods requiring application of coatings to the test model, such as temperature sensitive paint, thermographic phosphors, or high emissivity paint, will be considered, but must easily applied and easily removed to avoid permanent alteration of the test model. Also, coatings must not substantially alter the aerodynamic characteristics of the model surface, such as surface roughness, and the model mold lines. Vapor deposition and plasma spray methods for these coating applications will not be acceptable. A minimum temperature measurement resolution of 0.5 K is needed and a temperature rise of 20 K over 2 minutes is to be expected. A 1 x 1 mm spatial resolution is desired, but 5 x 5 mm will be minimally acceptable. Phase I should provide a preliminary optical-based system design describing the precision and accuracy along with a technical trade study for test facility implementation. Principal components of the design concept should be demonstrated for minimum spatial and temperature resolution. If coatings are to be used, thermal durability and sufficient high light yield should be demonstrated for high temperatures along with the application and removal of the coatings from a surrogate wind tunnel model made of stainless steel.	Develop and demonstrate an innovative imaging method for surface temperature and/or heat flux of an aerodynamic model in a continuous flow wind tunnel for long test durations.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'0.5':381B,780B,1179B,1578B,1977B,2376B '1':400B,402B,799B,801B,1198B,1200B,1597B,1599B,1996B,1998B,2395B,2397B '1200':202B,601B,1000B,1399B,1798B,2197B '2':393B,792B,1191B,1590B,1989B,2388B '20':390B,789B,1188B,1587B,1986B,2385B '200':210B,609B,1008B,1407B,1806B,2205B '2000':212B,611B,1010B,1409B,1808B,2207B '40':187B,586B,985B,1384B,1783B,2182B '416':177B,576B,975B,1374B,1773B,2172B '5':409B,411B,808B,810B,1207B,1209B,1606B,1608B,2005B,2007B,2404B,2406B '750':179B,578B,977B,1376B,1775B,2174B '900':189B,588B,987B,1386B,1785B,2184B '933':200B,599B,998B,1397B,1796B,2195B 'accept':374B,416B,773B,815B,1172B,1214B,1571B,1613B,1970B,2012B,2369B,2411B 'accuraci':432B,831B,1230B,1629B,2028B,2427B 'aerodynam':6A,22A,38A,54A,70A,86A,106B,346B,505B,745B,904B,1144B,1303B,1543B,1702B,1942B,2101B,2341B 'air':2491A,2493A,2495A,2497A,2499A,2501A 'along':433B,477B,832B,876B,1231B,1275B,1630B,1674B,2029B,2073B,2428B,2472B 'also':339B,738B,1137B,1536B,1935B,2334B 'alter':334B,344B,733B,743B,1132B,1142B,1531B,1541B,1930B,1940B,2329B,2339B 'appli':327B,726B,1125B,1524B,1923B,2322B 'applic':303B,370B,480B,702B,769B,879B,1101B,1168B,1278B,1500B,1567B,1677B,1899B,1966B,2076B,2298B,2365B,2475B 'arnold':160B,559B,958B,1357B,1756B,2155B 'avoid':332B,731B,1130B,1529B,1928B,2327B 'b':170B,569B,968B,1367B,1766B,2165B 'base':217B,278B,425B,616B,677B,824B,1015B,1076B,1223B,1414B,1475B,1622B,1813B,1874B,2021B,2212B,2273B,2420B 'boelter':134B,533B,932B,1331B,1730B,2129B 'c':193B,592B,991B,1390B,1789B,2188B 'chang':291B,690B,1089B,1488B,1887B,2286B 'characterist':280B,347B,679B,746B,1078B,1145B,1477B,1544B,1876B,1943B,2275B,2342B 'coat':305B,340B,369B,459B,485B,704B,739B,768B,858B,884B,1103B,1138B,1167B,1257B,1283B,1502B,1537B,1566B,1656B,1682B,1901B,1936B,1965B,2055B,2081B,2300B,2335B,2364B,2454B,2480B 'complex':163B,562B,961B,1360B,1759B,2158B 'compon':444B,843B,1242B,1641B,2040B,2439B 'comprehens':233B,632B,1031B,1430B,1829B,2228B 'concept':448B,847B,1246B,1645B,2044B,2443B 'consid':323B,722B,1121B,1520B,1919B,2318B 'continu':13A,29A,45A,61A,77A,93A,111B,221B,510B,620B,909B,1019B,1308B,1418B,1707B,1817B,2106B,2216B 'continuous-flow':12A,28A,44A,60A,76A,92A 'could':242B,260B,276B,641B,659B,675B,1040B,1058B,1074B,1439B,1457B,1473B,1838B,1856B,1872B,2237B,2255B,2271B 'current':118B,517B,916B,1315B,1714B,2113B 'damag':148B,547B,946B,1345B,1744B,2143B 'data':234B,259B,633B,658B,1032B,1057B,1431B,1456B,1830B,1855B,2229B,2254B 'demonstr':451B,473B,850B,872B,1249B,1271B,1648B,1670B,2047B,2069B,2446B,2468B 'deposit':362B,761B,1160B,1559B,1958B,2357B 'describ':428B,827B,1226B,1625B,2024B,2423B 'design':427B,447B,826B,846B,1225B,1245B,1624B,1644B,2023B,2043B,2422B,2442B 'desir':407B,806B,1205B,1604B,2003B,2402B 'determin':262B,661B,1060B,1459B,1858B,2257B 'develop':162B,561B,960B,1359B,1758B,2157B 'diamet':131B,530B,929B,1328B,1727B,2126B 'difficult':140B,539B,938B,1337B,1736B,2135B 'direct':249B,295B,648B,694B,1047B,1093B,1446B,1492B,1845B,1891B,2244B,2290B 'discret':126B,525B,924B,1323B,1722B,2121B 'durabl':465B,864B,1263B,1662B,2061B,2460B 'e.g':294B,693B,1092B,1491B,1890B,2289B 'easili':326B,329B,725B,728B,1124B,1127B,1523B,1526B,1922B,1925B,2321B,2324B 'effici':239B,638B,1037B,1436B,1835B,2234B 'emiss':289B,293B,319B,688B,692B,718B,1087B,1091B,1117B,1486B,1490B,1516B,1885B,1889B,1915B,2284B,2288B,2314B,2510A 'engin':161B,560B,959B,1358B,1757B,2156B 'entir':226B,625B,1024B,1423B,1822B,2221B 'expect':398B,797B,1196B,1595B,1994B,2393B 'exposur':151B,550B,949B,1348B,1747B,2146B 'facil':157B,441B,556B,840B,955B,1239B,1354B,1638B,1753B,2037B,2152B,2436B 'flow':14A,30A,46A,62A,78A,94A 'flux':2A,18A,34A,50A,66A,82A,103B,120B,136B,248B,258B,502B,519B,535B,647B,657B,901B,918B,934B,1046B,1056B,1300B,1317B,1333B,1445B,1455B,1699B,1716B,1732B,1844B,1854B,2098B,2115B,2131B,2243B,2253B,2507A 'gage':137B,536B,935B,1334B,1733B,2132B 'global':222B,621B,1020B,1419B,1818B,2217B 'great':236B,635B,1034B,1433B,1832B,2231B 'heat':102B,119B,135B,247B,257B,272B,501B,518B,534B,646B,656B,671B,900B,917B,933B,1045B,1055B,1070B,1299B,1316B,1332B,1444B,1454B,1469B,1698B,1715B,1731B,1843B,1853B,1868B,2097B,2114B,2130B,2242B,2252B,2267B,2506A 'high':10A,26A,42A,58A,74A,90A,112B,153B,318B,468B,475B,511B,552B,717B,867B,874B,910B,951B,1116B,1266B,1273B,1309B,1350B,1515B,1665B,1672B,1708B,1749B,1914B,2064B,2071B,2107B,2148B,2313B,2463B,2470B 'high-temperatur':9A,25A,41A,57A,73A,89A 'hyperspectr':298B,697B,1096B,1495B,1894B,2293B,2514A 'imag':3A,19A,35A,51A,67A,83A,300B,699B,1098B,1497B,1896B,2295B,2511A,2515A 'implement':442B,841B,1240B,1639B,2038B,2437B 'improv':237B,636B,1035B,1434B,1833B,2232B 'infrar':288B,687B,1086B,1485B,1884B,2283B 'instal':142B,541B,940B,1339B,1738B,2137B 'intern':271B,670B,1069B,1468B,1867B,2266B 'intrus':2518A 'k':180B,203B,382B,391B,579B,602B,781B,790B,978B,1001B,1180B,1189B,1377B,1400B,1579B,1588B,1776B,1799B,1978B,1987B,2175B,2198B,2377B,2386B 'light':469B,868B,1267B,1666B,2065B,2464B 'line':360B,759B,1158B,1557B,1956B,2355B 'mach':113B,512B,911B,1310B,1709B,2108B 'made':492B,891B,1290B,1689B,2088B,2487B 'measur':104B,121B,223B,246B,251B,378B,503B,520B,622B,645B,650B,777B,902B,919B,1021B,1044B,1049B,1176B,1301B,1318B,1420B,1443B,1448B,1575B,1700B,1717B,1819B,1842B,1847B,1974B,2099B,2116B,2218B,2241B,2246B,2373B,2508A 'method':241B,275B,301B,366B,640B,674B,700B,765B,1039B,1073B,1099B,1164B,1438B,1472B,1498B,1563B,1837B,1871B,1897B,1962B,2236B,2270B,2296B,2361B 'minim':415B,814B,1213B,1612B,2011B,2410B 'minimum':376B,453B,775B,852B,1174B,1251B,1573B,1650B,1972B,2049B,2371B,2448B 'minut':394B,793B,1192B,1591B,1990B,2389B 'mm':403B,412B,802B,811B,1201B,1210B,1600B,1609B,1999B,2008B,2398B,2407B 'model':7A,23A,39A,55A,71A,87A,107B,145B,227B,265B,269B,283B,309B,338B,350B,358B,491B,506B,544B,626B,664B,668B,682B,708B,737B,749B,757B,890B,905B,943B,1025B,1063B,1067B,1081B,1107B,1136B,1148B,1156B,1289B,1304B,1342B,1424B,1462B,1466B,1480B,1506B,1535B,1547B,1555B,1688B,1703B,1741B,1823B,1861B,1865B,1879B,1905B,1934B,1946B,1954B,2087B,2102B,2140B,2222B,2260B,2264B,2278B,2304B,2333B,2345B,2353B,2486B 'mold':359B,758B,1157B,1556B,1955B,2354B 'multispectr':296B,695B,1094B,1493B,1892B,2291B 'must':325B,341B,724B,740B,1123B,1139B,1522B,1538B,1921B,1937B,2320B,2336B 'need':109B,167B,230B,384B,508B,566B,629B,783B,907B,965B,1028B,1182B,1306B,1364B,1427B,1581B,1705B,1763B,1826B,1980B,2104B,2162B,2225B,2379B 'non':2517A 'non-intrus':2516A 'noncontact':214B,613B,1012B,1411B,1810B,2209B 'number':114B,513B,912B,1311B,1710B,2109B 'numer':264B,663B,1062B,1461B,1860B,2259B 'obtain':232B,631B,1030B,1429B,1828B,2227B 'often':147B,546B,945B,1344B,1743B,2142B 'optic':216B,240B,274B,424B,615B,639B,673B,823B,1014B,1038B,1072B,1222B,1413B,1437B,1471B,1621B,1812B,1836B,1870B,2020B,2211B,2235B,2269B,2419B 'optical-bas':215B,423B,614B,822B,1013B,1221B,1412B,1620B,1811B,2019B,2210B,2418B 'paint':314B,320B,713B,719B,1112B,1118B,1511B,1517B,1910B,1916B,2309B,2315B,2505A 'perform':124B,523B,922B,1321B,1720B,2119B 'perman':333B,732B,1131B,1530B,1929B,2328B 'phase':417B,816B,1215B,1614B,2013B,2412B 'phosphor':316B,715B,1114B,1513B,1912B,2311B,2513A 'plasma':364B,763B,1162B,1561B,1960B,2359B 'platform':2492A,2494A,2496A,2498A,2500A,2502A 'point':127B,526B,925B,1324B,1723B,2122B 'precis':430B,829B,1228B,1627B,2026B,2425B 'preliminari':422B,821B,1220B,1619B,2018B,2417B 'pressur':184B,207B,583B,606B,982B,1005B,1381B,1404B,1780B,1803B,2179B,2202B 'princip':443B,842B,1241B,1640B,2039B,2438B 'prolong':150B,549B,948B,1347B,1746B,2145B 'provid':220B,420B,619B,819B,1018B,1218B,1417B,1617B,1816B,2016B,2215B,2415B 'psi':190B,213B,589B,612B,988B,1011B,1387B,1410B,1786B,1809B,2185B,2208B 'rang':175B,185B,198B,208B,574B,584B,597B,607B,973B,983B,996B,1006B,1372B,1382B,1395B,1405B,1771B,1781B,1794B,1804B,2170B,2180B,2193B,2203B 'remov':330B,482B,729B,881B,1128B,1280B,1527B,1679B,1926B,2078B,2325B,2477B 'requir':302B,701B,1100B,1499B,1898B,2297B 'resolut':379B,405B,457B,778B,804B,856B,1177B,1203B,1255B,1576B,1602B,1654B,1975B,2001B,2053B,2374B,2400B,2452B 'resolv':98B,497B,896B,1295B,1694B,2093B 'rise':388B,787B,1186B,1585B,1984B,2383B 'rough':355B,754B,1153B,1552B,1951B,2350B 'schmidt':133B,532B,931B,1330B,1729B,2128B 'schmidt-boelt':132B,531B,930B,1329B,1728B,2127B 'sensit':313B,712B,1111B,1510B,1909B,2308B,2504A 'small':130B,529B,928B,1327B,1726B,2125B 'small-diamet':129B,528B,927B,1326B,1725B,2124B 'spatial':404B,454B,803B,853B,1202B,1252B,1601B,1651B,2000B,2050B,2399B,2449B 'spray':365B,764B,1163B,1562B,1961B,2360B 'stagnat':173B,183B,196B,206B,572B,582B,595B,605B,971B,981B,994B,1004B,1370B,1380B,1393B,1403B,1769B,1779B,1792B,1802B,2168B,2178B,2191B,2201B 'stainless':494B,893B,1292B,1691B,2090B,2489B 'steel':495B,894B,1293B,1692B,2091B,2490B 'studi':438B,837B,1236B,1635B,2034B,2433B 'substanti':343B,742B,1141B,1540B,1939B,2338B 'suffici':467B,866B,1265B,1664B,2063B,2462B 'surfac':99B,228B,253B,284B,351B,354B,498B,627B,652B,683B,750B,753B,897B,1026B,1051B,1082B,1149B,1152B,1296B,1425B,1450B,1481B,1548B,1551B,1695B,1824B,1849B,1880B,1947B,1950B,2094B,2223B,2248B,2279B,2346B,2349B 'surrog':488B,887B,1286B,1685B,2084B,2483B 'system':426B,825B,1224B,1623B,2022B,2421B 'technic':436B,835B,1234B,1633B,2032B,2431B 'techniqu':218B,617B,1016B,1415B,1814B,2213B 'temperatur':11A,27A,43A,59A,75A,91A,100B,154B,174B,197B,254B,312B,377B,387B,456B,476B,499B,553B,573B,596B,653B,711B,776B,786B,855B,875B,898B,952B,972B,995B,1052B,1110B,1175B,1185B,1254B,1274B,1297B,1351B,1371B,1394B,1451B,1509B,1574B,1584B,1653B,1673B,1696B,1750B,1770B,1793B,1850B,1908B,1973B,1983B,2052B,2072B,2095B,2149B,2169B,2192B,2249B,2307B,2372B,2382B,2451B,2471B,2503A,2519A 'temperature/heat':1A,17A,33A,49A,65A,81A 'tenn':164B,563B,962B,1361B,1760B,2159B 'test':117B,156B,238B,268B,308B,337B,440B,516B,555B,637B,667B,707B,736B,839B,915B,954B,1036B,1066B,1106B,1135B,1238B,1314B,1353B,1435B,1465B,1505B,1534B,1637B,1713B,1752B,1834B,1864B,1904B,1933B,2036B,2112B,2151B,2233B,2263B,2303B,2332B,2435B 'thermal':299B,464B,698B,863B,1097B,1262B,1496B,1661B,1895B,2060B,2294B,2459B,2509A 'thermograph':315B,714B,1113B,1512B,1911B,2310B,2512A 'time':97B,496B,895B,1294B,1693B,2092B 'trade':437B,836B,1235B,1634B,2033B,2432B 'tunnel':16A,32A,48A,64A,80A,96A,116B,169B,192B,490B,515B,568B,591B,889B,914B,967B,990B,1288B,1313B,1366B,1389B,1687B,1712B,1765B,1788B,2086B,2111B,2164B,2187B,2485B 'two':155B,554B,953B,1352B,1751B,2150B 'typic':123B,522B,921B,1320B,1719B,2118B 'use':128B,244B,263B,463B,527B,643B,662B,862B,926B,1042B,1061B,1261B,1325B,1441B,1460B,1660B,1724B,1840B,1859B,2059B,2123B,2239B,2258B,2458B 'vapor':361B,760B,1159B,1558B,1957B,2356B 'wind':15A,31A,47A,63A,79A,95A,115B,489B,514B,888B,913B,1287B,1312B,1686B,1711B,2085B,2110B,2484B 'within':143B,542B,941B,1340B,1739B,2138B 'x':401B,410B,800B,809B,1199B,1208B,1598B,1607B,1997B,2006B,2396B,2405B 'yield':470B,869B,1268B,1667B,2066B,2465B	\N
69	AF151-029  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46341	Infrastructure Agnostic Solutions for Anti-Reconnaissance and Cyber Deception	2	The collective stages used to infiltrate a system can be applied to perform a broad range of attacks. However, the most successful assailants rely heavily on the reconnaissance stages, which are primarily divided as passive or active approaches [1]. Passive reconnaissance is a mere collection of information using search engines or various other methods in obtaining publicly available information. This form of information gathering requires entities to practice discretionary posting of information and is often a disregarded tactic used by sophisticated criminals today. The active reconnaissance approach generally results in the act of probing and scanning hosts or servers to determine IP addresses, database information, operating systems used, passwords, usernames, etc. While defensive tactics such as monitoring traffic flow with intrusion detection systems (IDS) or stateful firewalls can help detect active reconnaissance practices, attackers are still able to administer stealthier techniques, such as sending smaller amounts of packets to avoid detection. Since reconnaissance is generally the preceding stage in an attempt to compromise a system, attackers can successfully perform a multitude of attacks on target systems using the gathered information.   As such, increasing the effort required on the part of the adversary to obtain actionable intelligence, or providing inaccurate information altogether can enhance the overall security posture of a system or network [2].\r\n\r\nThere is a need for secure, infrastructure agnostic, solutions designed for cyber agility and anti-reconnaissance.  Such solutions must effectively prevent traffic analysis, and must implement evasive and deceptive techniques such as misreporting source and destination IP and/or MAC addresses, and intermittently changing those addresses.  The technology must be capable of preventing an adversary from accurately determining the direction or volume of information moving within the network, or the size or topology of the network itself, and must be capable of taking measures to prevent, detect, and cease communication with non-compliant or rogue clients within the environment.\r\n\r\nConsideration will be given to solutions that 1) have little to no impact to network performance or the availability of services, 2) those that do not require customized, or otherwise "non-commodity" hardware, 3) those that provide for flexible infrastructure or enclaves that can be set up, re-segmented, and/or taken down quickly, and 4) those that are capable of supporting a PKI or other robust cryptosystem.  The performer should not assume that solely providing a large address space, in which it is difficult for the attacker to predict the next address, provides a sufficient level of assurance.	This topic seeks to provide new and novel approaches to delaying, disrupting and deceiving adversaries engaged in active network reconnaissance.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':99B,381B,512B,794B,925B,1207B,1338B,1620B,1751B,2033B,2164B,2446B '2':273B,395B,686B,808B,1099B,1221B,1512B,1634B,1925B,2047B,2338B,2460B '3':408B,821B,1234B,1647B,2060B,2473B '4':430B,843B,1256B,1669B,2082B,2495B 'abl':197B,610B,1023B,1436B,1849B,2262B 'accur':330B,743B,1156B,1569B,1982B,2395B 'act':152B,565B,978B,1391B,1804B,2217B 'action':255B,668B,1081B,1494B,1907B,2320B 'activ':97B,145B,191B,510B,558B,604B,923B,971B,1017B,1336B,1384B,1430B,1749B,1797B,1843B,2162B,2210B,2256B 'address':163B,314B,319B,453B,467B,576B,727B,732B,866B,880B,989B,1140B,1145B,1279B,1293B,1402B,1553B,1558B,1692B,1706B,1815B,1966B,1971B,2105B,2119B,2228B,2379B,2384B,2518B,2532B 'administ':199B,612B,1025B,1438B,1851B,2264B 'adversari':252B,328B,665B,741B,1078B,1154B,1491B,1567B,1904B,1980B,2317B,2393B 'agil':286B,699B,1112B,1525B,1938B,2351B,2551A 'agnost':2A,12A,22A,32A,42A,52A,281B,694B,1107B,1520B,1933B,2346B 'altogeth':261B,674B,1087B,1500B,1913B,2326B 'amount':206B,619B,1032B,1445B,1858B,2271B 'analysi':297B,710B,1123B,1536B,1949B,2362B 'and/or':312B,425B,725B,838B,1138B,1251B,1551B,1664B,1964B,2077B,2377B,2490B 'anti':6A,16A,26A,36A,46A,56A,289B,702B,1115B,1528B,1941B,2354B 'anti-reconnaiss':5A,15A,25A,35A,45A,55A,288B,701B,1114B,1527B,1940B,2353B 'appli':71B,484B,897B,1310B,1723B,2136B 'approach':98B,147B,511B,560B,924B,973B,1337B,1386B,1750B,1799B,2163B,2212B 'assail':83B,496B,909B,1322B,1735B,2148B 'assum':447B,860B,1273B,1686B,2099B,2512B 'assur':473B,886B,1299B,1712B,2125B,2538B 'attack':78B,194B,226B,233B,462B,491B,607B,639B,646B,875B,904B,1020B,1052B,1059B,1288B,1317B,1433B,1465B,1472B,1701B,1730B,1846B,1878B,1885B,2114B,2143B,2259B,2291B,2298B,2527B,2561A 'attempt':221B,634B,1047B,1460B,1873B,2286B 'avail':118B,392B,531B,805B,944B,1218B,1357B,1631B,1770B,2044B,2183B,2457B 'avoid':210B,623B,1036B,1449B,1862B,2275B,2560A 'awar':2557A 'broad':75B,488B,901B,1314B,1727B,2140B 'capabl':324B,354B,434B,737B,767B,847B,1150B,1180B,1260B,1563B,1593B,1673B,1976B,2006B,2086B,2389B,2419B,2499B 'ceas':362B,775B,1188B,1601B,2014B,2427B 'chang':317B,730B,1143B,1556B,1969B,2382B 'client':370B,783B,1196B,1609B,2022B,2435B 'collect':62B,105B,475B,518B,888B,931B,1301B,1344B,1714B,1757B,2127B,2170B 'commod':406B,819B,1232B,1645B,2058B,2471B 'communic':363B,776B,1189B,1602B,2015B,2428B 'compliant':367B,780B,1193B,1606B,2019B,2432B 'compromis':223B,636B,1049B,1462B,1875B,2288B 'consider':374B,787B,1200B,1613B,2026B,2439B 'crimin':142B,555B,968B,1381B,1794B,2207B 'cryptosystem':442B,855B,1268B,1681B,2094B,2507B 'custom':401B,814B,1227B,1640B,2053B,2466B 'cyber':9A,19A,29A,39A,49A,59A,285B,698B,1111B,1524B,1937B,2350B,2555A 'databas':164B,577B,990B,1403B,1816B,2229B 'decept':10A,20A,30A,40A,50A,60A,303B,716B,1129B,1542B,1955B,2368B,2558A 'defens':173B,586B,999B,1412B,1825B,2238B,2554A 'design':283B,696B,1109B,1522B,1935B,2348B 'destin':310B,723B,1136B,1549B,1962B,2375B 'detect':182B,190B,211B,360B,595B,603B,624B,773B,1008B,1016B,1037B,1186B,1421B,1429B,1450B,1599B,1834B,1842B,1863B,2012B,2247B,2255B,2276B,2425B 'determin':161B,331B,574B,744B,987B,1157B,1400B,1570B,1813B,1983B,2226B,2396B 'difficult':459B,872B,1285B,1698B,2111B,2524B 'direct':333B,746B,1159B,1572B,1985B,2398B 'discretionari':129B,542B,955B,1368B,1781B,2194B 'disregard':137B,550B,963B,1376B,1789B,2202B 'divid':93B,506B,919B,1332B,1745B,2158B 'effect':294B,707B,1120B,1533B,1946B,2359B 'effort':245B,658B,1071B,1484B,1897B,2310B 'enclav':416B,829B,1242B,1655B,2068B,2481B 'engin':110B,523B,936B,1349B,1762B,2175B 'enhanc':263B,676B,1089B,1502B,1915B,2328B 'entiti':126B,539B,952B,1365B,1778B,2191B 'environ':373B,786B,1199B,1612B,2025B,2438B 'etc':171B,584B,997B,1410B,1823B,2236B 'evas':301B,714B,1127B,1540B,1953B,2366B 'firewal':187B,600B,1013B,1426B,1839B,2252B 'flexibl':413B,826B,1239B,1652B,2065B,2478B 'flow':179B,592B,1005B,1418B,1831B,2244B 'form':121B,534B,947B,1360B,1773B,2186B 'gather':124B,239B,537B,652B,950B,1065B,1363B,1478B,1776B,1891B,2189B,2304B 'general':148B,215B,561B,628B,974B,1041B,1387B,1454B,1800B,1867B,2213B,2280B 'given':377B,790B,1203B,1616B,2029B,2442B 'hardwar':407B,820B,1233B,1646B,2059B,2472B 'heavili':85B,498B,911B,1324B,1737B,2150B 'help':189B,602B,1015B,1428B,1841B,2254B 'host':157B,570B,983B,1396B,1809B,2222B 'howev':79B,492B,905B,1318B,1731B,2144B 'id':184B,597B,1010B,1423B,1836B,2249B 'impact':386B,799B,1212B,1625B,2038B,2451B 'implement':300B,713B,1126B,1539B,1952B,2365B 'inaccur':259B,672B,1085B,1498B,1911B,2324B 'increas':243B,656B,1069B,1482B,1895B,2308B 'infiltr':66B,479B,892B,1305B,1718B,2131B 'inform':107B,119B,123B,132B,165B,240B,260B,337B,520B,532B,536B,545B,578B,653B,673B,750B,933B,945B,949B,958B,991B,1066B,1086B,1163B,1346B,1358B,1362B,1371B,1404B,1479B,1499B,1576B,1759B,1771B,1775B,1784B,1817B,1892B,1912B,1989B,2172B,2184B,2188B,2197B,2230B,2305B,2325B,2402B,2539A,2541A,2543A,2545A,2547A,2549A 'infrastructur':1A,11A,21A,31A,41A,51A,280B,414B,693B,827B,1106B,1240B,1519B,1653B,1932B,2066B,2345B,2479B 'intellig':256B,669B,1082B,1495B,1908B,2321B 'intermitt':316B,729B,1142B,1555B,1968B,2381B 'intrus':181B,594B,1007B,1420B,1833B,2246B 'ip':162B,311B,575B,724B,988B,1137B,1401B,1550B,1814B,1963B,2227B,2376B 'larg':452B,865B,1278B,1691B,2104B,2517B 'level':471B,884B,1297B,1710B,2123B,2536B 'littl':383B,796B,1209B,1622B,2035B,2448B 'mac':313B,726B,1139B,1552B,1965B,2378B 'measur':357B,770B,1183B,1596B,2009B,2422B 'mere':104B,517B,930B,1343B,1756B,2169B 'method':114B,527B,940B,1353B,1766B,2179B 'misreport':307B,720B,1133B,1546B,1959B,2372B 'monitor':177B,590B,1003B,1416B,1829B,2242B 'move':338B,751B,1164B,1577B,1990B,2403B,2552A 'multitud':231B,644B,1057B,1470B,1883B,2296B 'must':293B,299B,322B,352B,706B,712B,735B,765B,1119B,1125B,1148B,1178B,1532B,1538B,1561B,1591B,1945B,1951B,1974B,2004B,2358B,2364B,2387B,2417B 'need':277B,690B,1103B,1516B,1929B,2342B 'network':272B,341B,349B,388B,685B,754B,762B,801B,1098B,1167B,1175B,1214B,1511B,1580B,1588B,1627B,1924B,1993B,2001B,2040B,2337B,2406B,2414B,2453B 'next':466B,879B,1292B,1705B,2118B,2531B 'non':366B,405B,779B,818B,1192B,1231B,1605B,1644B,2018B,2057B,2431B,2470B 'non-commod':404B,817B,1230B,1643B,2056B,2469B 'non-compli':365B,778B,1191B,1604B,2017B,2430B 'obtain':116B,254B,529B,667B,942B,1080B,1355B,1493B,1768B,1906B,2181B,2319B 'often':135B,548B,961B,1374B,1787B,2200B 'oper':166B,579B,992B,1405B,1818B,2231B 'otherwis':403B,816B,1229B,1642B,2055B,2468B 'overal':265B,678B,1091B,1504B,1917B,2330B 'packet':208B,621B,1034B,1447B,1860B,2273B 'part':249B,662B,1075B,1488B,1901B,2314B 'passiv':95B,100B,508B,513B,921B,926B,1334B,1339B,1747B,1752B,2160B,2165B 'password':169B,582B,995B,1408B,1821B,2234B 'perform':73B,229B,389B,444B,486B,642B,802B,857B,899B,1055B,1215B,1270B,1312B,1468B,1628B,1683B,1725B,1881B,2041B,2096B,2138B,2294B,2454B,2509B 'pki':438B,851B,1264B,1677B,2090B,2503B 'post':130B,543B,956B,1369B,1782B,2195B 'postur':267B,680B,1093B,1506B,1919B,2332B 'practic':128B,193B,541B,606B,954B,1019B,1367B,1432B,1780B,1845B,2193B,2258B 'preced':217B,630B,1043B,1456B,1869B,2282B 'predict':464B,877B,1290B,1703B,2116B,2529B 'prevent':295B,326B,359B,708B,739B,772B,1121B,1152B,1185B,1534B,1565B,1598B,1947B,1978B,2011B,2360B,2391B,2424B 'primarili':92B,505B,918B,1331B,1744B,2157B 'probe':154B,567B,980B,1393B,1806B,2219B 'provid':258B,411B,450B,468B,671B,824B,863B,881B,1084B,1237B,1276B,1294B,1497B,1650B,1689B,1707B,1910B,2063B,2102B,2120B,2323B,2476B,2515B,2533B 'public':117B,530B,943B,1356B,1769B,2182B 'quick':428B,841B,1254B,1667B,2080B,2493B 'rang':76B,489B,902B,1315B,1728B,2141B 're':423B,836B,1249B,1662B,2075B,2488B 're-seg':422B,835B,1248B,1661B,2074B,2487B 'reconnaiss':7A,17A,27A,37A,47A,57A,88B,101B,146B,192B,213B,290B,501B,514B,559B,605B,626B,703B,914B,927B,972B,1018B,1039B,1116B,1327B,1340B,1385B,1431B,1452B,1529B,1740B,1753B,1798B,1844B,1865B,1942B,2153B,2166B,2211B,2257B,2278B,2355B,2559A 'reli':84B,497B,910B,1323B,1736B,2149B 'requir':125B,246B,400B,538B,659B,813B,951B,1072B,1226B,1364B,1485B,1639B,1777B,1898B,2052B,2190B,2311B,2465B 'result':149B,562B,975B,1388B,1801B,2214B 'robust':441B,854B,1267B,1680B,2093B,2506B 'rogu':369B,782B,1195B,1608B,2021B,2434B 'scan':156B,569B,982B,1395B,1808B,2221B 'search':109B,522B,935B,1348B,1761B,2174B 'secur':266B,279B,679B,692B,1092B,1105B,1505B,1518B,1918B,1931B,2331B,2344B 'segment':424B,837B,1250B,1663B,2076B,2489B 'send':204B,617B,1030B,1443B,1856B,2269B 'server':159B,572B,985B,1398B,1811B,2224B 'servic':394B,807B,1220B,1633B,2046B,2459B 'set':420B,833B,1246B,1659B,2072B,2485B 'sinc':212B,625B,1038B,1451B,1864B,2277B 'situat':2556A 'size':344B,757B,1170B,1583B,1996B,2409B 'smaller':205B,618B,1031B,1444B,1857B,2270B 'sole':449B,862B,1275B,1688B,2101B,2514B 'solut':3A,13A,23A,33A,43A,53A,282B,292B,379B,695B,705B,792B,1108B,1118B,1205B,1521B,1531B,1618B,1934B,1944B,2031B,2347B,2357B,2444B 'sophist':141B,554B,967B,1380B,1793B,2206B 'sourc':308B,721B,1134B,1547B,1960B,2373B 'space':454B,867B,1280B,1693B,2106B,2519B 'stage':63B,89B,218B,476B,502B,631B,889B,915B,1044B,1302B,1328B,1457B,1715B,1741B,1870B,2128B,2154B,2283B 'state':186B,599B,1012B,1425B,1838B,2251B 'stealthier':200B,613B,1026B,1439B,1852B,2265B 'still':196B,609B,1022B,1435B,1848B,2261B 'success':82B,228B,495B,641B,908B,1054B,1321B,1467B,1734B,1880B,2147B,2293B 'suffici':470B,883B,1296B,1709B,2122B,2535B 'support':436B,849B,1262B,1675B,2088B,2501B 'system':68B,167B,183B,225B,236B,270B,481B,580B,596B,638B,649B,683B,894B,993B,1009B,1051B,1062B,1096B,1307B,1406B,1422B,1464B,1475B,1509B,1720B,1819B,1835B,1877B,1888B,1922B,2133B,2232B,2248B,2290B,2301B,2335B,2540A,2542A,2544A,2546A,2548A,2550A 'tactic':138B,174B,551B,587B,964B,1000B,1377B,1413B,1790B,1826B,2203B,2239B 'take':356B,769B,1182B,1595B,2008B,2421B 'taken':426B,839B,1252B,1665B,2078B,2491B 'target':235B,648B,1061B,1474B,1887B,2300B,2553A 'techniqu':201B,304B,614B,717B,1027B,1130B,1440B,1543B,1853B,1956B,2266B,2369B 'technolog':321B,734B,1147B,1560B,1973B,2386B 'today':143B,556B,969B,1382B,1795B,2208B 'topolog':346B,759B,1172B,1585B,1998B,2411B 'traffic':178B,296B,591B,709B,1004B,1122B,1417B,1535B,1830B,1948B,2243B,2361B 'use':64B,108B,139B,168B,237B,477B,521B,552B,581B,650B,890B,934B,965B,994B,1063B,1303B,1347B,1378B,1407B,1476B,1716B,1760B,1791B,1820B,1889B,2129B,2173B,2204B,2233B,2302B 'usernam':170B,583B,996B,1409B,1822B,2235B 'various':112B,525B,938B,1351B,1764B,2177B 'volum':335B,748B,1161B,1574B,1987B,2400B 'within':339B,371B,752B,784B,1165B,1197B,1578B,1610B,1991B,2023B,2404B,2436B	\N
186	AF151-045  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46355	Safety Critical Implementations of Real-Time Data Distribution Middleware	2	Real-time data distribution middleware such as implementations of the Object Management Group (OMG) Distributed Data Service (DDS) standard or the open source ZeroMQ project enable flexible network systems architectures, data distribution across such networks, and the maintenance of consistency and concurrency of such data across a network.  The capabilities of such middleware to support redundancy and synchronization for data distribution have made them candidates for use in safety critical systems.  However, although commercial implementations of some products are available, they are generally not certified for safety critical use.  Such real time assured data distribution and system reconfiguration capabilities would be valuable in force reconfiguration, testing, training, and other uses.  The software must be suitable for use on a long haul network with imperfect communication links and have general purpose application programming interfaces (APIs) suitable for at least one and preferably multiple general purpose language. Phase I work would Propose a mature real-time data distribution middleware implementation, show that it can be safety qualified in accordance with a safety standard in wide use such as IEC 61508 (CIL 4), RTCA DO 278A (Level 1), RTCA DO 178C (Level A), or IEEE 12207 (Level 4), demonstrate its capability of supporting up to 200 nodes with 1000 objects with the capability to automatically reconfigure and maintain data consistency in the presence of network and processor failures, and  Prepare a development plan for (1) a safety critical implementation and (2) a documentation package for safety qualification.  It would show the feasibility of creating an implementation of such a library that could satisfy the requirements of an industrial standard used in a safety critical industry.  It would also include a development and test plan to implement the safety critical software in Phase II.  Phase II work would actually implement the software.	The objective of this research is to create a safety critical implementation of a real-time distributed network communications and data distribution middleware library with the capacity to service several hundred publishers and subscribers.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':247B,294B,547B,594B,847B,894B,1147B,1194B,1447B,1494B,1747B,1794B '1000':268B,568B,868B,1168B,1468B,1768B '12207':255B,555B,855B,1155B,1455B,1755B '178c':250B,550B,850B,1150B,1450B,1750B '2':300B,600B,900B,1200B,1500B,1800B '200':265B,565B,865B,1165B,1465B,1765B '278a':245B,545B,845B,1145B,1445B,1745B '4':242B,257B,542B,557B,842B,857B,1142B,1157B,1442B,1457B,1742B,1757B '61508':240B,540B,840B,1140B,1440B,1740B 'accord':229B,529B,829B,1129B,1429B,1729B 'across':94B,107B,394B,407B,694B,707B,994B,1007B,1294B,1307B,1594B,1607B 'actual':357B,657B,957B,1257B,1557B,1857B 'also':337B,637B,937B,1237B,1537B,1837B 'although':134B,434B,734B,1034B,1334B,1634B 'api':195B,495B,795B,1095B,1395B,1695B 'applic':192B,492B,792B,1092B,1392B,1692B 'architectur':91B,391B,691B,991B,1291B,1591B 'assur':154B,454B,754B,1054B,1354B,1654B 'automat':274B,574B,874B,1174B,1474B,1774B 'avail':141B,441B,741B,1041B,1341B,1641B 'candid':126B,426B,726B,1026B,1326B,1626B 'capabl':111B,160B,260B,272B,411B,460B,560B,572B,711B,760B,860B,872B,1011B,1060B,1160B,1172B,1311B,1360B,1460B,1472B,1611B,1660B,1760B,1772B 'certifi':146B,446B,746B,1046B,1346B,1646B 'cil':241B,541B,841B,1141B,1441B,1741B 'commerci':135B,435B,735B,1035B,1335B,1635B 'communic':186B,486B,786B,1086B,1386B,1686B 'concurr':103B,403B,703B,1003B,1303B,1603B 'consist':101B,279B,401B,579B,701B,879B,1001B,1179B,1301B,1479B,1601B,1779B 'could':321B,621B,921B,1221B,1521B,1821B 'creat':313B,613B,913B,1213B,1513B,1813B 'critic':2A,12A,22A,32A,42A,52A,131B,149B,297B,333B,348B,431B,449B,597B,633B,648B,731B,749B,897B,933B,948B,1031B,1049B,1197B,1233B,1248B,1331B,1349B,1497B,1533B,1548B,1631B,1649B,1797B,1833B,1848B,1877A 'data':8A,18A,28A,38A,48A,58A,64B,77B,92B,106B,121B,155B,217B,278B,364B,377B,392B,406B,421B,455B,517B,578B,664B,677B,692B,706B,721B,755B,817B,878B,964B,977B,992B,1006B,1021B,1055B,1117B,1178B,1264B,1277B,1292B,1306B,1321B,1355B,1417B,1478B,1564B,1577B,1592B,1606B,1621B,1655B,1717B,1778B,1887A 'dds':79B,379B,679B,979B,1279B,1579B 'demonstr':258B,558B,858B,1158B,1458B,1758B 'develop':291B,340B,591B,640B,891B,940B,1191B,1240B,1491B,1540B,1791B,1840B 'distribut':9A,19A,29A,39A,49A,59A,65B,76B,93B,122B,156B,218B,365B,376B,393B,422B,456B,518B,665B,676B,693B,722B,756B,818B,965B,976B,993B,1022B,1056B,1118B,1265B,1276B,1293B,1322B,1356B,1418B,1565B,1576B,1593B,1622B,1656B,1718B,1885A,1888A 'document':302B,602B,902B,1202B,1502B,1802B 'enabl':87B,387B,687B,987B,1287B,1587B 'failur':287B,587B,887B,1187B,1487B,1787B 'fault':1880A 'feasibl':311B,611B,911B,1211B,1511B,1811B 'flexibl':88B,388B,688B,988B,1288B,1588B 'forc':165B,465B,765B,1065B,1365B,1665B 'general':144B,190B,204B,444B,490B,504B,744B,790B,804B,1044B,1090B,1104B,1344B,1390B,1404B,1644B,1690B,1704B 'group':74B,374B,674B,974B,1274B,1574B 'haul':182B,482B,782B,1082B,1382B,1682B 'howev':133B,433B,733B,1033B,1333B,1633B 'iec':239B,539B,839B,1139B,1439B,1739B 'ieee':254B,554B,854B,1154B,1454B,1754B 'ii':352B,354B,652B,654B,952B,954B,1252B,1254B,1552B,1554B,1852B,1854B 'imperfect':185B,485B,785B,1085B,1385B,1685B 'implement':3A,13A,23A,33A,43A,53A,69B,136B,220B,298B,315B,345B,358B,369B,436B,520B,598B,615B,645B,658B,669B,736B,820B,898B,915B,945B,958B,969B,1036B,1120B,1198B,1215B,1245B,1258B,1269B,1336B,1420B,1498B,1515B,1545B,1558B,1569B,1636B,1720B,1798B,1815B,1845B,1858B 'includ':338B,638B,938B,1238B,1538B,1838B 'industri':327B,334B,627B,634B,927B,934B,1227B,1234B,1527B,1534B,1827B,1834B 'inform':1861A,1863A,1865A,1867A,1869A,1871A 'interfac':194B,494B,794B,1094B,1394B,1694B 'languag':206B,506B,806B,1106B,1406B,1706B 'least':199B,499B,799B,1099B,1399B,1699B 'level':246B,251B,256B,546B,551B,556B,846B,851B,856B,1146B,1151B,1156B,1446B,1451B,1456B,1746B,1751B,1756B 'librari':319B,619B,919B,1219B,1519B,1819B 'link':187B,487B,787B,1087B,1387B,1687B 'long':181B,481B,781B,1081B,1381B,1681B 'made':124B,424B,724B,1024B,1324B,1624B 'maintain':277B,577B,877B,1177B,1477B,1777B 'mainten':99B,399B,699B,999B,1299B,1599B 'manag':73B,373B,673B,973B,1273B,1573B 'matur':213B,513B,813B,1113B,1413B,1713B 'middlewar':10A,20A,30A,40A,50A,60A,66B,114B,219B,366B,414B,519B,666B,714B,819B,966B,1014B,1119B,1266B,1314B,1419B,1566B,1614B,1719B,1879A 'multipl':203B,503B,803B,1103B,1403B,1703B 'must':174B,474B,774B,1074B,1374B,1674B 'network':89B,96B,109B,183B,284B,389B,396B,409B,483B,584B,689B,696B,709B,783B,884B,989B,996B,1009B,1083B,1184B,1289B,1296B,1309B,1383B,1484B,1589B,1596B,1609B,1683B,1784B 'node':266B,566B,866B,1166B,1466B,1766B 'object':72B,269B,372B,569B,672B,869B,972B,1169B,1272B,1469B,1572B,1769B 'omg':75B,375B,675B,975B,1275B,1575B 'one':200B,500B,800B,1100B,1400B,1700B 'open':83B,383B,683B,983B,1283B,1583B 'packag':303B,603B,903B,1203B,1503B,1803B 'phase':207B,351B,353B,507B,651B,653B,807B,951B,953B,1107B,1251B,1253B,1407B,1551B,1553B,1707B,1851B,1853B 'plan':292B,343B,592B,643B,892B,943B,1192B,1243B,1492B,1543B,1792B,1843B 'prefer':202B,502B,802B,1102B,1402B,1702B 'prepar':289B,589B,889B,1189B,1489B,1789B 'presenc':282B,582B,882B,1182B,1482B,1782B 'processor':286B,586B,886B,1186B,1486B,1786B 'product':139B,439B,739B,1039B,1339B,1639B 'program':193B,493B,793B,1093B,1393B,1693B 'project':86B,386B,686B,986B,1286B,1586B 'propos':211B,511B,811B,1111B,1411B,1711B 'publish':1874A 'publish-subscrib':1873A 'purpos':191B,205B,491B,505B,791B,805B,1091B,1105B,1391B,1405B,1691B,1705B 'qualif':306B,606B,906B,1206B,1506B,1806B 'qualifi':227B,527B,827B,1127B,1427B,1727B 'real':6A,16A,26A,36A,46A,56A,62B,152B,215B,362B,452B,515B,662B,752B,815B,962B,1052B,1115B,1262B,1352B,1415B,1562B,1652B,1715B,1883A 'real-tim':5A,15A,25A,35A,45A,55A,61B,214B,361B,514B,661B,814B,961B,1114B,1261B,1414B,1561B,1714B,1882A 'reconfigur':159B,166B,275B,459B,466B,575B,759B,766B,875B,1059B,1066B,1175B,1359B,1366B,1475B,1659B,1666B,1775B 'redund':117B,417B,717B,1017B,1317B,1617B 'requir':324B,624B,924B,1224B,1524B,1824B 'rtca':243B,248B,543B,548B,843B,848B,1143B,1148B,1443B,1448B,1743B,1748B 'safeti':1A,11A,21A,31A,41A,51A,130B,148B,226B,232B,296B,305B,332B,347B,430B,448B,526B,532B,596B,605B,632B,647B,730B,748B,826B,832B,896B,905B,932B,947B,1030B,1048B,1126B,1132B,1196B,1205B,1232B,1247B,1330B,1348B,1426B,1432B,1496B,1505B,1532B,1547B,1630B,1648B,1726B,1732B,1796B,1805B,1832B,1847B,1876A 'satisfi':322B,622B,922B,1222B,1522B,1822B 'servic':78B,378B,678B,978B,1278B,1578B 'show':221B,309B,521B,609B,821B,909B,1121B,1209B,1421B,1509B,1721B,1809B 'softwar':173B,349B,360B,473B,649B,660B,773B,949B,960B,1073B,1249B,1260B,1373B,1549B,1560B,1673B,1849B,1860B,1878A 'sourc':84B,384B,684B,984B,1284B,1584B 'standard':80B,233B,328B,380B,533B,628B,680B,833B,928B,980B,1133B,1228B,1280B,1433B,1528B,1580B,1733B,1828B 'subscrib':1875A 'suitabl':176B,196B,476B,496B,776B,796B,1076B,1096B,1376B,1396B,1676B,1696B 'support':116B,262B,416B,562B,716B,862B,1016B,1162B,1316B,1462B,1616B,1762B 'synchron':119B,419B,719B,1019B,1319B,1619B 'system':90B,132B,158B,390B,432B,458B,690B,732B,758B,990B,1032B,1058B,1290B,1332B,1358B,1590B,1632B,1658B,1862A,1864A,1866A,1868A,1870A,1872A,1886A 'test':167B,342B,467B,642B,767B,942B,1067B,1242B,1367B,1542B,1667B,1842B 'time':7A,17A,27A,37A,47A,57A,63B,153B,216B,363B,453B,516B,663B,753B,816B,963B,1053B,1116B,1263B,1353B,1416B,1563B,1653B,1716B,1884A 'toler':1881A 'train':168B,468B,768B,1068B,1368B,1668B 'use':128B,150B,171B,178B,236B,329B,428B,450B,471B,478B,536B,629B,728B,750B,771B,778B,836B,929B,1028B,1050B,1071B,1078B,1136B,1229B,1328B,1350B,1371B,1378B,1436B,1529B,1628B,1650B,1671B,1678B,1736B,1829B 'valuabl':163B,463B,763B,1063B,1363B,1663B 'wide':235B,535B,835B,1135B,1435B,1735B 'work':209B,355B,509B,655B,809B,955B,1109B,1255B,1409B,1555B,1709B,1855B 'would':161B,210B,308B,336B,356B,461B,510B,608B,636B,656B,761B,810B,908B,936B,956B,1061B,1110B,1208B,1236B,1256B,1361B,1410B,1508B,1536B,1556B,1661B,1710B,1808B,1836B,1856B 'zeromq':85B,385B,685B,985B,1285B,1585B	\N
51	AF151-001  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46316	Real Time Computer Vision	2	New algorithms based on state-of-the-art machine learning methods are enabling a broad range of transformative technologies. Computer vision applications are no exception. At the forefront of this field is the ability to separate video frames into background and foreground components in real time on mobile computing platforms and other limited computational resource devices. With the growing demand for accurate and real time video surveillance techniques and/or interactive gaming technologies, computationally efficient methods for removing background variations in a video stream (which are generally highly correlated between frames) in order to highlight foreground objects of potential interest are critical in enabling applications at the forefront of modern data analysis research.  Background/foreground separation is typically an integral step in detecting, identifying, tracking, and recognizing objects in video sequences. Most modern computer vision applications demand algorithms that can be implemented in real time, and that are robust enough to handle diverse, complicated, and cluttered backgrounds. Competitive methods often need to be flexible enough to accommodate changes in a scene due to, for instance, illumination changes that can occur throughout the day, or location changes where the application is being implemented. Given the importance of this task, a variety of iterative techniques and methods have already been developed in order to perform background/foreground separation. However, they often rely on optimization routines that are computationally expensive, thus compromising their ability to do real time computations with limited resources.  New methods being developed must circumvent this prohibitively expensive computation to produce an exceptionally robust, efficient, and potentially game changing technologically, providing a foreground/background separation solution that is two- to three-orders faster than current methods. At such speeds, the algorithm can be very easily implemented on mobile platforms such as smartphones, thus making for a portable field device that can execute such tasks on a mobile phone application type of computing structure. Additionally, a number of technological innovations that can further increase efficiency by determining a small number of pixel locations that are maximally informative about the foreground actions in video streams would make identification and processing of information (for surveillance or gaming applications) even more efficient.	The objective is to conceive algorithms that confer the ability to separate video frames into background and foreground components in real time on mobile computing platforms and other limited computational resource devices.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'abil':43B,237B,399B,593B 'accommod':174B,530B 'accur':71B,427B 'action':346B,702B 'addit':320B,676B 'algorithm':10B,145B,287B,366B,501B,643B 'alreadi':214B,570B 'analysi':120B,476B 'and/or':78B,434B 'applic':31B,113B,143B,196B,315B,361B,387B,469B,499B,552B,671B,717B 'art':17B,373B 'background':49B,87B,164B,405B,443B,520B 'background/foreground':122B,221B,478B,577B,727A 'base':11B,367B 'broad':24B,380B 'chang':175B,184B,193B,265B,531B,540B,549B,621B 'circumv':251B,607B 'clutter':163B,519B 'competit':165B,521B 'complic':161B,517B 'compon':52B,408B 'compromis':235B,591B 'comput':3A,7A,29B,58B,63B,82B,141B,232B,242B,255B,318B,385B,414B,419B,438B,497B,588B,598B,611B,674B,725A 'correl':97B,453B 'critic':110B,466B 'current':281B,637B 'data':119B,475B 'day':190B,546B 'demand':69B,144B,425B,500B 'detect':130B,486B 'determin':332B,688B 'develop':216B,249B,572B,605B 'devic':65B,305B,421B,661B 'divers':160B,516B 'due':179B,535B 'easili':291B,647B 'effici':83B,261B,330B,364B,439B,617B,686B,720B 'enabl':22B,112B,378B,468B 'enough':157B,172B,513B,528B 'even':362B,718B 'except':34B,259B,390B,615B 'execut':308B,664B 'expens':233B,254B,589B,610B 'faster':279B,635B 'field':40B,304B,396B,660B 'flexibl':171B,527B 'forefront':37B,116B,393B,472B 'foreground':51B,104B,345B,407B,460B,701B 'foreground/background':269B,625B 'frame':47B,99B,403B,455B 'game':80B,264B,360B,436B,620B,716B 'general':95B,451B 'given':200B,556B 'grow':68B,424B 'handl':159B,515B 'high':96B,452B 'highlight':103B,459B 'howev':223B,579B 'identif':352B,708B 'identifi':131B,487B 'illumin':183B,539B 'implement':149B,199B,292B,505B,555B,648B 'import':202B,558B 'increas':329B,685B 'inform':342B,356B,698B,712B,721A,723A 'innov':325B,681B 'instanc':182B,538B 'integr':127B,483B 'interact':79B,435B 'interest':108B,464B 'iter':209B,565B 'learn':19B,375B 'limit':62B,244B,418B,600B 'locat':192B,338B,548B,694B 'machin':18B,374B 'make':300B,351B,656B,707B 'maxim':341B,697B 'method':20B,84B,166B,212B,247B,282B,376B,440B,522B,568B,603B,638B 'mobil':57B,294B,313B,413B,650B,669B 'modern':118B,140B,474B,496B 'must':250B,606B 'need':168B,524B 'new':9B,246B,365B,602B 'number':322B,335B,678B,691B 'object':105B,135B,461B,491B 'occur':187B,543B 'often':167B,225B,523B,581B 'optim':228B,584B 'order':101B,218B,278B,457B,574B,634B 'perform':220B,576B 'phone':314B,670B 'pixel':337B,693B 'platform':59B,295B,415B,651B 'portabl':303B,659B 'potenti':107B,263B,463B,619B 'process':354B,710B 'produc':257B,613B 'prohibit':253B,609B 'provid':267B,623B 'rang':25B,381B 'real':1A,5A,54B,73B,151B,240B,410B,429B,507B,596B 'recogn':134B,490B 'reli':226B,582B 'remov':86B,442B 'research':121B,477B 'resourc':64B,245B,420B,601B 'robust':156B,260B,512B,616B 'routin':229B,585B 'scene':178B,534B 'separ':45B,123B,222B,270B,401B,479B,578B,626B,728A 'sequenc':138B,494B 'small':334B,690B 'smartphon':298B,654B 'solut':271B,627B 'speed':285B,641B 'state':14B,370B 'state-of-the-art':13B,369B 'step':128B,484B 'stream':92B,349B,448B,705B 'structur':319B,675B 'surveil':76B,358B,432B,714B 'system':722A,724A 'task':205B,310B,561B,666B 'techniqu':77B,210B,433B,566B 'technolog':28B,81B,266B,324B,384B,437B,622B,680B 'three':277B,633B 'three-ord':276B,632B 'throughout':188B,544B 'thus':234B,299B,590B,655B 'time':2A,6A,55B,74B,152B,241B,411B,430B,508B,597B 'track':132B,488B 'transform':27B,383B 'two':274B,630B 'type':316B,672B 'typic':125B,481B 'variat':88B,444B 'varieti':207B,563B 'video':46B,75B,91B,137B,348B,402B,431B,447B,493B,704B 'vision':4A,8A,30B,142B,386B,498B,726A 'would':350B,706B	\N
164	AF151-108  (AirForce)	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46407	Advanced Multisensor Concepts for Theater Ballistic Missile (TBM) Interceptors	2	With the proliferation of short, intermediate, and long-range ballistic missiles (SRBM, IRBM and  LRBM), protecting our forward operating bases (FOBs) is becoming a growing concern for our Regional and Theater Commanders.  Our current land- and sea-based counter ballistic missile systems are not plentiful or mobile enough to adequately protect all our FOBs.  To complement our current capabilities, an airborne weapon layer is being investigated.  As part of this effort, an assessment of the ability to rapidly identify the threat missile class (SRBM, IRBM, LRBM or SAM) and predict its final impact coordinates to support engagement prioritization and to optimize intercept probability is critical.  This SBIR requires the identification of a host platform(s) multi-mode sensor suite (MMW radar, imaging IR sensors, etc.) and munition seeker to develop classification and trajectory algorithms that can be used to successfully intercept a TBM or SAM (surface-to-air missile) in flight.  A stretch goal would be to assess the benefits of integrating additional Missile Defense Agency sensor elements (TBM architecture) to rapidly and accurately support the engagement of in-flight threat missiles.	Develop methodologies/algorithms utilizing active/passive (IR/RF/etc.) sensor track data to classify TBM targets, predict final impact coordinates in order to prioritize engagement, and to predict TBM trajectory to enable intercept.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'abil':159B,346B,533B,720B,907B,1094B,1281B,1468B,1655B 'accur':259B,446B,633B,820B,1007B,1194B,1381B,1568B,1755B 'addit':248B,435B,622B,809B,996B,1183B,1370B,1557B,1744B 'adequ':133B,320B,507B,694B,881B,1068B,1255B,1442B,1629B 'advanc':1A,10A,19A,28A,37A,46A,55A,64A,73A 'agenc':251B,438B,625B,812B,999B,1186B,1373B,1560B,1747B 'air':233B,420B,607B,794B,981B,1168B,1355B,1542B,1729B 'airborn':144B,331B,518B,705B,892B,1079B,1266B,1453B,1640B 'algorithm':218B,405B,592B,779B,966B,1153B,1340B,1527B,1714B,1775A 'architectur':255B,442B,629B,816B,1003B,1190B,1377B,1564B,1751B 'assess':156B,243B,343B,430B,530B,617B,717B,804B,904B,991B,1091B,1178B,1278B,1365B,1465B,1552B,1652B,1739B 'ballist':6A,15A,24A,33A,42A,51A,60A,69A,78A,92B,123B,279B,310B,466B,497B,653B,684B,840B,871B,1027B,1058B,1214B,1245B,1401B,1432B,1588B,1619B,1774A 'base':102B,121B,289B,308B,476B,495B,663B,682B,850B,869B,1037B,1056B,1224B,1243B,1411B,1430B,1598B,1617B 'becom':105B,292B,479B,666B,853B,1040B,1227B,1414B,1601B 'bed':1783A 'benefit':245B,432B,619B,806B,993B,1180B,1367B,1554B,1741B 'capabl':142B,329B,516B,703B,890B,1077B,1264B,1451B,1638B 'class':166B,353B,540B,727B,914B,1101B,1288B,1475B,1662B 'classif':215B,402B,589B,776B,963B,1150B,1337B,1524B,1711B 'command':114B,301B,488B,675B,862B,1049B,1236B,1423B,1610B 'complement':139B,326B,513B,700B,887B,1074B,1261B,1448B,1635B 'concept':3A,12A,21A,30A,39A,48A,57A,66A,75A 'concern':108B,295B,482B,669B,856B,1043B,1230B,1417B,1604B 'coordin':177B,364B,551B,738B,925B,1112B,1299B,1486B,1673B 'counter':122B,309B,496B,683B,870B,1057B,1244B,1431B,1618B 'critic':188B,375B,562B,749B,936B,1123B,1310B,1497B,1684B 'current':116B,141B,303B,328B,490B,515B,677B,702B,864B,889B,1051B,1076B,1238B,1263B,1425B,1450B,1612B,1637B 'data':1777A 'defens':250B,437B,624B,811B,998B,1185B,1372B,1559B,1746B 'develop':214B,401B,588B,775B,962B,1149B,1336B,1523B,1710B 'effort':154B,341B,528B,715B,902B,1089B,1276B,1463B,1650B 'element':253B,440B,627B,814B,1001B,1188B,1375B,1562B,1749B 'engag':180B,262B,367B,449B,554B,636B,741B,823B,928B,1010B,1115B,1197B,1302B,1384B,1489B,1571B,1676B,1758B 'enough':131B,318B,505B,692B,879B,1066B,1253B,1440B,1627B 'etc':209B,396B,583B,770B,957B,1144B,1331B,1518B,1705B 'final':175B,362B,549B,736B,923B,1110B,1297B,1484B,1671B 'flight':236B,266B,423B,453B,610B,640B,797B,827B,984B,1014B,1171B,1201B,1358B,1388B,1545B,1575B,1732B,1762B 'fob':103B,137B,290B,324B,477B,511B,664B,698B,851B,885B,1038B,1072B,1225B,1259B,1412B,1446B,1599B,1633B 'forward':100B,287B,474B,661B,848B,1035B,1222B,1409B,1596B 'fusion':1778A 'goal':239B,426B,613B,800B,987B,1174B,1361B,1548B,1735B 'grow':107B,294B,481B,668B,855B,1042B,1229B,1416B,1603B 'guidanc':1776A 'hercul':1779A 'host':196B,383B,570B,757B,944B,1131B,1318B,1505B,1692B 'hwil':1784A 'identif':193B,380B,567B,754B,941B,1128B,1315B,1502B,1689B 'identifi':162B,349B,536B,723B,910B,1097B,1284B,1471B,1658B 'imag':206B,393B,580B,767B,954B,1141B,1328B,1515B,1702B 'impact':176B,363B,550B,737B,924B,1111B,1298B,1485B,1672B 'in-flight':264B,451B,638B,825B,1012B,1199B,1386B,1573B,1760B 'integr':247B,434B,621B,808B,995B,1182B,1369B,1556B,1743B 'intercept':185B,225B,372B,412B,559B,599B,746B,786B,933B,973B,1120B,1160B,1307B,1347B,1494B,1534B,1681B,1721B,1781A 'interceptor':9A,18A,27A,36A,45A,54A,63A,72A,81A 'intermedi':87B,274B,461B,648B,835B,1022B,1209B,1396B,1583B 'investig':149B,336B,523B,710B,897B,1084B,1271B,1458B,1645B 'ir':207B,394B,581B,768B,955B,1142B,1329B,1516B,1703B 'irbm':95B,168B,282B,355B,469B,542B,656B,729B,843B,916B,1030B,1103B,1217B,1290B,1404B,1477B,1591B,1664B 'land':117B,304B,491B,678B,865B,1052B,1239B,1426B,1613B 'layer':146B,333B,520B,707B,894B,1081B,1268B,1455B,1642B 'long':90B,277B,464B,651B,838B,1025B,1212B,1399B,1586B 'long-rang':89B,276B,463B,650B,837B,1024B,1211B,1398B,1585B 'lrbm':97B,169B,284B,356B,471B,543B,658B,730B,845B,917B,1032B,1104B,1219B,1291B,1406B,1478B,1593B,1665B 'missil':7A,16A,25A,34A,43A,52A,61A,70A,79A,93B,124B,165B,234B,249B,268B,280B,311B,352B,421B,436B,455B,467B,498B,539B,608B,623B,642B,654B,685B,726B,795B,810B,829B,841B,872B,913B,982B,997B,1016B,1028B,1059B,1100B,1169B,1184B,1203B,1215B,1246B,1287B,1356B,1371B,1390B,1402B,1433B,1474B,1543B,1558B,1577B,1589B,1620B,1661B,1730B,1745B,1764B 'mmw':204B,391B,578B,765B,952B,1139B,1326B,1513B,1700B 'mobil':130B,317B,504B,691B,878B,1065B,1252B,1439B,1626B 'mode':201B,388B,575B,762B,949B,1136B,1323B,1510B,1697B 'multi':200B,387B,574B,761B,948B,1135B,1322B,1509B,1696B 'multi-mod':199B,386B,573B,760B,947B,1134B,1321B,1508B,1695B 'multisensor':2A,11A,20A,29A,38A,47A,56A,65A,74A 'munit':211B,398B,585B,772B,959B,1146B,1333B,1520B,1707B 'oper':101B,288B,475B,662B,849B,1036B,1223B,1410B,1597B 'optim':184B,371B,558B,745B,932B,1119B,1306B,1493B,1680B 'part':151B,338B,525B,712B,899B,1086B,1273B,1460B,1647B 'platform':197B,384B,571B,758B,945B,1132B,1319B,1506B,1693B 'plenti':128B,315B,502B,689B,876B,1063B,1250B,1437B,1624B 'predict':173B,360B,547B,734B,921B,1108B,1295B,1482B,1669B,1780A 'priorit':181B,368B,555B,742B,929B,1116B,1303B,1490B,1677B 'probabl':186B,373B,560B,747B,934B,1121B,1308B,1495B,1682B 'prolifer':84B,271B,458B,645B,832B,1019B,1206B,1393B,1580B 'protect':98B,134B,285B,321B,472B,508B,659B,695B,846B,882B,1033B,1069B,1220B,1256B,1407B,1443B,1594B,1630B 'radar':205B,392B,579B,766B,953B,1140B,1327B,1514B,1701B 'rang':91B,278B,465B,652B,839B,1026B,1213B,1400B,1587B 'rapid':161B,257B,348B,444B,535B,631B,722B,818B,909B,1005B,1096B,1192B,1283B,1379B,1470B,1566B,1657B,1753B 'region':111B,298B,485B,672B,859B,1046B,1233B,1420B,1607B 'requir':191B,378B,565B,752B,939B,1126B,1313B,1500B,1687B 'sam':171B,229B,358B,416B,545B,603B,732B,790B,919B,977B,1106B,1164B,1293B,1351B,1480B,1538B,1667B,1725B 'sbir':190B,377B,564B,751B,938B,1125B,1312B,1499B,1686B 'sea':120B,307B,494B,681B,868B,1055B,1242B,1429B,1616B 'sea-bas':119B,306B,493B,680B,867B,1054B,1241B,1428B,1615B 'seeker':212B,399B,586B,773B,960B,1147B,1334B,1521B,1708B 'sensor':202B,208B,252B,389B,395B,439B,576B,582B,626B,763B,769B,813B,950B,956B,1000B,1137B,1143B,1187B,1324B,1330B,1374B,1511B,1517B,1561B,1698B,1704B,1748B 'short':86B,273B,460B,647B,834B,1021B,1208B,1395B,1582B 'srbm':94B,167B,281B,354B,468B,541B,655B,728B,842B,915B,1029B,1102B,1216B,1289B,1403B,1476B,1590B,1663B 'stretch':238B,425B,612B,799B,986B,1173B,1360B,1547B,1734B 'success':224B,411B,598B,785B,972B,1159B,1346B,1533B,1720B 'suit':203B,390B,577B,764B,951B,1138B,1325B,1512B,1699B 'support':179B,260B,366B,447B,553B,634B,740B,821B,927B,1008B,1114B,1195B,1301B,1382B,1488B,1569B,1675B,1756B 'surfac':231B,418B,605B,792B,979B,1166B,1353B,1540B,1727B 'surface-to-air':230B,417B,604B,791B,978B,1165B,1352B,1539B,1726B 'system':125B,312B,499B,686B,873B,1060B,1247B,1434B,1621B 'tbm':8A,17A,26A,35A,44A,53A,62A,71A,80A,227B,254B,414B,441B,601B,628B,788B,815B,975B,1002B,1162B,1189B,1349B,1376B,1536B,1563B,1723B,1750B 'test':1782A 'theater':5A,14A,23A,32A,41A,50A,59A,68A,77A,113B,300B,487B,674B,861B,1048B,1235B,1422B,1609B 'threat':164B,267B,351B,454B,538B,641B,725B,828B,912B,1015B,1099B,1202B,1286B,1389B,1473B,1576B,1660B,1763B 'trajectori':217B,404B,591B,778B,965B,1152B,1339B,1526B,1713B 'use':222B,409B,596B,783B,970B,1157B,1344B,1531B,1718B 'weapon':145B,332B,519B,706B,893B,1080B,1267B,1454B,1641B,1765A,1766A,1767A,1768A,1769A,1770A,1771A,1772A,1773A 'would':240B,427B,614B,801B,988B,1175B,1362B,1549B,1736B	\N
\.


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('topics_id_seq', 189, false);


--
-- Data for Name: topicsareas; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY topicsareas (topic_id, area_id) FROM stdin;
76	1
160	1
114	8
129	8
3	2
38	2
69	7
186	7
51	7
14	8
164	2
\.


--
-- Data for Name: topicskeywords; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY topicskeywords (topic_id, keyword_id) FROM stdin;
76	536
11	211
160	34
114	788
11	785
129	705
3	35
38	35
14	824
38	420
69	403
186	987
51	567
11	779
76	905
76	368
164	368
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY users (id, email, password, active, secret, confirmed_at, last_login_at, current_login_at, last_login_ip, current_login_ip, login_count, name, title) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('users_id_seq', 2, false);


--
-- Data for Name: workflows; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY workflows (id, name, description, created_at, updated_at, proposal_id) FROM stdin;
\.


--
-- Name: workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('workflows_id_seq', 2, false);


--
-- Data for Name: workflowstepresults; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY workflowstepresults (id, result, completed_at, created_at, updated_at, workflowstep_id) FROM stdin;
\.


--
-- Name: workflowstepresults_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('workflowstepresults_id_seq', 2, false);


--
-- Data for Name: workflowsteps; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY workflowsteps (id, name, description, work, created_at, updated_at, workflow_id) FROM stdin;
\.


--
-- Name: workflowsteps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('workflowsteps_id_seq', 2, false);


SET search_path = import, pg_catalog;

--
-- Name: topics_pkey; Type: CONSTRAINT; Schema: import; Owner: catherine; Tablespace: 
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (topics_id);


SET search_path = public, pg_catalog;

--
-- Name: areas_area_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY areas
    ADD CONSTRAINT areas_area_key UNIQUE (area);


--
-- Name: areas_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- Name: connections_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: contents_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: documents_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: keywords_keyword_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY keywords
    ADD CONSTRAINT keywords_keyword_key UNIQUE (keyword);


--
-- Name: keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY keywords
    ADD CONSTRAINT keywords_pkey PRIMARY KEY (id);


--
-- Name: organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: participatingcomponents_participatingcomponent_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY participatingcomponents
    ADD CONSTRAINT participatingcomponents_participatingcomponent_key UNIQUE (participatingcomponent);


--
-- Name: participatingcomponents_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY participatingcomponents
    ADD CONSTRAINT participatingcomponents_pkey PRIMARY KEY (id);


--
-- Name: phases_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY phases
    ADD CONSTRAINT phases_pkey PRIMARY KEY (id);


--
-- Name: programs_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: references_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY "references"
    ADD CONSTRAINT references_pkey PRIMARY KEY (id);


--
-- Name: roles_name_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: topics_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: topics_topic_number_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_topic_number_key UNIQUE (topic_number);


--
-- Name: topics_url_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_url_key UNIQUE (url);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY workflows
    ADD CONSTRAINT workflows_pkey PRIMARY KEY (id);


--
-- Name: workflowstepresults_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY workflowstepresults
    ADD CONSTRAINT workflowstepresults_pkey PRIMARY KEY (id);


--
-- Name: workflowsteps_pkey; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY workflowsteps
    ADD CONSTRAINT workflowsteps_pkey PRIMARY KEY (id);


--
-- Name: ix_topics_full_text; Type: INDEX; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE INDEX ix_topics_full_text ON topics USING gin (full_text);


SET search_path = import, pg_catalog;

--
-- Name: _references_topics_id_fkey; Type: FK CONSTRAINT; Schema: import; Owner: catherine
--

ALTER TABLE ONLY _references
    ADD CONSTRAINT _references_topics_id_fkey FOREIGN KEY (topics_id) REFERENCES topics(topics_id);


--
-- Name: areas_topics_id_fkey; Type: FK CONSTRAINT; Schema: import; Owner: catherine
--

ALTER TABLE ONLY areas
    ADD CONSTRAINT areas_topics_id_fkey FOREIGN KEY (topics_id) REFERENCES topics(topics_id);


--
-- Name: keywords_topics_id_fkey; Type: FK CONSTRAINT; Schema: import; Owner: catherine
--

ALTER TABLE ONLY keywords
    ADD CONSTRAINT keywords_topics_id_fkey FOREIGN KEY (topics_id) REFERENCES topics(topics_id);


--
-- Name: participating_components_topics_id_fkey; Type: FK CONSTRAINT; Schema: import; Owner: catherine
--

ALTER TABLE ONLY participating_components
    ADD CONSTRAINT participating_components_topics_id_fkey FOREIGN KEY (topics_id) REFERENCES topics(topics_id);


--
-- Name: phases_topics_id_fkey; Type: FK CONSTRAINT; Schema: import; Owner: catherine
--

ALTER TABLE ONLY phases
    ADD CONSTRAINT phases_topics_id_fkey FOREIGN KEY (topics_id) REFERENCES topics(topics_id);


SET search_path = public, pg_catalog;

--
-- Name: connections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY connections
    ADD CONSTRAINT connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: contents_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY contents
    ADD CONSTRAINT contents_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documents_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY documents
    ADD CONSTRAINT documents_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documentskeywords_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY documentskeywords
    ADD CONSTRAINT documentskeywords_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id);


--
-- Name: documentskeywords_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY documentskeywords
    ADD CONSTRAINT documentskeywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES keywords(id);


--
-- Name: documentsproposals_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY documentsproposals
    ADD CONSTRAINT documentsproposals_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id);


--
-- Name: documentsproposals_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY documentsproposals
    ADD CONSTRAINT documentsproposals_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES proposals(id);


--
-- Name: organizationsusers_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY organizationsusers
    ADD CONSTRAINT organizationsusers_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id);


--
-- Name: organizationsusers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY organizationsusers
    ADD CONSTRAINT organizationsusers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: participatingcomponentstopics_participatingcomponent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY participatingcomponentstopics
    ADD CONSTRAINT participatingcomponentstopics_participatingcomponent_id_fkey FOREIGN KEY (participatingcomponent_id) REFERENCES participatingcomponents(id);


--
-- Name: participatingcomponentstopics_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY participatingcomponentstopics
    ADD CONSTRAINT participatingcomponentstopics_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id);


--
-- Name: phases_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY phases
    ADD CONSTRAINT phases_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id);


--
-- Name: proposals_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY proposals
    ADD CONSTRAINT proposals_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: references_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY "references"
    ADD CONSTRAINT references_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id);


--
-- Name: roles_users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY roles_users
    ADD CONSTRAINT roles_users_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- Name: roles_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY roles_users
    ADD CONSTRAINT roles_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: topics_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topics_program_id_fkey FOREIGN KEY (program_id) REFERENCES programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: topicsareas_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY topicsareas
    ADD CONSTRAINT topicsareas_area_id_fkey FOREIGN KEY (area_id) REFERENCES areas(id);


--
-- Name: topicsareas_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY topicsareas
    ADD CONSTRAINT topicsareas_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id);


--
-- Name: topicskeywords_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY topicskeywords
    ADD CONSTRAINT topicskeywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES keywords(id);


--
-- Name: topicskeywords_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY topicskeywords
    ADD CONSTRAINT topicskeywords_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id);


--
-- Name: workflows_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY workflows
    ADD CONSTRAINT workflows_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: workflowstepresults_workflowstep_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY workflowstepresults
    ADD CONSTRAINT workflowstepresults_workflowstep_id_fkey FOREIGN KEY (workflowstep_id) REFERENCES workflowsteps(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: workflowsteps_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sbirez
--

ALTER TABLE ONLY workflowsteps
    ADD CONSTRAINT workflowsteps_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

