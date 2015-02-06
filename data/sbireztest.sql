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
    topics_id integer NOT NULL,
    _references character varying(523) NOT NULL
);


ALTER TABLE import._references OWNER TO catherine;

--
-- Name: areas; Type: TABLE; Schema: import; Owner: catherine; Tablespace: 
--

CREATE TABLE areas (
    topics_id integer NOT NULL,
    areas character varying(19) NOT NULL
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
    url character varying(61) NOT NULL,
    proposals_end_date timestamp without time zone NOT NULL,
    program character varying(4) NOT NULL,
    topic_number character varying(21) NOT NULL,
    objective character varying(250) NOT NULL,
    description character varying(6638) NOT NULL,
    proposals_begin_date timestamp without time zone NOT NULL,
    title character varying(154) NOT NULL,
    pre_release_date timestamp without time zone NOT NULL,
    solicitation_id character varying(15) NOT NULL,
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
-- Name: tests; Type: TABLE; Schema: public; Owner: catherine; Tablespace: 
--

CREATE TABLE tests (
    id integer NOT NULL,
    string_attr character varying(64),
    integer_attr integer,
    hidden_attr character varying(64)
);


ALTER TABLE public.tests OWNER TO catherine;

--
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: catherine
--

CREATE SEQUENCE tests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tests_id_seq OWNER TO catherine;

--
-- Name: tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: catherine
--

ALTER SEQUENCE tests_id_seq OWNED BY tests.id;


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
-- Name: id; Type: DEFAULT; Schema: public; Owner: catherine
--

ALTER TABLE ONLY tests ALTER COLUMN id SET DEFAULT nextval('tests_id_seq'::regclass);


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

COPY _references (topics_id, _references) FROM stdin;
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: import; Owner: catherine
--

COPY areas (topics_id, areas) FROM stdin;
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

COPY topics (url, proposals_end_date, program, topic_number, objective, description, proposals_begin_date, title, pre_release_date, solicitation_id, topics_id) FROM stdin;
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
50818048880
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY areas (id, area) FROM stdin;
7	Information Systems
1	Space Platforms
4	Materials/Processes
2	Weapons
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
217	insufficient information	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
411	BIT	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
267	moving target defense	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
259	high temperature	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
927	prognostics	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
910	oxidation modeling	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
688	information assurance	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
40	data	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
453	air platform prime power	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
138	thermodynamics	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
524	built-in-test	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
214	optical simulator	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
603	autonomy	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
19	ultrasonic scan	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
289	resiliency	2015-02-03 11:33:20.974677-05	2015-02-03 11:33:20.974677-05
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
3	DARPA
1	DHP
5	Air Force
4	SOCOM
2	ARMY
\.


--
-- Name: participatingcomponents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('participatingcomponents_id_seq', 7, false);


--
-- Data for Name: participatingcomponentstopics; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY participatingcomponentstopics (topic_id, participatingcomponent_id) FROM stdin;
124	3
173	3
7	3
124	1
14	1
71	5
76	5
124	4
3	4
188	3
183	3
173	4
114	2
173	1
7	1
67	5
7	4
\.


--
-- Data for Name: phases; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY phases (id, phase, topic_id) FROM stdin;
19	PHASE II:  Using the lessons learned from Phase I, design and fabricate a complete COA selection program clearly traceable to spacecraft integration; this includes development in an appropriate programming language.  Demonstrate capability with datasets provided by AFRL.	173
166	PHASE III:  The contractor will develop a BIT-enabled, high bandwidth fiber link for military/commercial aircraft and other platforms.  Affordability will be a key focus for this application. A partnering with a commercial supplier can be established to ensure the transition.	124
16	PHASE II:  Develop an enclave with this capability and test against representative enterprise networks and environments.	7
13	PHASE I:  Design a high efficiency, radiation hard, power processing module to operate at greater than 200 degrees centigrade. The power processing module shall be scalable for use for primary bus regulation in a spacecraft power system and provide high efficiency at all load points.	14
62	PHASE I:  Using COTS/GOTS software, the Phase I research will develop the initial tools and concepts to achieve prognostic scheduling. Phase I will focus on defining the concept and developing a concept demonstration of the algorithm.	71
490	PHASE I:  Identify and explore one or more approaches to capture the complexity of a CMC engine sub-component/component. Develop a conceptual model (analytical or numerical) and/or an ambient environment test to demonstrate feasibility for a relevant service environment in Phase II. Identify and prioritize the key technical challenges and show how they could be mitigated.	76
199	PHASE I:  Develop an operations concept, architecture, and supporting technology for an Ephemeral GPS Security Overlay.	3
31	PHASE I:  Develop a conceptual design to the PDR level that consists of: \r\n1.  Fuel cell prime power, including fuel for one mission\r\n2.  Pulsed power energy store with charging interface connecting the fuel cell\r\n3.  Thermal management concept for an airborne implementation, not including the thermal management of the pulsed power load	188
224	PHASE II:  Perform detailed design and implementation of a BIT-enabled 10 Gbps (min.) bandwidth multi-mode fiber link that implements health status monitoring for at least 4 states and a minimum of 32 ports for the architecture developed during Phase I.  Develop software algorithms for demonstrating automated reporting of fiber plant health and prognostics. Test the prototype in relevant military avionics cable plant  environment. Characterize the prototype for possible Phase III transition.	124
170	PHASE III:  Commercialize advances into CALPHAD method or equivalent for application to current & next-generation high-temperature structural alloys. This will include, but not be limited to, Ni-based superalloys, Ti alloys and new alloys systems, including chemically complex alloys (i.e., high entropy alloys).	183
324	PHASE I:  Perform trade space analyses of candidate technologies. Identify and design BIT architectures and prototype proof - of - concept devices to give an indication of success of Phase II.  Phase I: 1) investigate methods of measuring fiber cable plant health, 2) develop a plan to characterization cable plant failures in an aircraft environment and 3) propose an approach central switch integration.	124
345	PHASE I:  Investigate WFOV Vis-SWIR HWIL technologies that can potentially achieve 200 nanoradian or less accuracy for high speed strapdown star tracker HWIL.  Address a wide range of day and night static and dynamic celestial objects, with backgrounds, atmospheric, and aerothermal optical distortions.  Analyze and design a Phase II prototype compatible with a demonstration in the AFRL KHILS facility.	114
343	PHASE III:  Technology developed will be applicable to all military space platforms. Expected benefits include increased reliability and resilience in the face of natural hazards and man-made threats.	173
163	PHASE II:  Continue research and development of technology for a prototype demonstration in an Air Force Sustainment Center (AFSC) complex facility and demonstrate the commercial viability of the approach.  Develop transition plan for an enterprise wide implementation of the technology across AFSC complexes.	67
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
\.


--
-- Name: references_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('references_id_seq', 2, false);


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
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: catherine
--

COPY tests (id, string_attr, integer_attr, hidden_attr) FROM stdin;
\.


--
-- Name: tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: catherine
--

SELECT pg_catalog.setval('tests_id_seq', 1, false);


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY topics (id, topic_number, solicitation_id, url, title, program_id, description, objective, pre_release_date, proposals_begin_date, proposals_end_date, full_text, agency) FROM stdin;
124	AF151-051	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46360	Built in Test (BIT) Capability for Multi-Mode (MM) Fiber Data Networks	2	Current airborne platforms are increasingly taxed to deliver critical information for everything from mission system sensor information to position and navigation information. Fiber optic data communication are used to achieve increased performance at reduced power consumption and electromagnetic susceptibility. The typical military aerospace environmental conditions create potential for fiber optic link degradation or failure. A poor quality or failing link has immediate & limiting impact to the platforms ability to accomplish the mission. Diagnostics & repair often take extensive amount of time and manpower. Typical fiber links lack systems for monitoring the fiber cable plant for degradation or faults due to connector contamination or damaged optical pathways.\r\n\r\nFiber optic systems with integrated methods of monitoring the cable plant and precisely locating faults have significant potential to reduce the total cost of ownership and improve the availability of the fiber networks over the asset life cycle. Avionic networks typically rely on a central switch to coordinate network traffic. This switch has optical connections to remote nodes on the aircraft.  Therefore, by incorporating cable plant monitoring technology into the central switch, the entire network will fault monitoring and diagnostics.\r\n\r\nAn important benefit from such a system that could exchange status and health information would be the ability to auto-negotiation the link data rate to optimize data throughput. The demands of improving sensor systems and the need to utilize legacy network require the smart and efficient use of the length-bandwidth limit that the fiber plant can support.  With the drive towards higher data rates, a system that enables 10 Gbs at a minimum is required.\r\n\r\nThe extreme environments of airborne platforms pushes the limits of current fiber optical networks and leads to many potential ways for a link to fail, from reduce link margin,  fiber breaks, laser source current draw and even dirt egress which reduces received signal strength.  A system that monitors the system health to a degree to be useful in understanding the failure or potential link failure mechanism is of great benefit to the warfighter.  Fiber optic transceivers with embedded optical time domain reflectometer (OTDR) and link-loss BIT present an opportunity for real time monitoring and fault isolation.  A monitoring system, when incorporated with prognostic and health management (PHM) approaches and software, can enable comprehensive condition and health indicators.\r\n\r\nCompatibility with legacy airborne platforms is greatly desired.  These platforms typical are cabled with 50 micron OM2 MMF and 100 micron MMF.  In addition, new technologies which could enable better performance while maintaining a drop in replacement capability will be considered.  The system would naturally need to be able to survive extreme temperature and vibrations (MIL-STD-810, MIL-STD-883).  As such smaller packaging would be beneficial and would likely free up needed PC board real estate.\r\n\r\nTechnology development is required to achieve integration of fiber network prognostic capability into avionic systems. This research will investigate the strategy of measuring baseline heath and normal operation, network degradation, and deviations from normal. The developed algorithms must be compatible with autonomous operation, without impact to the existing aircraft processing capabilities.\r\n\r\nThis topic seeks an innovative switch architecture that incorporates cable plant monitoring, while minimizing the production cost and without sacrificing network performance and scaling.   The developed solutions will need to meet the performance requirements of military standards for environmental ruggedness.	Develop built-in-test (BIT) functionality for fiber optic transceivers that allows insitu measurement of link-loss and internal transceiver parameters for prognostics and health management suitable for embedding into aerospace fiber optic networks.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'10':349B,903B,1457B,2011B,2565B,3119B,3673B '100':494B,1048B,1602B,2156B,2710B,3264B,3818B '50':489B,1043B,1597B,2151B,2705B,3259B,3813B '810':533B,1087B,1641B,2195B,2749B,3303B,3857B '883':537B,1091B,1645B,2199B,2753B,3307B,3861B 'abil':159B,294B,713B,848B,1267B,1402B,1821B,1956B,2375B,2510B,2929B,3064B,3483B,3618B 'abl':523B,1077B,1631B,2185B,2739B,3293B,3847B 'accomplish':161B,715B,1269B,1823B,2377B,2931B,3485B 'achiev':121B,560B,675B,1114B,1229B,1668B,1783B,2222B,2337B,2776B,2891B,3330B,3445B,3884B 'addit':498B,1052B,1606B,2160B,2714B,3268B,3822B 'aerospac':134B,688B,1242B,1796B,2350B,2904B,3458B 'airborn':93B,360B,478B,647B,914B,1032B,1201B,1468B,1586B,1755B,2022B,2140B,2309B,2576B,2694B,2863B,3130B,3248B,3417B,3684B,3802B 'aircraft':257B,603B,811B,1157B,1365B,1711B,1919B,2265B,2473B,2819B,3027B,3373B,3581B,3927B 'algorithm':591B,1145B,1699B,2253B,2807B,3361B,3915B 'amount':169B,723B,1277B,1831B,2385B,2939B,3493B 'approach':465B,1019B,1573B,2127B,2681B,3235B,3789B 'architectur':612B,1166B,1720B,2274B,2828B,3382B,3936B 'asset':232B,786B,1340B,1894B,2448B,3002B,3556B 'auto':297B,851B,1405B,1959B,2513B,3067B,3621B 'auto-negoti':296B,850B,1404B,1958B,2512B,3066B,3620B 'autonom':596B,1150B,1704B,2258B,2812B,3366B,3920B 'avail':225B,779B,1333B,1887B,2441B,2995B,3549B 'avion':235B,568B,789B,1122B,1343B,1676B,1897B,2230B,2451B,2784B,3005B,3338B,3559B,3892B,3990A 'bandwidth':330B,884B,1438B,1992B,2546B,3100B,3654B 'baselin':578B,1132B,1686B,2240B,2794B,3348B,3902B 'benefici':544B,1098B,1652B,2206B,2760B,3314B,3868B 'benefit':279B,425B,833B,979B,1387B,1533B,1941B,2087B,2495B,2641B,3049B,3195B,3603B,3749B 'better':504B,1058B,1612B,2166B,2720B,3274B,3828B 'bit':4A,17A,30A,43A,56A,69A,82A,443B,997B,1551B,2105B,2659B,3213B,3767B,3997A 'board':552B,1106B,1660B,2214B,2768B,3322B,3876B 'break':386B,940B,1494B,2048B,2602B,3156B,3710B 'built':1A,14A,27A,40A,53A,66A,79A,3986A 'built-in-test':3985A 'cabl':183B,206B,261B,487B,615B,737B,760B,815B,1041B,1169B,1291B,1314B,1369B,1595B,1723B,1845B,1868B,1923B,2149B,2277B,2399B,2422B,2477B,2703B,2831B,2953B,2976B,3031B,3257B,3385B,3507B,3530B,3585B,3811B,3939B 'capabl':5A,18A,31A,44A,57A,70A,83A,512B,566B,605B,1066B,1120B,1159B,1620B,1674B,1713B,2174B,2228B,2267B,2728B,2782B,2821B,3282B,3336B,3375B,3836B,3890B,3929B 'central':241B,267B,795B,821B,1349B,1375B,1903B,1929B,2457B,2483B,3011B,3037B,3565B,3591B 'communic':117B,671B,1225B,1779B,2333B,2887B,3441B,3994A 'compat':475B,594B,1029B,1148B,1583B,1702B,2137B,2256B,2691B,2810B,3245B,3364B,3799B,3918B 'comprehens':470B,1024B,1578B,2132B,2686B,3240B,3794B 'condit':136B,471B,690B,1025B,1244B,1579B,1798B,2133B,2352B,2687B,2906B,3241B,3460B,3795B 'connect':251B,805B,1359B,1913B,2467B,3021B,3575B 'connector':191B,745B,1299B,1853B,2407B,2961B,3515B 'consid':515B,1069B,1623B,2177B,2731B,3285B,3839B 'consumpt':127B,681B,1235B,1789B,2343B,2897B,3451B 'contamin':192B,746B,1300B,1854B,2408B,2962B,3516B 'coordin':244B,798B,1352B,1906B,2460B,3014B,3568B 'cost':219B,622B,773B,1176B,1327B,1730B,1881B,2284B,2435B,2838B,2989B,3392B,3543B,3946B 'could':285B,502B,839B,1056B,1393B,1610B,1947B,2164B,2501B,2718B,3055B,3272B,3609B,3826B 'creat':137B,691B,1245B,1799B,2353B,2907B,3461B 'critic':100B,654B,1208B,1762B,2316B,2870B,3424B 'current':92B,366B,389B,646B,920B,943B,1200B,1474B,1497B,1754B,2028B,2051B,2308B,2582B,2605B,2862B,3136B,3159B,3416B,3690B,3713B 'cycl':234B,788B,1342B,1896B,2450B,3004B,3558B 'damag':194B,748B,1302B,1856B,2410B,2964B,3518B 'data':12A,25A,38A,51A,64A,77A,90A,116B,301B,305B,343B,670B,855B,859B,897B,1224B,1409B,1413B,1451B,1778B,1963B,1967B,2005B,2332B,2517B,2521B,2559B,2886B,3071B,3075B,3113B,3440B,3625B,3629B,3667B 'degrad':143B,186B,584B,697B,740B,1138B,1251B,1294B,1692B,1805B,1848B,2246B,2359B,2402B,2800B,2913B,2956B,3354B,3467B,3510B,3908B 'degre':409B,963B,1517B,2071B,2625B,3179B,3733B 'deliv':99B,653B,1207B,1761B,2315B,2869B,3423B 'demand':308B,862B,1416B,1970B,2524B,3078B,3632B 'desir':482B,1036B,1590B,2144B,2698B,3252B,3806B 'develop':556B,590B,631B,1110B,1144B,1185B,1664B,1698B,1739B,2218B,2252B,2293B,2772B,2806B,2847B,3326B,3360B,3401B,3880B,3914B,3955B 'deviat':586B,1140B,1694B,2248B,2802B,3356B,3910B 'diagnost':164B,276B,718B,830B,1272B,1384B,1826B,1938B,2380B,2492B,2934B,3046B,3488B,3600B 'dirt':393B,947B,1501B,2055B,2609B,3163B,3717B 'domain':436B,990B,1544B,2098B,2652B,3206B,3760B 'draw':390B,944B,1498B,2052B,2606B,3160B,3714B 'drive':340B,894B,1448B,2002B,2556B,3110B,3664B 'drop':509B,1063B,1617B,2171B,2725B,3279B,3833B 'due':189B,743B,1297B,1851B,2405B,2959B,3513B 'effici':324B,878B,1432B,1986B,2540B,3094B,3648B 'egress':394B,948B,1502B,2056B,2610B,3164B,3718B 'electromagnet':129B,683B,1237B,1791B,2345B,2899B,3453B 'embed':433B,987B,1541B,2095B,2649B,3203B,3757B 'enabl':348B,469B,503B,902B,1023B,1057B,1456B,1577B,1611B,2010B,2131B,2165B,2564B,2685B,2719B,3118B,3239B,3273B,3672B,3793B,3827B 'entir':270B,824B,1378B,1932B,2486B,3040B,3594B 'environ':358B,912B,1466B,2020B,2574B,3128B,3682B 'environment':135B,644B,689B,1198B,1243B,1752B,1797B,2306B,2351B,2860B,2905B,3414B,3459B,3968B 'estat':554B,1108B,1662B,2216B,2770B,3324B,3878B 'even':392B,946B,1500B,2054B,2608B,3162B,3716B 'everyth':103B,657B,1211B,1765B,2319B,2873B,3427B 'exchang':286B,840B,1394B,1948B,2502B,3056B,3610B 'exist':602B,1156B,1710B,2264B,2818B,3372B,3926B 'extens':168B,722B,1276B,1830B,2384B,2938B,3492B 'extrem':357B,526B,911B,1080B,1465B,1634B,2019B,2188B,2573B,2742B,3127B,3296B,3681B,3850B 'fail':150B,380B,704B,934B,1258B,1488B,1812B,2042B,2366B,2596B,2920B,3150B,3474B,3704B 'failur':145B,416B,420B,699B,970B,974B,1253B,1524B,1528B,1807B,2078B,2082B,2361B,2632B,2636B,2915B,3186B,3190B,3469B,3740B,3744B 'fault':188B,211B,273B,452B,742B,765B,827B,1006B,1296B,1319B,1381B,1560B,1850B,1873B,1935B,2114B,2404B,2427B,2489B,2668B,2958B,2981B,3043B,3222B,3512B,3535B,3597B,3776B,3995A 'fiber':11A,24A,37A,50A,63A,76A,89A,114B,140B,175B,182B,197B,228B,334B,367B,385B,429B,563B,668B,694B,729B,736B,751B,782B,888B,921B,939B,983B,1117B,1222B,1248B,1283B,1290B,1305B,1336B,1442B,1475B,1493B,1537B,1671B,1776B,1802B,1837B,1844B,1859B,1890B,1996B,2029B,2047B,2091B,2225B,2330B,2356B,2391B,2398B,2413B,2444B,2550B,2583B,2601B,2645B,2779B,2884B,2910B,2945B,2952B,2967B,2998B,3104B,3137B,3155B,3199B,3333B,3438B,3464B,3499B,3506B,3521B,3552B,3658B,3691B,3709B,3753B,3887B,3992A 'fiber-opt':3991A 'free':548B,1102B,1656B,2210B,2764B,3318B,3872B 'gbs':350B,904B,1458B,2012B,2566B,3120B,3674B 'great':424B,481B,978B,1035B,1532B,1589B,2086B,2143B,2640B,2697B,3194B,3251B,3748B,3805B 'health':289B,406B,462B,473B,843B,960B,1016B,1027B,1397B,1514B,1570B,1581B,1951B,2068B,2124B,2135B,2505B,2622B,2678B,2689B,3059B,3176B,3232B,3243B,3613B,3730B,3786B,3797B 'heath':579B,1133B,1687B,2241B,2795B,3349B,3903B 'higher':342B,896B,1450B,2004B,2558B,3112B,3666B 'immedi':153B,707B,1261B,1815B,2369B,2923B,3477B 'impact':155B,599B,709B,1153B,1263B,1707B,1817B,2261B,2371B,2815B,2925B,3369B,3479B,3923B 'import':278B,832B,1386B,1940B,2494B,3048B,3602B 'improv':223B,310B,777B,864B,1331B,1418B,1885B,1972B,2439B,2526B,2993B,3080B,3547B,3634B 'incorpor':260B,458B,614B,814B,1012B,1168B,1368B,1566B,1722B,1922B,2120B,2276B,2476B,2674B,2830B,3030B,3228B,3384B,3584B,3782B,3938B 'increas':96B,122B,650B,676B,1204B,1230B,1758B,1784B,2312B,2338B,2866B,2892B,3420B,3446B 'indic':474B,1028B,1582B,2136B,2690B,3244B,3798B 'inform':101B,108B,113B,290B,655B,662B,667B,844B,1209B,1216B,1221B,1398B,1763B,1770B,1775B,1952B,2317B,2324B,2329B,2506B,2871B,2878B,2883B,3060B,3425B,3432B,3437B,3614B,3970A,3972A,3974A,3976A,3978A,3980A,3982A 'innov':610B,1164B,1718B,2272B,2826B,3380B,3934B 'integr':201B,561B,755B,1115B,1309B,1669B,1863B,2223B,2417B,2777B,2971B,3331B,3525B,3885B 'investig':573B,1127B,1681B,2235B,2789B,3343B,3897B 'isol':453B,1007B,1561B,2115B,2669B,3223B,3777B,3996A 'lack':177B,731B,1285B,1839B,2393B,2947B,3501B 'laser':387B,941B,1495B,2049B,2603B,3157B,3711B 'lead':371B,925B,1479B,2033B,2587B,3141B,3695B 'legaci':318B,477B,872B,1031B,1426B,1585B,1980B,2139B,2534B,2693B,3088B,3247B,3642B,3801B 'length':329B,883B,1437B,1991B,2545B,3099B,3653B 'length-bandwidth':328B,882B,1436B,1990B,2544B,3098B,3652B 'life':233B,787B,1341B,1895B,2449B,3003B,3557B 'like':547B,1101B,1655B,2209B,2763B,3317B,3871B 'limit':154B,331B,364B,708B,885B,918B,1262B,1439B,1472B,1816B,1993B,2026B,2370B,2547B,2580B,2924B,3101B,3134B,3478B,3655B,3688B 'link':142B,151B,176B,300B,378B,383B,419B,441B,696B,705B,730B,854B,932B,937B,973B,995B,1250B,1259B,1284B,1408B,1486B,1491B,1527B,1549B,1804B,1813B,1838B,1962B,2040B,2045B,2081B,2103B,2358B,2367B,2392B,2516B,2594B,2599B,2635B,2657B,2912B,2921B,2946B,3070B,3148B,3153B,3189B,3211B,3466B,3475B,3500B,3624B,3702B,3707B,3743B,3765B 'link-loss':440B,994B,1548B,2102B,2656B,3210B,3764B 'locat':210B,764B,1318B,1872B,2426B,2980B,3534B 'loss':442B,996B,1550B,2104B,2658B,3212B,3766B 'maintain':507B,1061B,1615B,2169B,2723B,3277B,3831B 'manag':463B,1017B,1571B,2125B,2679B,3233B,3787B 'mani':373B,927B,1481B,2035B,2589B,3143B,3697B 'manpow':173B,727B,1281B,1835B,2389B,2943B,3497B 'margin':384B,938B,1492B,2046B,2600B,3154B,3708B 'measur':577B,1131B,1685B,2239B,2793B,3347B,3901B 'mechan':421B,975B,1529B,2083B,2637B,3191B,3745B 'meet':636B,1190B,1744B,2298B,2852B,3406B,3960B 'method':202B,756B,1310B,1864B,2418B,2972B,3526B 'micron':490B,495B,1044B,1049B,1598B,1603B,2152B,2157B,2706B,2711B,3260B,3265B,3814B,3819B 'mil':531B,535B,1085B,1089B,1639B,1643B,2193B,2197B,2747B,2751B,3301B,3305B,3855B,3859B 'mil-std':530B,534B,1084B,1088B,1638B,1642B,2192B,2196B,2746B,2750B,3300B,3304B,3854B,3858B 'militari':133B,641B,687B,1195B,1241B,1749B,1795B,2303B,2349B,2857B,2903B,3411B,3457B,3965B 'minim':619B,1173B,1727B,2281B,2835B,3389B,3943B 'minimum':353B,907B,1461B,2015B,2569B,3123B,3677B 'mission':105B,163B,659B,717B,1213B,1271B,1767B,1825B,2321B,2379B,2875B,2933B,3429B,3487B 'mm':10A,23A,36A,49A,62A,75A,88A 'mmf':492B,496B,1046B,1050B,1600B,1604B,2154B,2158B,2708B,2712B,3262B,3266B,3816B,3820B 'mode':9A,22A,35A,48A,61A,74A,87A 'monitor':180B,204B,263B,274B,403B,450B,455B,617B,734B,758B,817B,828B,957B,1004B,1009B,1171B,1288B,1312B,1371B,1382B,1511B,1558B,1563B,1725B,1842B,1866B,1925B,1936B,2065B,2112B,2117B,2279B,2396B,2420B,2479B,2490B,2619B,2666B,2671B,2833B,2950B,2974B,3033B,3044B,3173B,3220B,3225B,3387B,3504B,3528B,3587B,3598B,3727B,3774B,3779B,3941B 'multi':8A,21A,34A,47A,60A,73A,86A 'multi-mod':7A,20A,33A,46A,59A,72A,85A 'must':592B,1146B,1700B,2254B,2808B,3362B,3916B 'natur':519B,1073B,1627B,2181B,2735B,3289B,3843B 'navig':112B,666B,1220B,1774B,2328B,2882B,3436B 'need':315B,520B,550B,634B,869B,1074B,1104B,1188B,1423B,1628B,1658B,1742B,1977B,2182B,2212B,2296B,2531B,2736B,2766B,2850B,3085B,3290B,3320B,3404B,3639B,3844B,3874B,3958B 'negoti':298B,852B,1406B,1960B,2514B,3068B,3622B 'network':13A,26A,39A,52A,65A,78A,91A,229B,236B,245B,271B,319B,369B,564B,583B,626B,783B,790B,799B,825B,873B,923B,1118B,1137B,1180B,1337B,1344B,1353B,1379B,1427B,1477B,1672B,1691B,1734B,1891B,1898B,1907B,1933B,1981B,2031B,2226B,2245B,2288B,2445B,2452B,2461B,2487B,2535B,2585B,2780B,2799B,2842B,2999B,3006B,3015B,3041B,3089B,3139B,3334B,3353B,3396B,3553B,3560B,3569B,3595B,3643B,3693B,3888B,3907B,3950B 'new':499B,1053B,1607B,2161B,2715B,3269B,3823B 'node':254B,808B,1362B,1916B,2470B,3024B,3578B 'normal':581B,588B,1135B,1142B,1689B,1696B,2243B,2250B,2797B,2804B,3351B,3358B,3905B,3912B 'often':166B,720B,1274B,1828B,2382B,2936B,3490B 'om2':491B,1045B,1599B,2153B,2707B,3261B,3815B 'oper':582B,597B,1136B,1151B,1690B,1705B,2244B,2259B,2798B,2813B,3352B,3367B,3906B,3921B 'opportun':446B,1000B,1554B,2108B,2662B,3216B,3770B 'optic':115B,141B,195B,198B,250B,368B,430B,434B,669B,695B,749B,752B,804B,922B,984B,988B,1223B,1249B,1303B,1306B,1358B,1476B,1538B,1542B,1777B,1803B,1857B,1860B,1912B,2030B,2092B,2096B,2331B,2357B,2411B,2414B,2466B,2584B,2646B,2650B,2885B,2911B,2965B,2968B,3020B,3138B,3200B,3204B,3439B,3465B,3519B,3522B,3574B,3692B,3754B,3758B,3989A,3993A 'optim':304B,858B,1412B,1966B,2520B,3074B,3628B 'otdr':438B,992B,1546B,2100B,2654B,3208B,3762B 'ownership':221B,775B,1329B,1883B,2437B,2991B,3545B 'packag':541B,1095B,1649B,2203B,2757B,3311B,3865B 'pathway':196B,750B,1304B,1858B,2412B,2966B,3520B 'pc':551B,1105B,1659B,2213B,2767B,3321B,3875B 'perform':123B,505B,627B,638B,677B,1059B,1181B,1192B,1231B,1613B,1735B,1746B,1785B,2167B,2289B,2300B,2339B,2721B,2843B,2854B,2893B,3275B,3397B,3408B,3447B,3829B,3951B,3962B 'phm':464B,1018B,1572B,2126B,2680B,3234B,3788B 'plant':184B,207B,262B,335B,616B,738B,761B,816B,889B,1170B,1292B,1315B,1370B,1443B,1724B,1846B,1869B,1924B,1997B,2278B,2400B,2423B,2478B,2551B,2832B,2954B,2977B,3032B,3105B,3386B,3508B,3531B,3586B,3659B,3940B 'platform':94B,158B,361B,479B,484B,648B,712B,915B,1033B,1038B,1202B,1266B,1469B,1587B,1592B,1756B,1820B,2023B,2141B,2146B,2310B,2374B,2577B,2695B,2700B,2864B,2928B,3131B,3249B,3254B,3418B,3482B,3685B,3803B,3808B 'poor':147B,701B,1255B,1809B,2363B,2917B,3471B 'posit':110B,664B,1218B,1772B,2326B,2880B,3434B 'potenti':138B,214B,374B,418B,692B,768B,928B,972B,1246B,1322B,1482B,1526B,1800B,1876B,2036B,2080B,2354B,2430B,2590B,2634B,2908B,2984B,3144B,3188B,3462B,3538B,3698B,3742B 'power':126B,680B,1234B,1788B,2342B,2896B,3450B 'precis':209B,763B,1317B,1871B,2425B,2979B,3533B 'present':444B,998B,1552B,2106B,2660B,3214B,3768B 'process':604B,1158B,1712B,2266B,2820B,3374B,3928B 'product':621B,1175B,1729B,2283B,2837B,3391B,3945B 'prognost':460B,565B,1014B,1119B,1568B,1673B,2122B,2227B,2676B,2781B,3230B,3335B,3784B,3889B,3984A 'push':362B,916B,1470B,2024B,2578B,3132B,3686B 'qualiti':148B,702B,1256B,1810B,2364B,2918B,3472B 'rate':302B,344B,856B,898B,1410B,1452B,1964B,2006B,2518B,2560B,3072B,3114B,3626B,3668B 'real':448B,553B,1002B,1107B,1556B,1661B,2110B,2215B,2664B,2769B,3218B,3323B,3772B,3877B 'receiv':397B,951B,1505B,2059B,2613B,3167B,3721B 'reduc':125B,216B,382B,396B,679B,770B,936B,950B,1233B,1324B,1490B,1504B,1787B,1878B,2044B,2058B,2341B,2432B,2598B,2612B,2895B,2986B,3152B,3166B,3449B,3540B,3706B,3720B 'reflectomet':437B,991B,1545B,2099B,2653B,3207B,3761B 'reli':238B,792B,1346B,1900B,2454B,3008B,3562B 'remot':253B,807B,1361B,1915B,2469B,3023B,3577B 'repair':165B,719B,1273B,1827B,2381B,2935B,3489B 'replac':511B,1065B,1619B,2173B,2727B,3281B,3835B 'requir':320B,355B,558B,639B,874B,909B,1112B,1193B,1428B,1463B,1666B,1747B,1982B,2017B,2220B,2301B,2536B,2571B,2774B,2855B,3090B,3125B,3328B,3409B,3644B,3679B,3882B,3963B 'research':571B,1125B,1679B,2233B,2787B,3341B,3895B 'rugged':645B,1199B,1753B,2307B,2861B,3415B,3969B 'sacrif':625B,1179B,1733B,2287B,2841B,3395B,3949B 'scale':629B,1183B,1737B,2291B,2845B,3399B,3953B 'seek':608B,1162B,1716B,2270B,2824B,3378B,3932B 'sensor':107B,311B,661B,865B,1215B,1419B,1769B,1973B,2323B,2527B,2877B,3081B,3431B,3635B 'signal':398B,952B,1506B,2060B,2614B,3168B,3722B 'signific':213B,767B,1321B,1875B,2429B,2983B,3537B 'smaller':540B,1094B,1648B,2202B,2756B,3310B,3864B 'smart':322B,876B,1430B,1984B,2538B,3092B,3646B 'softwar':467B,1021B,1575B,2129B,2683B,3237B,3791B 'solut':632B,1186B,1740B,2294B,2848B,3402B,3956B 'sourc':388B,942B,1496B,2050B,2604B,3158B,3712B 'standard':642B,1196B,1750B,2304B,2858B,3412B,3966B 'status':287B,841B,1395B,1949B,2503B,3057B,3611B 'std':532B,536B,1086B,1090B,1640B,1644B,2194B,2198B,2748B,2752B,3302B,3306B,3856B,3860B 'strategi':575B,1129B,1683B,2237B,2791B,3345B,3899B 'strength':399B,953B,1507B,2061B,2615B,3169B,3723B 'support':337B,891B,1445B,1999B,2553B,3107B,3661B 'surviv':525B,1079B,1633B,2187B,2741B,3295B,3849B 'suscept':130B,684B,1238B,1792B,2346B,2900B,3454B 'switch':242B,248B,268B,611B,796B,802B,822B,1165B,1350B,1356B,1376B,1719B,1904B,1910B,1930B,2273B,2458B,2464B,2484B,2827B,3012B,3018B,3038B,3381B,3566B,3572B,3592B,3935B 'system':106B,178B,199B,283B,312B,346B,401B,405B,456B,517B,569B,660B,732B,753B,837B,866B,900B,955B,959B,1010B,1071B,1123B,1214B,1286B,1307B,1391B,1420B,1454B,1509B,1513B,1564B,1625B,1677B,1768B,1840B,1861B,1945B,1974B,2008B,2063B,2067B,2118B,2179B,2231B,2322B,2394B,2415B,2499B,2528B,2562B,2617B,2621B,2672B,2733B,2785B,2876B,2948B,2969B,3053B,3082B,3116B,3171B,3175B,3226B,3287B,3339B,3430B,3502B,3523B,3607B,3636B,3670B,3725B,3729B,3780B,3841B,3893B,3971A,3973A,3975A,3977A,3979A,3981A,3983A 'take':167B,721B,1275B,1829B,2383B,2937B,3491B 'tax':97B,651B,1205B,1759B,2313B,2867B,3421B 'technolog':264B,500B,555B,818B,1054B,1109B,1372B,1608B,1663B,1926B,2162B,2217B,2480B,2716B,2771B,3034B,3270B,3325B,3588B,3824B,3879B 'temperatur':527B,1081B,1635B,2189B,2743B,3297B,3851B 'test':3A,16A,29A,42A,55A,68A,81A,3988A 'therefor':258B,812B,1366B,1920B,2474B,3028B,3582B 'throughput':306B,860B,1414B,1968B,2522B,3076B,3630B 'time':171B,435B,449B,725B,989B,1003B,1279B,1543B,1557B,1833B,2097B,2111B,2387B,2651B,2665B,2941B,3205B,3219B,3495B,3759B,3773B 'topic':607B,1161B,1715B,2269B,2823B,3377B,3931B 'total':218B,772B,1326B,1880B,2434B,2988B,3542B 'toward':341B,895B,1449B,2003B,2557B,3111B,3665B 'traffic':246B,800B,1354B,1908B,2462B,3016B,3570B 'transceiv':431B,985B,1539B,2093B,2647B,3201B,3755B 'typic':132B,174B,237B,485B,686B,728B,791B,1039B,1240B,1282B,1345B,1593B,1794B,1836B,1899B,2147B,2348B,2390B,2453B,2701B,2902B,2944B,3007B,3255B,3456B,3498B,3561B,3809B 'understand':414B,968B,1522B,2076B,2630B,3184B,3738B 'use':119B,325B,412B,673B,879B,966B,1227B,1433B,1520B,1781B,1987B,2074B,2335B,2541B,2628B,2889B,3095B,3182B,3443B,3649B,3736B 'util':317B,871B,1425B,1979B,2533B,3087B,3641B 'vibrat':529B,1083B,1637B,2191B,2745B,3299B,3853B 'warfight':428B,982B,1536B,2090B,2644B,3198B,3752B 'way':375B,929B,1483B,2037B,2591B,3145B,3699B 'without':598B,624B,1152B,1178B,1706B,1732B,2260B,2286B,2814B,2840B,3368B,3394B,3922B,3948B 'would':291B,518B,542B,546B,845B,1072B,1096B,1100B,1399B,1626B,1650B,1654B,1953B,2180B,2204B,2208B,2507B,2734B,2758B,2762B,3061B,3288B,3312B,3316B,3615B,3842B,3866B,3870B	AirForce
173	AF151-096	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46397	Selecting Appropriate Protective Courses of Action when Information-Starved	2	Our U.S space systems operate in an extremely harsh space environment.  Additionally, the space environment, and in particular the Geostationary orbit, is becoming increasingly congested and contested.  To ensure the continued operation of the Air Forces global space missions (Missile Warning, Military Satellite Communications, and Precision Navigation and Timing) we require space systems capable of acting/reacting within the timelines dictated by expected hazards and threats.  However, this protective capability must also be properly balanced against mission requirements and system resource limitations, to prevent the unnecessary depletion of said resources or impacts to the mission (e.g. ambiguous sensor readings lead the satellite to maneuver which in turn reduces the systems station keeping capability, effectively shortening the satellites service life).\r\n\r\nThe Air Force Research Laboratory believes that enabling these protective responses at a temporally effective pace will require increased levels of system autonomy to identify, assess,  recommend, and eventually choose, plan and execute appropriate protective courses of action.  AFRL also believes that, similar to all other warfighting domains subject to the fog of war, that operators and (eventually) systems will have to make these choices in the presence of incomplete and/or low quality sets of data and information.  AFRLs efforts to enable more autonomous space systems, is broken into the four following, yet highly coupled, areas:\r\n1)  Sensor Data Fusion: Integration of data from multiple sources, in order to properly assess the situation.  The data can be from on-board sensors and satellite payloads, in addition to external sources of information (such as Space Situational Awareness information products from a Space Operations Center).\r\n2)  System Management: Housekeeping operations to keep the space vehicle operating.  Examples include controlling the charging and discharging of batteries, rotation of the solar arrays to maintain alignment with the sun, powering heaters to keep components from getting to cold, etc.\r\n3)  Course of Action (COA) Selection: Selecting the appropriate COA that a) minimizes the effects from the threat/hazard, b) maximizes attainment of mission requirements, and c) minimizes resource depletion.  Requires multivariable optimization, in a noisy environment, with incomplete or missing information.\r\n4)  Mission Planning: Once a COA has been selected, developing the set of procedures required to execute that COA.\r\n\r\nThis topic is focused specifically on COA selection, although some work may be extensible to other areas.\r\n\r\nTo enable efficient and effective COA selection, AFRL is interested in the following (non-inclusive) technology areas: \r\n1)  Hypothesis development and rejection, to quickly populate, and then reduce, the set of likely anomalies and satisfactory responses.\r\n2)  Sensor or system tasking to generate, or gather, the most critical pieces of information that are currently lacking.  Such taskings must also consider the temporal aspects of the information requirements. \r\n3)  Ensuring stability in under-defined and noisy mathematical systems.\r\n\r\nSince the intent is to transition the technology into operational satellites, preference will be shown to those proposals that demonstrate traceability to the size, weight and power (SWAP) and computational limits of current and/or future space processing architectures.	To develop algorithms, processes, and/or mathematical constructs that enable the selection of appropriate courses of action, even in the face of insufficient or low-quality data and information, in a congested and/or contested space environment.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':269B,453B,770B,954B,1271B,1455B,1772B,1956B,2273B,2457B '2':317B,472B,818B,973B,1319B,1474B,1820B,1975B,2321B,2476B '3':358B,503B,859B,1004B,1360B,1505B,1861B,2006B,2362B,2507B '4':399B,900B,1401B,1902B,2403B 'acting/reacting':107B,608B,1109B,1610B,2111B 'action':6A,16A,26A,36A,46A,209B,361B,710B,862B,1211B,1363B,1712B,1864B,2213B,2365B 'addit':62B,299B,563B,800B,1064B,1301B,1565B,1802B,2066B,2303B 'afrl':210B,250B,442B,711B,751B,943B,1212B,1252B,1444B,1713B,1753B,1945B,2214B,2254B,2446B 'air':85B,173B,586B,674B,1087B,1175B,1588B,1676B,2089B,2177B 'align':344B,845B,1346B,1847B,2348B 'also':122B,211B,494B,623B,712B,995B,1124B,1213B,1496B,1625B,1714B,1997B,2126B,2215B,2498B 'although':426B,927B,1428B,1929B,2430B 'ambigu':147B,648B,1149B,1650B,2151B 'and/or':242B,547B,743B,1048B,1244B,1549B,1745B,2050B,2246B,2551B 'anomali':468B,969B,1470B,1971B,2472B 'appropri':2A,12A,22A,32A,42A,205B,366B,706B,867B,1207B,1368B,1708B,1869B,2209B,2370B 'architectur':551B,1052B,1553B,2054B,2555B 'area':268B,434B,452B,769B,935B,953B,1270B,1436B,1454B,1771B,1937B,1955B,2272B,2438B,2456B 'array':341B,842B,1343B,1844B,2345B 'aspect':498B,999B,1500B,2001B,2502B 'assess':197B,283B,698B,784B,1199B,1285B,1700B,1786B,2201B,2287B 'attain':378B,879B,1380B,1881B,2382B 'autonom':256B,757B,1258B,1759B,2260B 'autonomi':194B,695B,1196B,1697B,2198B,2569A 'awar':309B,810B,1311B,1812B,2313B 'b':376B,877B,1378B,1879B,2380B 'balanc':125B,626B,1127B,1628B,2129B 'batteri':336B,837B,1338B,1839B,2340B 'becom':73B,574B,1075B,1576B,2077B 'believ':177B,212B,678B,713B,1179B,1214B,1680B,1715B,2181B,2216B 'board':293B,794B,1295B,1796B,2297B 'broken':260B,761B,1262B,1763B,2264B 'c':383B,884B,1385B,1886B,2387B 'capabl':105B,120B,164B,606B,621B,665B,1107B,1122B,1166B,1608B,1623B,1667B,2109B,2124B,2168B 'center':316B,817B,1318B,1819B,2320B 'charg':332B,833B,1334B,1835B,2336B 'choic':236B,737B,1238B,1739B,2240B 'choos':201B,702B,1203B,1704B,2205B 'coa':362B,367B,404B,417B,424B,440B,863B,868B,905B,918B,925B,941B,1364B,1369B,1406B,1419B,1426B,1442B,1865B,1870B,1907B,1920B,1927B,1943B,2366B,2371B,2408B,2421B,2428B,2444B 'cold':356B,857B,1358B,1859B,2360B 'communic':95B,596B,1097B,1598B,2099B 'compon':352B,853B,1354B,1855B,2356B 'comput':543B,1044B,1545B,2046B,2547B 'congest':75B,576B,1077B,1578B,2079B 'consid':495B,996B,1497B,1998B,2499B 'contest':77B,578B,1079B,1580B,2081B 'continu':81B,582B,1083B,1584B,2085B 'control':330B,831B,1332B,1833B,2334B 'coupl':267B,768B,1269B,1770B,2271B 'cours':4A,14A,24A,34A,44A,207B,359B,708B,860B,1209B,1361B,1710B,1862B,2211B,2363B 'critic':483B,984B,1485B,1986B,2487B 'current':489B,546B,990B,1047B,1491B,1548B,1992B,2049B,2493B,2550B 'data':247B,271B,275B,287B,748B,772B,776B,788B,1249B,1273B,1277B,1289B,1750B,1774B,1778B,1790B,2251B,2275B,2279B,2291B 'decis':2570A 'defin':509B,1010B,1511B,2012B,2513B 'demonstr':533B,1034B,1535B,2036B,2537B 'deplet':137B,386B,638B,887B,1139B,1388B,1640B,1889B,2141B,2390B 'develop':408B,455B,909B,956B,1410B,1457B,1911B,1958B,2412B,2459B 'dictat':111B,612B,1113B,1614B,2115B 'discharg':334B,835B,1336B,1837B,2338B 'domain':219B,720B,1221B,1722B,2223B 'e.g':146B,647B,1148B,1649B,2150B 'effect':165B,186B,372B,439B,666B,687B,873B,940B,1167B,1188B,1374B,1441B,1668B,1689B,1875B,1942B,2169B,2190B,2376B,2443B 'effici':437B,938B,1439B,1940B,2441B 'effort':252B,753B,1254B,1755B,2256B 'enabl':179B,254B,436B,680B,755B,937B,1181B,1256B,1438B,1682B,1757B,1939B,2183B,2258B,2440B 'ensur':79B,504B,580B,1005B,1081B,1506B,1582B,2007B,2083B,2508B 'environ':61B,65B,393B,562B,566B,894B,1063B,1067B,1395B,1564B,1568B,1896B,2065B,2069B,2397B 'etc':357B,858B,1359B,1860B,2361B 'eventu':200B,229B,701B,730B,1202B,1231B,1703B,1732B,2204B,2233B 'exampl':328B,829B,1330B,1831B,2332B 'execut':204B,415B,705B,916B,1206B,1417B,1707B,1918B,2208B,2419B 'expect':113B,614B,1115B,1616B,2117B 'extens':431B,932B,1433B,1934B,2435B 'extern':301B,802B,1303B,1804B,2305B 'extrem':58B,559B,1060B,1561B,2062B 'focus':421B,922B,1423B,1924B,2425B 'fog':223B,724B,1225B,1726B,2227B 'follow':264B,447B,765B,948B,1266B,1449B,1767B,1950B,2268B,2451B 'forc':86B,174B,587B,675B,1088B,1176B,1589B,1677B,2090B,2178B 'four':263B,764B,1265B,1766B,2267B 'fusion':272B,773B,1274B,1775B,2276B 'futur':548B,1049B,1550B,2051B,2552B 'gather':480B,981B,1482B,1983B,2484B 'generat':478B,979B,1480B,1981B,2482B 'geostationari':70B,571B,1072B,1573B,2074B 'get':354B,855B,1356B,1857B,2358B 'global':88B,589B,1090B,1591B,2092B 'harsh':59B,560B,1061B,1562B,2063B 'hazard':114B,615B,1116B,1617B,2118B 'heater':349B,850B,1351B,1852B,2353B 'high':266B,767B,1268B,1769B,2270B 'housekeep':320B,821B,1322B,1823B,2324B 'howev':117B,618B,1119B,1620B,2121B 'hypothesi':454B,955B,1456B,1957B,2458B 'identifi':196B,697B,1198B,1699B,2200B 'impact':142B,643B,1144B,1645B,2146B 'includ':329B,830B,1331B,1832B,2333B 'inclus':450B,951B,1452B,1953B,2454B 'incomplet':241B,395B,742B,896B,1243B,1397B,1744B,1898B,2245B,2399B 'increas':74B,190B,575B,691B,1076B,1192B,1577B,1693B,2078B,2194B 'inform':9A,19A,29A,39A,49A,249B,304B,310B,398B,486B,501B,750B,805B,811B,899B,987B,1002B,1251B,1306B,1312B,1400B,1488B,1503B,1752B,1807B,1813B,1901B,1989B,2004B,2253B,2308B,2314B,2402B,2490B,2505B,2556A,2558A,2560A,2562A,2564A,2568A 'information-starv':8A,18A,28A,38A,48A 'insuffici':2567A 'integr':273B,774B,1275B,1776B,2277B 'intent':516B,1017B,1518B,2019B,2520B 'interest':444B,945B,1446B,1947B,2448B 'keep':163B,323B,351B,664B,824B,852B,1165B,1325B,1353B,1666B,1826B,1854B,2167B,2327B,2355B 'laboratori':176B,677B,1178B,1679B,2180B 'lack':490B,991B,1492B,1993B,2494B 'lead':150B,651B,1152B,1653B,2154B 'level':191B,692B,1193B,1694B,2195B 'life':171B,672B,1173B,1674B,2175B 'like':467B,968B,1469B,1970B,2471B 'limit':132B,544B,633B,1045B,1134B,1546B,1635B,2047B,2136B,2548B 'low':243B,744B,1245B,1746B,2247B 'maintain':343B,844B,1345B,1846B,2347B 'make':234B,735B,1236B,1737B,2238B,2571A 'manag':319B,820B,1321B,1822B,2323B 'maneuv':154B,655B,1156B,1657B,2158B 'mathemat':512B,1013B,1514B,2015B,2516B 'maxim':377B,878B,1379B,1880B,2381B 'may':429B,930B,1431B,1932B,2433B 'militari':93B,594B,1095B,1596B,2097B 'minim':370B,384B,871B,885B,1372B,1386B,1873B,1887B,2374B,2388B 'miss':397B,898B,1399B,1900B,2401B 'missil':91B,592B,1093B,1594B,2095B 'mission':90B,127B,145B,380B,400B,591B,628B,646B,881B,901B,1092B,1129B,1147B,1382B,1402B,1593B,1630B,1648B,1883B,1903B,2094B,2131B,2149B,2384B,2404B 'multipl':277B,778B,1279B,1780B,2281B 'multivari':388B,889B,1390B,1891B,2392B 'must':121B,493B,622B,994B,1123B,1495B,1624B,1996B,2125B,2497B 'navig':98B,599B,1100B,1601B,2102B 'noisi':392B,511B,893B,1012B,1394B,1513B,1895B,2014B,2396B,2515B 'non':449B,950B,1451B,1952B,2453B 'non-inclus':448B,949B,1450B,1951B,2452B 'on-board':291B,792B,1293B,1794B,2295B 'oper':55B,82B,227B,315B,321B,327B,523B,556B,583B,728B,816B,822B,828B,1024B,1057B,1084B,1229B,1317B,1323B,1329B,1525B,1558B,1585B,1730B,1818B,1824B,1830B,2026B,2059B,2086B,2231B,2319B,2325B,2331B,2527B 'optim':389B,890B,1391B,1892B,2393B 'orbit':71B,572B,1073B,1574B,2075B 'order':280B,781B,1282B,1783B,2284B 'pace':187B,688B,1189B,1690B,2191B 'particular':68B,569B,1070B,1571B,2072B 'payload':297B,798B,1299B,1800B,2301B 'piec':484B,985B,1486B,1987B,2488B 'plan':202B,401B,703B,902B,1204B,1403B,1705B,1904B,2206B,2405B 'popul':460B,961B,1462B,1963B,2464B 'power':348B,540B,849B,1041B,1350B,1542B,1851B,2043B,2352B,2544B 'precis':97B,598B,1099B,1600B,2101B 'prefer':525B,1026B,1527B,2028B,2529B 'presenc':239B,740B,1241B,1742B,2243B 'prevent':134B,635B,1136B,1637B,2138B 'procedur':412B,913B,1414B,1915B,2416B 'process':550B,1051B,1552B,2053B,2554B 'product':311B,812B,1313B,1814B,2315B 'proper':124B,282B,625B,783B,1126B,1284B,1627B,1785B,2128B,2286B 'propos':531B,1032B,1533B,2034B,2535B 'protect':3A,13A,23A,33A,43A,119B,181B,206B,620B,682B,707B,1121B,1183B,1208B,1622B,1684B,1709B,2123B,2185B,2210B 'qualiti':244B,745B,1246B,1747B,2248B 'quick':459B,960B,1461B,1962B,2463B 'read':149B,650B,1151B,1652B,2153B 'recommend':198B,699B,1200B,1701B,2202B 'reduc':158B,463B,659B,964B,1160B,1465B,1661B,1966B,2162B,2467B 'reject':457B,958B,1459B,1960B,2461B 'requir':102B,128B,189B,381B,387B,413B,502B,603B,629B,690B,882B,888B,914B,1003B,1104B,1130B,1191B,1383B,1389B,1415B,1504B,1605B,1631B,1692B,1884B,1890B,1916B,2005B,2106B,2132B,2193B,2385B,2391B,2417B,2506B 'research':175B,676B,1177B,1678B,2179B 'resili':2566A,2572A 'resourc':131B,140B,385B,632B,641B,886B,1133B,1142B,1387B,1634B,1643B,1888B,2135B,2144B,2389B 'respons':182B,471B,683B,972B,1184B,1473B,1685B,1974B,2186B,2475B 'rotat':337B,838B,1339B,1840B,2341B 'said':139B,640B,1141B,1642B,2143B 'satellit':94B,152B,168B,296B,524B,595B,653B,669B,797B,1025B,1096B,1154B,1170B,1298B,1526B,1597B,1655B,1671B,1799B,2027B,2098B,2156B,2172B,2300B,2528B 'satisfactori':470B,971B,1472B,1973B,2474B 'select':1A,11A,21A,31A,41A,363B,364B,407B,425B,441B,864B,865B,908B,926B,942B,1365B,1366B,1409B,1427B,1443B,1866B,1867B,1910B,1928B,1944B,2367B,2368B,2411B,2429B,2445B 'sensor':148B,270B,294B,473B,649B,771B,795B,974B,1150B,1272B,1296B,1475B,1651B,1773B,1797B,1976B,2152B,2274B,2298B,2477B 'servic':170B,671B,1172B,1673B,2174B 'set':245B,410B,465B,746B,911B,966B,1247B,1412B,1467B,1748B,1913B,1968B,2249B,2414B,2469B 'shorten':166B,667B,1168B,1669B,2170B 'shown':528B,1029B,1530B,2031B,2532B 'similar':214B,715B,1216B,1717B,2218B 'sinc':514B,1015B,1516B,2017B,2518B 'situat':285B,308B,786B,809B,1287B,1310B,1788B,1811B,2289B,2312B 'size':537B,1038B,1539B,2040B,2541B 'solar':340B,841B,1342B,1843B,2344B 'sourc':278B,302B,779B,803B,1280B,1304B,1781B,1805B,2282B,2306B 'space':53B,60B,64B,89B,103B,257B,307B,314B,325B,549B,554B,561B,565B,590B,604B,758B,808B,815B,826B,1050B,1055B,1062B,1066B,1091B,1105B,1259B,1309B,1316B,1327B,1551B,1556B,1563B,1567B,1592B,1606B,1760B,1810B,1817B,1828B,2052B,2057B,2064B,2068B,2093B,2107B,2261B,2311B,2318B,2329B,2553B,2573A 'specif':422B,923B,1424B,1925B,2426B 'stabil':505B,1006B,1507B,2008B,2509B 'starv':10A,20A,30A,40A,50A 'station':162B,663B,1164B,1665B,2166B 'subject':220B,721B,1222B,1723B,2224B 'sun':347B,848B,1349B,1850B,2351B 'swap':541B,1042B,1543B,2044B,2545B 'system':54B,104B,130B,160B,193B,230B,258B,318B,475B,513B,555B,605B,631B,661B,694B,731B,759B,819B,976B,1014B,1056B,1106B,1132B,1162B,1195B,1232B,1260B,1320B,1477B,1515B,1557B,1607B,1633B,1663B,1696B,1733B,1761B,1821B,1978B,2016B,2058B,2108B,2134B,2164B,2197B,2234B,2262B,2322B,2479B,2517B,2557A,2559A,2561A,2563A,2565A,2574A 'task':476B,492B,977B,993B,1478B,1494B,1979B,1995B,2480B,2496B 'technolog':451B,521B,952B,1022B,1453B,1523B,1954B,2024B,2455B,2525B 'tempor':185B,497B,686B,998B,1187B,1499B,1688B,2000B,2189B,2501B 'threat':116B,617B,1118B,1619B,2120B 'threat/hazard':375B,876B,1377B,1878B,2379B 'time':100B,601B,1102B,1603B,2104B 'timelin':110B,611B,1112B,1613B,2114B 'topic':419B,920B,1421B,1922B,2423B 'traceabl':534B,1035B,1536B,2037B,2538B 'transit':519B,1020B,1521B,2022B,2523B 'turn':157B,658B,1159B,1660B,2161B 'u.s':52B,553B,1054B,1555B,2056B 'under-defin':507B,1008B,1509B,2010B,2511B 'unnecessari':136B,637B,1138B,1639B,2140B 'vehicl':326B,827B,1328B,1829B,2330B 'war':225B,726B,1227B,1728B,2229B 'warfight':218B,719B,1220B,1721B,2222B 'warn':92B,593B,1094B,1595B,2096B 'weight':538B,1039B,1540B,2041B,2542B 'within':108B,609B,1110B,1611B,2112B 'work':428B,929B,1430B,1931B,2432B 'yet':265B,766B,1267B,1768B,2269B	AirForce
7	AF151-029	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46341	Infrastructure Agnostic Solutions for Anti-Reconnaissance and Cyber Deception	2	The collective stages used to infiltrate a system can be applied to perform a broad range of attacks. However, the most successful assailants rely heavily on the reconnaissance stages, which are primarily divided as passive or active approaches [1]. Passive reconnaissance is a mere collection of information using search engines or various other methods in obtaining publicly available information. This form of information gathering requires entities to practice discretionary posting of information and is often a disregarded tactic used by sophisticated criminals today. The active reconnaissance approach generally results in the act of probing and scanning hosts or servers to determine IP addresses, database information, operating systems used, passwords, usernames, etc. While defensive tactics such as monitoring traffic flow with intrusion detection systems (IDS) or stateful firewalls can help detect active reconnaissance practices, attackers are still able to administer stealthier techniques, such as sending smaller amounts of packets to avoid detection. Since reconnaissance is generally the preceding stage in an attempt to compromise a system, attackers can successfully perform a multitude of attacks on target systems using the gathered information.   As such, increasing the effort required on the part of the adversary to obtain actionable intelligence, or providing inaccurate information altogether can enhance the overall security posture of a system or network [2].\r\n\r\nThere is a need for secure, infrastructure agnostic, solutions designed for cyber agility and anti-reconnaissance.  Such solutions must effectively prevent traffic analysis, and must implement evasive and deceptive techniques such as misreporting source and destination IP and/or MAC addresses, and intermittently changing those addresses.  The technology must be capable of preventing an adversary from accurately determining the direction or volume of information moving within the network, or the size or topology of the network itself, and must be capable of taking measures to prevent, detect, and cease communication with non-compliant or rogue clients within the environment.\r\n\r\nConsideration will be given to solutions that 1) have little to no impact to network performance or the availability of services, 2) those that do not require customized, or otherwise "non-commodity" hardware, 3) those that provide for flexible infrastructure or enclaves that can be set up, re-segmented, and/or taken down quickly, and 4) those that are capable of supporting a PKI or other robust cryptosystem.  The performer should not assume that solely providing a large address space, in which it is difficult for the attacker to predict the next address, provides a sufficient level of assurance.	This topic seeks to provide new and novel approaches to delaying, disrupting and deceiving adversaries engaged in active network reconnaissance.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':99B,381B,512B,794B,925B,1207B,1338B,1620B,1751B,2033B,2164B,2446B '2':273B,395B,686B,808B,1099B,1221B,1512B,1634B,1925B,2047B,2338B,2460B '3':408B,821B,1234B,1647B,2060B,2473B '4':430B,843B,1256B,1669B,2082B,2495B 'abl':197B,610B,1023B,1436B,1849B,2262B 'accur':330B,743B,1156B,1569B,1982B,2395B 'act':152B,565B,978B,1391B,1804B,2217B 'action':255B,668B,1081B,1494B,1907B,2320B 'activ':97B,145B,191B,510B,558B,604B,923B,971B,1017B,1336B,1384B,1430B,1749B,1797B,1843B,2162B,2210B,2256B 'address':163B,314B,319B,453B,467B,576B,727B,732B,866B,880B,989B,1140B,1145B,1279B,1293B,1402B,1553B,1558B,1692B,1706B,1815B,1966B,1971B,2105B,2119B,2228B,2379B,2384B,2518B,2532B 'administ':199B,612B,1025B,1438B,1851B,2264B 'adversari':252B,328B,665B,741B,1078B,1154B,1491B,1567B,1904B,1980B,2317B,2393B 'agil':286B,699B,1112B,1525B,1938B,2351B,2551A 'agnost':2A,12A,22A,32A,42A,52A,281B,694B,1107B,1520B,1933B,2346B 'altogeth':261B,674B,1087B,1500B,1913B,2326B 'amount':206B,619B,1032B,1445B,1858B,2271B 'analysi':297B,710B,1123B,1536B,1949B,2362B 'and/or':312B,425B,725B,838B,1138B,1251B,1551B,1664B,1964B,2077B,2377B,2490B 'anti':6A,16A,26A,36A,46A,56A,289B,702B,1115B,1528B,1941B,2354B 'anti-reconnaiss':5A,15A,25A,35A,45A,55A,288B,701B,1114B,1527B,1940B,2353B 'appli':71B,484B,897B,1310B,1723B,2136B 'approach':98B,147B,511B,560B,924B,973B,1337B,1386B,1750B,1799B,2163B,2212B 'assail':83B,496B,909B,1322B,1735B,2148B 'assum':447B,860B,1273B,1686B,2099B,2512B 'assur':473B,886B,1299B,1712B,2125B,2538B 'attack':78B,194B,226B,233B,462B,491B,607B,639B,646B,875B,904B,1020B,1052B,1059B,1288B,1317B,1433B,1465B,1472B,1701B,1730B,1846B,1878B,1885B,2114B,2143B,2259B,2291B,2298B,2527B,2554A 'attempt':221B,634B,1047B,1460B,1873B,2286B 'avail':118B,392B,531B,805B,944B,1218B,1357B,1631B,1770B,2044B,2183B,2457B 'avoid':210B,623B,1036B,1449B,1862B,2275B,2553A 'awar':2558A 'broad':75B,488B,901B,1314B,1727B,2140B 'capabl':324B,354B,434B,737B,767B,847B,1150B,1180B,1260B,1563B,1593B,1673B,1976B,2006B,2086B,2389B,2419B,2499B 'ceas':362B,775B,1188B,1601B,2014B,2427B 'chang':317B,730B,1143B,1556B,1969B,2382B 'client':370B,783B,1196B,1609B,2022B,2435B 'collect':62B,105B,475B,518B,888B,931B,1301B,1344B,1714B,1757B,2127B,2170B 'commod':406B,819B,1232B,1645B,2058B,2471B 'communic':363B,776B,1189B,1602B,2015B,2428B 'compliant':367B,780B,1193B,1606B,2019B,2432B 'compromis':223B,636B,1049B,1462B,1875B,2288B 'consider':374B,787B,1200B,1613B,2026B,2439B 'crimin':142B,555B,968B,1381B,1794B,2207B 'cryptosystem':442B,855B,1268B,1681B,2094B,2507B 'custom':401B,814B,1227B,1640B,2053B,2466B 'cyber':9A,19A,29A,39A,49A,59A,285B,698B,1111B,1524B,1937B,2350B,2556A 'databas':164B,577B,990B,1403B,1816B,2229B 'decept':10A,20A,30A,40A,50A,60A,303B,716B,1129B,1542B,1955B,2368B,2555A 'defens':173B,586B,999B,1412B,1825B,2238B,2561A 'design':283B,696B,1109B,1522B,1935B,2348B 'destin':310B,723B,1136B,1549B,1962B,2375B 'detect':182B,190B,211B,360B,595B,603B,624B,773B,1008B,1016B,1037B,1186B,1421B,1429B,1450B,1599B,1834B,1842B,1863B,2012B,2247B,2255B,2276B,2425B 'determin':161B,331B,574B,744B,987B,1157B,1400B,1570B,1813B,1983B,2226B,2396B 'difficult':459B,872B,1285B,1698B,2111B,2524B 'direct':333B,746B,1159B,1572B,1985B,2398B 'discretionari':129B,542B,955B,1368B,1781B,2194B 'disregard':137B,550B,963B,1376B,1789B,2202B 'divid':93B,506B,919B,1332B,1745B,2158B 'effect':294B,707B,1120B,1533B,1946B,2359B 'effort':245B,658B,1071B,1484B,1897B,2310B 'enclav':416B,829B,1242B,1655B,2068B,2481B 'engin':110B,523B,936B,1349B,1762B,2175B 'enhanc':263B,676B,1089B,1502B,1915B,2328B 'entiti':126B,539B,952B,1365B,1778B,2191B 'environ':373B,786B,1199B,1612B,2025B,2438B 'etc':171B,584B,997B,1410B,1823B,2236B 'evas':301B,714B,1127B,1540B,1953B,2366B 'firewal':187B,600B,1013B,1426B,1839B,2252B 'flexibl':413B,826B,1239B,1652B,2065B,2478B 'flow':179B,592B,1005B,1418B,1831B,2244B 'form':121B,534B,947B,1360B,1773B,2186B 'gather':124B,239B,537B,652B,950B,1065B,1363B,1478B,1776B,1891B,2189B,2304B 'general':148B,215B,561B,628B,974B,1041B,1387B,1454B,1800B,1867B,2213B,2280B 'given':377B,790B,1203B,1616B,2029B,2442B 'hardwar':407B,820B,1233B,1646B,2059B,2472B 'heavili':85B,498B,911B,1324B,1737B,2150B 'help':189B,602B,1015B,1428B,1841B,2254B 'host':157B,570B,983B,1396B,1809B,2222B 'howev':79B,492B,905B,1318B,1731B,2144B 'id':184B,597B,1010B,1423B,1836B,2249B 'impact':386B,799B,1212B,1625B,2038B,2451B 'implement':300B,713B,1126B,1539B,1952B,2365B 'inaccur':259B,672B,1085B,1498B,1911B,2324B 'increas':243B,656B,1069B,1482B,1895B,2308B 'infiltr':66B,479B,892B,1305B,1718B,2131B 'inform':107B,119B,123B,132B,165B,240B,260B,337B,520B,532B,536B,545B,578B,653B,673B,750B,933B,945B,949B,958B,991B,1066B,1086B,1163B,1346B,1358B,1362B,1371B,1404B,1479B,1499B,1576B,1759B,1771B,1775B,1784B,1817B,1892B,1912B,1989B,2172B,2184B,2188B,2197B,2230B,2305B,2325B,2402B,2539A,2541A,2543A,2545A,2547A,2549A 'infrastructur':1A,11A,21A,31A,41A,51A,280B,414B,693B,827B,1106B,1240B,1519B,1653B,1932B,2066B,2345B,2479B 'intellig':256B,669B,1082B,1495B,1908B,2321B 'intermitt':316B,729B,1142B,1555B,1968B,2381B 'intrus':181B,594B,1007B,1420B,1833B,2246B 'ip':162B,311B,575B,724B,988B,1137B,1401B,1550B,1814B,1963B,2227B,2376B 'larg':452B,865B,1278B,1691B,2104B,2517B 'level':471B,884B,1297B,1710B,2123B,2536B 'littl':383B,796B,1209B,1622B,2035B,2448B 'mac':313B,726B,1139B,1552B,1965B,2378B 'measur':357B,770B,1183B,1596B,2009B,2422B 'mere':104B,517B,930B,1343B,1756B,2169B 'method':114B,527B,940B,1353B,1766B,2179B 'misreport':307B,720B,1133B,1546B,1959B,2372B 'monitor':177B,590B,1003B,1416B,1829B,2242B 'move':338B,751B,1164B,1577B,1990B,2403B,2559A 'multitud':231B,644B,1057B,1470B,1883B,2296B 'must':293B,299B,322B,352B,706B,712B,735B,765B,1119B,1125B,1148B,1178B,1532B,1538B,1561B,1591B,1945B,1951B,1974B,2004B,2358B,2364B,2387B,2417B 'need':277B,690B,1103B,1516B,1929B,2342B 'network':272B,341B,349B,388B,685B,754B,762B,801B,1098B,1167B,1175B,1214B,1511B,1580B,1588B,1627B,1924B,1993B,2001B,2040B,2337B,2406B,2414B,2453B 'next':466B,879B,1292B,1705B,2118B,2531B 'non':366B,405B,779B,818B,1192B,1231B,1605B,1644B,2018B,2057B,2431B,2470B 'non-commod':404B,817B,1230B,1643B,2056B,2469B 'non-compli':365B,778B,1191B,1604B,2017B,2430B 'obtain':116B,254B,529B,667B,942B,1080B,1355B,1493B,1768B,1906B,2181B,2319B 'often':135B,548B,961B,1374B,1787B,2200B 'oper':166B,579B,992B,1405B,1818B,2231B 'otherwis':403B,816B,1229B,1642B,2055B,2468B 'overal':265B,678B,1091B,1504B,1917B,2330B 'packet':208B,621B,1034B,1447B,1860B,2273B 'part':249B,662B,1075B,1488B,1901B,2314B 'passiv':95B,100B,508B,513B,921B,926B,1334B,1339B,1747B,1752B,2160B,2165B 'password':169B,582B,995B,1408B,1821B,2234B 'perform':73B,229B,389B,444B,486B,642B,802B,857B,899B,1055B,1215B,1270B,1312B,1468B,1628B,1683B,1725B,1881B,2041B,2096B,2138B,2294B,2454B,2509B 'pki':438B,851B,1264B,1677B,2090B,2503B 'post':130B,543B,956B,1369B,1782B,2195B 'postur':267B,680B,1093B,1506B,1919B,2332B 'practic':128B,193B,541B,606B,954B,1019B,1367B,1432B,1780B,1845B,2193B,2258B 'preced':217B,630B,1043B,1456B,1869B,2282B 'predict':464B,877B,1290B,1703B,2116B,2529B 'prevent':295B,326B,359B,708B,739B,772B,1121B,1152B,1185B,1534B,1565B,1598B,1947B,1978B,2011B,2360B,2391B,2424B 'primarili':92B,505B,918B,1331B,1744B,2157B 'probe':154B,567B,980B,1393B,1806B,2219B 'provid':258B,411B,450B,468B,671B,824B,863B,881B,1084B,1237B,1276B,1294B,1497B,1650B,1689B,1707B,1910B,2063B,2102B,2120B,2323B,2476B,2515B,2533B 'public':117B,530B,943B,1356B,1769B,2182B 'quick':428B,841B,1254B,1667B,2080B,2493B 'rang':76B,489B,902B,1315B,1728B,2141B 're':423B,836B,1249B,1662B,2075B,2488B 're-seg':422B,835B,1248B,1661B,2074B,2487B 'reconnaiss':7A,17A,27A,37A,47A,57A,88B,101B,146B,192B,213B,290B,501B,514B,559B,605B,626B,703B,914B,927B,972B,1018B,1039B,1116B,1327B,1340B,1385B,1431B,1452B,1529B,1740B,1753B,1798B,1844B,1865B,1942B,2153B,2166B,2211B,2257B,2278B,2355B,2552A 'reli':84B,497B,910B,1323B,1736B,2149B 'requir':125B,246B,400B,538B,659B,813B,951B,1072B,1226B,1364B,1485B,1639B,1777B,1898B,2052B,2190B,2311B,2465B 'result':149B,562B,975B,1388B,1801B,2214B 'robust':441B,854B,1267B,1680B,2093B,2506B 'rogu':369B,782B,1195B,1608B,2021B,2434B 'scan':156B,569B,982B,1395B,1808B,2221B 'search':109B,522B,935B,1348B,1761B,2174B 'secur':266B,279B,679B,692B,1092B,1105B,1505B,1518B,1918B,1931B,2331B,2344B 'segment':424B,837B,1250B,1663B,2076B,2489B 'send':204B,617B,1030B,1443B,1856B,2269B 'server':159B,572B,985B,1398B,1811B,2224B 'servic':394B,807B,1220B,1633B,2046B,2459B 'set':420B,833B,1246B,1659B,2072B,2485B 'sinc':212B,625B,1038B,1451B,1864B,2277B 'situat':2557A 'size':344B,757B,1170B,1583B,1996B,2409B 'smaller':205B,618B,1031B,1444B,1857B,2270B 'sole':449B,862B,1275B,1688B,2101B,2514B 'solut':3A,13A,23A,33A,43A,53A,282B,292B,379B,695B,705B,792B,1108B,1118B,1205B,1521B,1531B,1618B,1934B,1944B,2031B,2347B,2357B,2444B 'sophist':141B,554B,967B,1380B,1793B,2206B 'sourc':308B,721B,1134B,1547B,1960B,2373B 'space':454B,867B,1280B,1693B,2106B,2519B 'stage':63B,89B,218B,476B,502B,631B,889B,915B,1044B,1302B,1328B,1457B,1715B,1741B,1870B,2128B,2154B,2283B 'state':186B,599B,1012B,1425B,1838B,2251B 'stealthier':200B,613B,1026B,1439B,1852B,2265B 'still':196B,609B,1022B,1435B,1848B,2261B 'success':82B,228B,495B,641B,908B,1054B,1321B,1467B,1734B,1880B,2147B,2293B 'suffici':470B,883B,1296B,1709B,2122B,2535B 'support':436B,849B,1262B,1675B,2088B,2501B 'system':68B,167B,183B,225B,236B,270B,481B,580B,596B,638B,649B,683B,894B,993B,1009B,1051B,1062B,1096B,1307B,1406B,1422B,1464B,1475B,1509B,1720B,1819B,1835B,1877B,1888B,1922B,2133B,2232B,2248B,2290B,2301B,2335B,2540A,2542A,2544A,2546A,2548A,2550A 'tactic':138B,174B,551B,587B,964B,1000B,1377B,1413B,1790B,1826B,2203B,2239B 'take':356B,769B,1182B,1595B,2008B,2421B 'taken':426B,839B,1252B,1665B,2078B,2491B 'target':235B,648B,1061B,1474B,1887B,2300B,2560A 'techniqu':201B,304B,614B,717B,1027B,1130B,1440B,1543B,1853B,1956B,2266B,2369B 'technolog':321B,734B,1147B,1560B,1973B,2386B 'today':143B,556B,969B,1382B,1795B,2208B 'topolog':346B,759B,1172B,1585B,1998B,2411B 'traffic':178B,296B,591B,709B,1004B,1122B,1417B,1535B,1830B,1948B,2243B,2361B 'use':64B,108B,139B,168B,237B,477B,521B,552B,581B,650B,890B,934B,965B,994B,1063B,1303B,1347B,1378B,1407B,1476B,1716B,1760B,1791B,1820B,1889B,2129B,2173B,2204B,2233B,2302B 'usernam':170B,583B,996B,1409B,1822B,2235B 'various':112B,525B,938B,1351B,1764B,2177B 'volum':335B,748B,1161B,1574B,1987B,2400B 'within':339B,371B,752B,784B,1165B,1197B,1578B,1610B,1991B,2023B,2404B,2436B	AirForce
14	AF151-084	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46389	High-Temperature, Radiation-Hard and High-Efficiency DC-DC Converters for Space	2	Spacecraft power management and distribution (PMAD) systems use DC-DC converters for bidirectional energy transfer from the batteries. They are also used for down converting the energy produced by the solar arrays for delivery to the various loads on the spacecraft.  While these converters traditionally operate at temperatures around 80 degrees centigrade, with convertor efficiencies ranging from 80 percent to 90 percent. Advanced technology switching devices that are becoming available will allow high-temperature operation and reduced switching losses. These devices, such as GaN HEMTs or SiC JFETs, have been shown to be inherently radiation hard, which should increase the overall converter hardness and reduce the radiation shielding requirements.\r\n\r\nThe challenge for this technology development is to demonstrate that a DC-DC converter can be developed to operate with power stage semiconductor switch junction temperatures between 200 and 250 degrees centigrade. The DC-DC converter should be suitable for use on large communications spacecraft with converter efficiencies greater than 95 percent, and specific power of 1kW/kg. We are primarily interested in large satellites so the converter modules should be scalable for use in 5 to 30 kW power systems; however, supporting smaller platforms (	Investigate advancements required to achieve high-temperature, high-efficiency and low-specific-mass DC-DC converters for spacecraft.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1kw/kg':234B,431B,628B,825B '200':204B,401B,598B,795B '250':206B,403B,600B,797B '30':254B,451B,648B,845B '5':252B,449B,646B,843B '80':115B,123B,312B,320B,509B,517B,706B,714B '90':126B,323B,520B,717B '95':228B,425B,622B,819B 'advanc':128B,325B,522B,719B 'allow':137B,334B,531B,728B 'also':86B,283B,480B,677B 'around':114B,311B,508B,705B 'array':97B,294B,491B,688B 'avail':135B,332B,529B,726B 'batteri':83B,280B,477B,674B 'becom':134B,331B,528B,725B 'bidirect':78B,275B,472B,669B 'centigrad':117B,208B,314B,405B,511B,602B,708B,799B 'challeng':177B,374B,571B,768B 'communic':221B,418B,615B,812B 'convert':14A,30A,46A,62A,76B,90B,109B,168B,190B,213B,224B,244B,273B,287B,306B,365B,387B,410B,421B,441B,470B,484B,503B,562B,584B,607B,618B,638B,667B,681B,700B,759B,781B,804B,815B,835B,868A 'convertor':119B,316B,513B,710B 'dc':12A,13A,28A,29A,44A,45A,60A,61A,74B,75B,188B,189B,211B,212B,271B,272B,385B,386B,408B,409B,468B,469B,582B,583B,605B,606B,665B,666B,779B,780B,802B,803B,866A,867A 'dc-dc':11A,27A,43A,59A,73B,187B,210B,270B,384B,407B,467B,581B,604B,664B,778B,801B,865A 'degre':116B,207B,313B,404B,510B,601B,707B,798B 'deliveri':99B,296B,493B,690B 'demonstr':184B,381B,578B,775B 'develop':181B,193B,378B,390B,575B,587B,772B,784B 'devic':131B,147B,328B,344B,525B,541B,722B,738B 'distribut':69B,266B,463B,660B 'effici':10A,26A,42A,58A,120B,225B,317B,422B,514B,619B,711B,816B 'energi':79B,92B,276B,289B,473B,486B,670B,683B 'gan':150B,347B,544B,741B 'greater':226B,423B,620B,817B 'hard':6A,22A,38A,54A,162B,169B,359B,366B,556B,563B,753B,760B 'hemt':151B,348B,545B,742B 'high':2A,9A,18A,25A,34A,41A,50A,57A,139B,336B,533B,730B,862A 'high-effici':8A,24A,40A,56A 'high-temperatur':1A,17A,33A,49A,138B,335B,532B,729B 'howev':258B,455B,652B,849B 'increas':165B,362B,559B,756B 'inher':160B,357B,554B,751B 'interest':238B,435B,632B,829B 'jfet':154B,351B,548B,745B 'junction':201B,398B,595B,792B 'kw':255B,452B,649B,846B 'larg':220B,240B,417B,437B,614B,634B,811B,831B 'load':103B,300B,497B,694B 'loss':145B,342B,539B,736B 'manag':67B,264B,461B,658B 'modul':245B,442B,639B,836B 'oper':111B,141B,195B,308B,338B,392B,505B,535B,589B,702B,732B,786B 'overal':167B,364B,561B,758B 'percent':124B,127B,229B,321B,324B,426B,518B,521B,623B,715B,718B,820B 'platform':261B,458B,655B,852B,854A,856A,858A,860A 'pmad':70B,267B,464B,661B 'power':66B,197B,232B,256B,263B,394B,429B,453B,460B,591B,626B,650B,657B,788B,823B,847B,864A 'primarili':237B,434B,631B,828B 'produc':93B,290B,487B,684B 'radiat':5A,21A,37A,53A,161B,173B,358B,370B,555B,567B,752B,764B 'radiation-hard':4A,20A,36A,52A 'rang':121B,318B,515B,712B 'reduc':143B,171B,340B,368B,537B,565B,734B,762B 'requir':175B,372B,569B,766B 'satellit':241B,438B,635B,832B 'scalabl':248B,445B,642B,839B 'semiconductor':199B,396B,593B,790B 'shield':174B,371B,568B,765B 'shown':157B,354B,551B,748B 'sic':153B,350B,547B,744B 'smaller':260B,457B,654B,851B 'solar':96B,293B,490B,687B 'space':16A,32A,48A,64A,853A,855A,857A,859A 'spacecraft':65B,106B,222B,262B,303B,419B,459B,500B,616B,656B,697B,813B,861A 'specif':231B,428B,625B,822B 'stage':198B,395B,592B,789B 'suitabl':216B,413B,610B,807B 'support':259B,456B,653B,850B 'switch':130B,144B,200B,327B,341B,397B,524B,538B,594B,721B,735B,791B 'system':71B,257B,268B,454B,465B,651B,662B,848B 'technolog':129B,180B,326B,377B,523B,574B,720B,771B 'temperatur':3A,19A,35A,51A,113B,140B,202B,310B,337B,399B,507B,534B,596B,704B,731B,793B,863A 'tradit':110B,307B,504B,701B 'transfer':80B,277B,474B,671B 'use':72B,87B,218B,250B,269B,284B,415B,447B,466B,481B,612B,644B,663B,678B,809B,841B 'various':102B,299B,496B,693B	AirForce
71	AF151-167	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46455	Prognostic Scheduling	2	The Air Force's Air Logistics Complexes (ALC) are tasked with the responsibility of maintaining the Air Forces fleet. Currently, master planners, using a variety of tools, develop the maintenance plans based on the incoming air platform, work requirements, priority, and availability of resources to develop the maintenance schedule [1]. The master scheduler relies on experience and foreknowledge to develop the plan. However, these static plans can be interrupted by unscheduled work and delays. Furthermore, with the large number of aircraft coming through the ALC, maintaining knowledge on the individual aircraft and properly applying that knowledge is extremely time consuming and difficult. This method does not include any prognostic capability into the scheduling that may assist in reducing the amount of re-planning necessary. Currently, there is no means to assist the scheduler in dynamically re-planning that also includes the aircraft detail.\r\n\r\nThe current method relies heavily on human-in-the-loop to perform scheduling so that when an unplanned event occurs it becomes a labor intensive operation to analyze and re-plan the schedule leading to delays. A new paradigm is needed to move the current re-planning effort from a static level process to a dynamic level process that incorporates aircraft prognostics [2]. The new human-on-the-loop process becomes executive monitoring to verify the updated schedules are easible and can be adjusted as needed.\r\n\r\nThe new paradigm will require the incorporation of powerful mathematical and algorithmic tools. Data mining and fusion are needed to identify the critical information needed to make intelligent decisions. Information reasoning will be needed to predict future bottlenecks and dynamically react to them. The master scheduler will benefit from being able to maximize depot throughput while maintaining work requirements in a dynamic environment.	Develop prognostic capabilities for autonomous maintenance re-planning.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':65B,364B,663B,962B,1261B,1560B,1859B '2':226B,525B,824B,1123B,1422B,1721B,2020B 'abl':301B,600B,899B,1198B,1497B,1796B,2095B 'adjust':248B,547B,846B,1145B,1444B,1743B,2042B 'air':16B,19B,31B,51B,315B,318B,330B,350B,614B,617B,629B,649B,913B,916B,928B,948B,1212B,1215B,1227B,1247B,1511B,1514B,1526B,1546B,1810B,1813B,1825B,1845B 'aircraft':96B,106B,159B,224B,395B,405B,458B,523B,694B,704B,757B,822B,993B,1003B,1056B,1121B,1292B,1302B,1355B,1420B,1591B,1601B,1654B,1719B,1890B,1900B,1953B,2018B 'alc':22B,100B,321B,399B,620B,698B,919B,997B,1218B,1296B,1517B,1595B,1816B,1894B 'algorithm':262B,561B,860B,1159B,1458B,1757B,2056B 'also':156B,455B,754B,1053B,1352B,1651B,1950B 'amount':135B,434B,733B,1032B,1331B,1630B,1929B 'analyz':189B,488B,787B,1086B,1385B,1684B,1983B 'appli':109B,408B,707B,1006B,1305B,1604B,1903B 'assist':131B,147B,430B,446B,729B,745B,1028B,1044B,1327B,1343B,1626B,1642B,1925B,1941B 'avail':57B,356B,655B,954B,1253B,1552B,1851B 'base':47B,346B,645B,944B,1243B,1542B,1841B 'becom':183B,235B,482B,534B,781B,833B,1080B,1132B,1379B,1431B,1678B,1730B,1977B,2029B 'benefit':298B,597B,896B,1195B,1494B,1793B,2092B 'bottleneck':288B,587B,886B,1185B,1484B,1783B,2082B 'capabl':125B,424B,723B,1022B,1321B,1620B,1919B 'come':97B,396B,695B,994B,1293B,1592B,1891B 'complex':21B,320B,619B,918B,1217B,1516B,1815B 'consum':115B,414B,713B,1012B,1311B,1610B,1909B 'critic':273B,572B,871B,1170B,1469B,1768B,2067B 'current':35B,141B,162B,207B,334B,440B,461B,506B,633B,739B,760B,805B,932B,1038B,1059B,1104B,1231B,1337B,1358B,1403B,1530B,1636B,1657B,1702B,1829B,1935B,1956B,2001B 'data':264B,563B,862B,1161B,1460B,1759B,2058B,2115A,2127A 'decis':279B,578B,877B,1176B,1475B,1774B,2073B 'delay':89B,198B,388B,497B,687B,796B,986B,1095B,1285B,1394B,1584B,1693B,1883B,1992B 'depot':304B,603B,902B,1201B,1500B,1799B,2098B 'detail':160B,459B,758B,1057B,1356B,1655B,1954B 'develop':43B,61B,75B,342B,360B,374B,641B,659B,673B,940B,958B,972B,1239B,1257B,1271B,1538B,1556B,1570B,1837B,1855B,1869B 'difficult':117B,416B,715B,1014B,1313B,1612B,1911B 'dynam':151B,219B,290B,312B,450B,518B,589B,611B,749B,817B,888B,910B,1048B,1116B,1187B,1209B,1347B,1415B,1486B,1508B,1646B,1714B,1785B,1807B,1945B,2013B,2084B,2106B,2117A 'easibl':244B,543B,842B,1141B,1440B,1739B,2038B 'effort':211B,510B,809B,1108B,1407B,1706B,2005B 'environ':313B,612B,911B,1210B,1509B,1808B,2107B 'event':180B,479B,778B,1077B,1376B,1675B,1974B 'execut':236B,535B,834B,1133B,1432B,1731B,2030B 'experi':71B,370B,669B,968B,1267B,1566B,1865B 'extrem':113B,412B,711B,1010B,1309B,1608B,1907B 'fleet':34B,333B,632B,931B,1230B,1529B,1828B 'forc':17B,32B,316B,331B,615B,630B,914B,929B,1213B,1228B,1512B,1527B,1811B,1826B 'foreknowledg':73B,372B,671B,970B,1269B,1568B,1867B 'furthermor':90B,389B,688B,987B,1286B,1585B,1884B 'fusion':267B,566B,865B,1164B,1463B,1762B,2061B,2128A 'futur':287B,586B,885B,1184B,1483B,1782B,2081B 'heavili':165B,464B,763B,1062B,1361B,1660B,1959B 'howev':78B,377B,676B,975B,1274B,1573B,1872B 'human':168B,230B,467B,529B,766B,828B,1065B,1127B,1364B,1426B,1663B,1725B,1962B,2024B,2123A 'human-in-the-loop':167B,466B,765B,1064B,1363B,1662B,1961B 'human-on-the-loop':229B,528B,827B,1126B,1425B,1724B,2023B,2122A 'identifi':271B,570B,869B,1168B,1467B,1766B,2065B 'includ':122B,157B,421B,456B,720B,755B,1019B,1054B,1318B,1353B,1617B,1652B,1916B,1951B 'incom':50B,349B,648B,947B,1246B,1545B,1844B 'incorpor':223B,257B,522B,556B,821B,855B,1120B,1154B,1419B,1453B,1718B,1752B,2017B,2051B 'individu':105B,404B,703B,1002B,1301B,1600B,1899B 'inform':274B,280B,573B,579B,872B,878B,1171B,1177B,1470B,1476B,1769B,1775B,2068B,2074B,2129A 'intellig':278B,577B,876B,1175B,1474B,1773B,2072B 'intens':186B,485B,784B,1083B,1382B,1681B,1980B 'interrupt':84B,383B,682B,981B,1280B,1579B,1878B 'knowledg':102B,111B,401B,410B,700B,709B,999B,1008B,1298B,1307B,1597B,1606B,1896B,1905B 'labor':185B,484B,783B,1082B,1381B,1680B,1979B 'larg':93B,392B,691B,990B,1289B,1588B,1887B 'lead':196B,495B,794B,1093B,1392B,1691B,1990B 'level':215B,220B,514B,519B,813B,818B,1112B,1117B,1411B,1416B,1710B,1715B,2009B,2014B 'logist':20B,319B,618B,917B,1216B,1515B,1814B 'loop':171B,233B,470B,532B,769B,831B,1068B,1130B,1367B,1429B,1666B,1728B,1965B,2027B,2126A 'maintain':29B,101B,307B,328B,400B,606B,627B,699B,905B,926B,998B,1204B,1225B,1297B,1503B,1524B,1596B,1802B,1823B,1895B,2101B 'mainten':45B,63B,344B,362B,643B,661B,942B,960B,1241B,1259B,1540B,1558B,1839B,1857B 'make':277B,576B,875B,1174B,1473B,1772B,2071B 'master':36B,67B,295B,335B,366B,594B,634B,665B,893B,933B,964B,1192B,1232B,1263B,1491B,1531B,1562B,1790B,1830B,1861B,2089B 'materials/processes':2108A,2109A,2110A,2111A,2112A,2113A,2114A 'mathemat':260B,559B,858B,1157B,1456B,1755B,2054B 'maxim':303B,602B,901B,1200B,1499B,1798B,2097B 'may':130B,429B,728B,1027B,1326B,1625B,1924B 'mean':145B,444B,743B,1042B,1341B,1640B,1939B 'method':119B,163B,418B,462B,717B,761B,1016B,1060B,1315B,1359B,1614B,1658B,1913B,1957B 'mine':265B,564B,863B,1162B,1461B,1760B,2059B,2116A 'monitor':237B,536B,835B,1134B,1433B,1732B,2031B 'move':205B,504B,803B,1102B,1401B,1700B,1999B 'necessari':140B,439B,738B,1037B,1336B,1635B,1934B 'need':203B,250B,269B,275B,284B,502B,549B,568B,574B,583B,801B,848B,867B,873B,882B,1100B,1147B,1166B,1172B,1181B,1399B,1446B,1465B,1471B,1480B,1698B,1745B,1764B,1770B,1779B,1997B,2044B,2063B,2069B,2078B 'new':200B,228B,252B,499B,527B,551B,798B,826B,850B,1097B,1125B,1149B,1396B,1424B,1448B,1695B,1723B,1747B,1994B,2022B,2046B 'number':94B,393B,692B,991B,1290B,1589B,1888B 'occur':181B,480B,779B,1078B,1377B,1676B,1975B 'oper':187B,486B,785B,1084B,1383B,1682B,1981B 'paradigm':201B,253B,500B,552B,799B,851B,1098B,1150B,1397B,1449B,1696B,1748B,1995B,2047B 'perform':173B,472B,771B,1070B,1369B,1668B,1967B 'plan':46B,77B,81B,139B,154B,193B,210B,345B,376B,380B,438B,453B,492B,509B,644B,675B,679B,737B,752B,791B,808B,943B,974B,978B,1036B,1051B,1090B,1107B,1242B,1273B,1277B,1335B,1350B,1389B,1406B,1541B,1572B,1576B,1634B,1649B,1688B,1705B,1840B,1871B,1875B,1933B,1948B,1987B,2004B,2120A 'planner':37B,336B,635B,934B,1233B,1532B,1831B 'platform':52B,351B,650B,949B,1248B,1547B,1846B 'power':259B,558B,857B,1156B,1455B,1754B,2053B 'predict':286B,585B,884B,1183B,1482B,1781B,2080B 'prioriti':55B,354B,653B,952B,1251B,1550B,1849B 'process':216B,221B,234B,515B,520B,533B,814B,819B,832B,1113B,1118B,1131B,1412B,1417B,1430B,1711B,1716B,1729B,2010B,2015B,2028B 'prognost':1A,3A,5A,7A,9A,11A,13A,124B,225B,423B,524B,722B,823B,1021B,1122B,1320B,1421B,1619B,1720B,1918B,2019B,2121A 'proper':108B,407B,706B,1005B,1304B,1603B,1902B 're':138B,153B,192B,209B,437B,452B,491B,508B,736B,751B,790B,807B,1035B,1050B,1089B,1106B,1334B,1349B,1388B,1405B,1633B,1648B,1687B,1704B,1932B,1947B,1986B,2003B,2119A 're-plan':137B,152B,191B,208B,436B,451B,490B,507B,735B,750B,789B,806B,1034B,1049B,1088B,1105B,1333B,1348B,1387B,1404B,1632B,1647B,1686B,1703B,1931B,1946B,1985B,2002B,2118A 'react':291B,590B,889B,1188B,1487B,1786B,2085B 'reason':281B,580B,879B,1178B,1477B,1776B,2075B,2130A 'reduc':133B,432B,731B,1030B,1329B,1628B,1927B 'reli':69B,164B,368B,463B,667B,762B,966B,1061B,1265B,1360B,1564B,1659B,1863B,1958B 'requir':54B,255B,309B,353B,554B,608B,652B,853B,907B,951B,1152B,1206B,1250B,1451B,1505B,1549B,1750B,1804B,1848B,2049B,2103B 'resourc':59B,358B,657B,956B,1255B,1554B,1853B 'respons':27B,326B,625B,924B,1223B,1522B,1821B 'schedul':2A,4A,6A,8A,10A,12A,14A,64B,68B,128B,149B,174B,195B,242B,296B,363B,367B,427B,448B,473B,494B,541B,595B,662B,666B,726B,747B,772B,793B,840B,894B,961B,965B,1025B,1046B,1071B,1092B,1139B,1193B,1260B,1264B,1324B,1345B,1370B,1391B,1438B,1492B,1559B,1563B,1623B,1644B,1669B,1690B,1737B,1791B,1858B,1862B,1922B,1943B,1968B,1989B,2036B,2090B 'static':80B,214B,379B,513B,678B,812B,977B,1111B,1276B,1410B,1575B,1709B,1874B,2008B 'task':24B,323B,622B,921B,1220B,1519B,1818B 'throughput':305B,604B,903B,1202B,1501B,1800B,2099B 'time':114B,413B,712B,1011B,1310B,1609B,1908B 'tool':42B,263B,341B,562B,640B,861B,939B,1160B,1238B,1459B,1537B,1758B,1836B,2057B 'unplan':179B,478B,777B,1076B,1375B,1674B,1973B 'unschedul':86B,385B,684B,983B,1282B,1581B,1880B 'updat':241B,540B,839B,1138B,1437B,1736B,2035B 'use':38B,337B,636B,935B,1234B,1533B,1832B 'varieti':40B,339B,638B,937B,1236B,1535B,1834B 'verifi':239B,538B,837B,1136B,1435B,1734B,2033B 'work':53B,87B,308B,352B,386B,607B,651B,685B,906B,950B,984B,1205B,1249B,1283B,1504B,1548B,1582B,1803B,1847B,1881B,2102B	AirForce
76	AF151-120	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46416	Linking Coupon to Component Behavior of CMCs in Relevant Service Environment	2	Much of the innovation in gas turbine engine technology is driven by advanced materials technology. Ceramic matrix composites (CMC) are a promising high temperature material for aerospace applications. Recently, several successful demonstrations of CMC hot section turbine engine components have been executed. There are several benefits in using CMCs over traditional Ni-based super alloys which include improved durability at elevated temperatures, increased thrust-to-weight ratio and improved specific fuel consumption. While the need for CMCs is apparent, the current transition path for materials is based on metal alloys and does not account for the unique aspects of CMCs. Innovative testing methodologies and physics based computational tools that capture relevant environmental factors while accounting for the unique aspects of CMCs are needed to fully exploit their use for hot section turbine engine components. \r\n\r\nMost of the current research and available property data on CMCs are based on flat panel coupon testing. However, CMC components in advanced turbine engine applications are highly complex. Components such as turbine blades and vanes require ply drops, curved plies, and/or matrix rich regions which have not been studied extensively. Additionally, the complexity of the CMCs architecture could cause other manufacturing defects such as porosity and ply wrinkles that can affect component durability. These components also face combined mechanical loading and thermal gradients resulting in complex stress states that are not captured in most standard tests.  Combined environmental and mechanical damage will have a significant impact on CMC component life. \r\n\r\nThe evaluation of CMC turbine engine components in relevant service environments requires the application of extreme environments (high pressure, hot gases and moisture) and complex loads (bi-axial, vibratory and thermal gradients). Despite using established testing methods designed for metals throughout the components building block development (coupons, sub-elements, sub-scale components, etc.), unanticipated failures still occur when the hardware is rolled up into a complete full scale engine demonstrator test in part due to the complexity of the loading and service environment. Preexisting service damage also impacts the service life CMC components.\r\n\r\nConsequently, new and innovative methods are needed to verify the anticipated component performance and generate confidence in new designs and technologies as early in the development process as possible, while providing a reduction in cost and test time prior to their introduction into full-scale engines.  Currently, empirical curves are generated from design allowables of flat panels to life CMC components. The current approach requires a prolonged development time and does not capture the complexity of CMC components. The preferred method will combine experimental and analytical aspects with the goal of developing lifing tools to reduce the amount of testing needed and capture the complexity of CMCs. The proposed method needs to predict the service life of CMC engine components within a determined fidelity of prediction. It also should focus on first order effects that limit service life. The proposed method can also provide insight into potential issues in the full-scale engine. Approaches will directly address and support DoDs next generation of propulsion technology initiatives, such as ADVENT and AETD within the VAATE program.	Develop an innovative method to link the durability of ceramic matrix composite test coupons to components in relevant service environments.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'account':173B,194B,695B,716B,1217B,1238B,1739B,1760B,2261B,2282B,2783B,2804B,3305B,3326B 'addit':265B,787B,1309B,1831B,2353B,2875B,3397B 'address':580B,1102B,1624B,2146B,2668B,3190B,3712B 'advanc':90B,236B,612B,758B,1134B,1280B,1656B,1802B,2178B,2324B,2700B,2846B,3222B,3368B 'advent':593B,1115B,1637B,2159B,2681B,3203B,3725B 'aerospac':104B,626B,1148B,1670B,2192B,2714B,3236B 'aetd':595B,1117B,1639B,2161B,2683B,3205B,3727B 'affect':285B,807B,1329B,1851B,2373B,2895B,3417B 'allow':476B,998B,1520B,2042B,2564B,3086B,3608B 'alloy':133B,169B,655B,691B,1177B,1213B,1699B,1735B,2221B,2257B,2743B,2779B,3265B,3301B 'also':290B,415B,550B,565B,812B,937B,1072B,1087B,1334B,1459B,1594B,1609B,1856B,1981B,2116B,2131B,2378B,2503B,2638B,2653B,2900B,3025B,3160B,3175B,3422B,3547B,3682B,3697B 'amount':520B,1042B,1564B,2086B,2608B,3130B,3652B 'analyt':508B,1030B,1552B,2074B,2596B,3118B,3640B 'and/or':255B,777B,1299B,1821B,2343B,2865B,3387B 'anticip':432B,954B,1476B,1998B,2520B,3042B,3564B 'appar':158B,680B,1202B,1724B,2246B,2768B,3290B 'applic':105B,239B,338B,627B,761B,860B,1149B,1283B,1382B,1671B,1805B,1904B,2193B,2327B,2426B,2715B,2849B,2948B,3237B,3371B,3470B 'approach':486B,577B,1008B,1099B,1530B,1621B,2052B,2143B,2574B,2665B,3096B,3187B,3618B,3709B 'architectur':271B,793B,1315B,1837B,2359B,2881B,3403B 'aspect':177B,198B,509B,699B,720B,1031B,1221B,1242B,1553B,1743B,1764B,2075B,2265B,2286B,2597B,2787B,2808B,3119B,3309B,3330B,3641B 'avail':220B,742B,1264B,1786B,2308B,2830B,3352B 'axial':353B,875B,1397B,1919B,2441B,2963B,3485B 'base':131B,166B,185B,226B,653B,688B,707B,748B,1175B,1210B,1229B,1270B,1697B,1732B,1751B,1792B,2219B,2254B,2273B,2314B,2741B,2776B,2795B,2836B,3263B,3298B,3317B,3358B 'behavior':5A,16A,27A,38A,49A,60A,71A,3744A 'benefit':123B,645B,1167B,1689B,2211B,2733B,3255B 'bi':352B,874B,1396B,1918B,2440B,2962B,3484B 'bi-axi':351B,873B,1395B,1917B,2439B,2961B,3483B 'blade':247B,769B,1291B,1813B,2335B,2857B,3379B 'block':371B,893B,1415B,1937B,2459B,2981B,3503B 'build':370B,892B,1414B,1936B,2458B,2980B,3502B 'burner':3756A 'captur':189B,306B,495B,525B,711B,828B,1017B,1047B,1233B,1350B,1539B,1569B,1755B,1872B,2061B,2091B,2277B,2394B,2583B,2613B,2799B,2916B,3105B,3135B,3321B,3438B,3627B,3657B 'caus':273B,795B,1317B,1839B,2361B,2883B,3405B 'ceram':93B,615B,1137B,1659B,2181B,2703B,3225B 'cmc':96B,111B,233B,322B,328B,420B,482B,499B,540B,618B,633B,755B,844B,850B,942B,1004B,1021B,1062B,1140B,1155B,1277B,1366B,1372B,1464B,1526B,1543B,1584B,1662B,1677B,1799B,1888B,1894B,1986B,2048B,2065B,2106B,2184B,2199B,2321B,2410B,2416B,2508B,2570B,2587B,2628B,2706B,2721B,2843B,2932B,2938B,3030B,3092B,3109B,3150B,3228B,3243B,3365B,3454B,3460B,3552B,3614B,3631B,3672B,3742A 'cmcs':7A,18A,29A,40A,51A,62A,73A,126B,156B,179B,200B,224B,270B,529B,648B,678B,701B,722B,746B,792B,1051B,1170B,1200B,1223B,1244B,1268B,1314B,1573B,1692B,1722B,1745B,1766B,1790B,1836B,2095B,2214B,2244B,2267B,2288B,2312B,2358B,2617B,2736B,2766B,2789B,2810B,2834B,2880B,3139B,3258B,3288B,3311B,3332B,3356B,3402B,3661B 'combin':292B,311B,505B,814B,833B,1027B,1336B,1355B,1549B,1858B,1877B,2071B,2380B,2399B,2593B,2902B,2921B,3115B,3424B,3443B,3637B 'complet':394B,916B,1438B,1960B,2482B,3004B,3526B 'complex':242B,267B,300B,349B,405B,497B,527B,764B,789B,822B,871B,927B,1019B,1049B,1286B,1311B,1344B,1393B,1449B,1541B,1571B,1808B,1833B,1866B,1915B,1971B,2063B,2093B,2330B,2355B,2388B,2437B,2493B,2585B,2615B,2852B,2877B,2910B,2959B,3015B,3107B,3137B,3374B,3399B,3432B,3481B,3537B,3629B,3659B 'compon':4A,15A,26A,37A,48A,59A,70A,116B,213B,234B,243B,286B,289B,323B,331B,368B,380B,421B,433B,483B,500B,542B,638B,735B,756B,765B,808B,811B,845B,853B,890B,902B,943B,955B,1005B,1022B,1064B,1160B,1257B,1278B,1287B,1330B,1333B,1367B,1375B,1412B,1424B,1465B,1477B,1527B,1544B,1586B,1682B,1779B,1800B,1809B,1852B,1855B,1889B,1897B,1934B,1946B,1987B,1999B,2049B,2066B,2108B,2204B,2301B,2322B,2331B,2374B,2377B,2411B,2419B,2456B,2468B,2509B,2521B,2571B,2588B,2630B,2726B,2823B,2844B,2853B,2896B,2899B,2933B,2941B,2978B,2990B,3031B,3043B,3093B,3110B,3152B,3248B,3345B,3366B,3375B,3418B,3421B,3455B,3463B,3500B,3512B,3553B,3565B,3615B,3632B,3674B,3752A 'composit':95B,617B,1139B,1661B,2183B,2705B,3227B 'comput':186B,708B,1230B,1752B,2274B,2796B,3318B 'confid':437B,959B,1481B,2003B,2525B,3047B,3569B 'consequ':422B,944B,1466B,1988B,2510B,3032B,3554B 'consumpt':151B,673B,1195B,1717B,2239B,2761B,3283B 'cost':456B,978B,1500B,2022B,2544B,3066B,3588B 'could':272B,794B,1316B,1838B,2360B,2882B,3404B 'coupon':2A,13A,24A,35A,46A,57A,68A,230B,373B,752B,895B,1274B,1417B,1796B,1939B,2318B,2461B,2840B,2983B,3362B,3505B 'current':160B,217B,469B,485B,682B,739B,991B,1007B,1204B,1261B,1513B,1529B,1726B,1783B,2035B,2051B,2248B,2305B,2557B,2573B,2770B,2827B,3079B,3095B,3292B,3349B,3601B,3617B 'curv':253B,471B,775B,993B,1297B,1515B,1819B,2037B,2341B,2559B,2863B,3081B,3385B,3603B 'damag':315B,414B,837B,936B,1359B,1458B,1881B,1980B,2403B,2502B,2925B,3024B,3447B,3546B,3754A 'data':222B,744B,1266B,1788B,2310B,2832B,3354B 'defect':276B,798B,1320B,1842B,2364B,2886B,3408B 'demonstr':109B,398B,631B,920B,1153B,1442B,1675B,1964B,2197B,2486B,2719B,3008B,3241B,3530B 'design':363B,440B,475B,885B,962B,997B,1407B,1484B,1519B,1929B,2006B,2041B,2451B,2528B,2563B,2973B,3050B,3085B,3495B,3572B,3607B 'despit':358B,880B,1402B,1924B,2446B,2968B,3490B 'determin':545B,1067B,1589B,2111B,2633B,3155B,3677B 'develop':372B,447B,490B,514B,894B,969B,1012B,1036B,1416B,1491B,1534B,1558B,1938B,2013B,2056B,2080B,2460B,2535B,2578B,2602B,2982B,3057B,3100B,3124B,3504B,3579B,3622B,3646B 'direct':579B,1101B,1623B,2145B,2667B,3189B,3711B 'dod':583B,1105B,1627B,2149B,2671B,3193B,3715B 'driven':88B,610B,1132B,1654B,2176B,2698B,3220B 'drop':252B,774B,1296B,1818B,2340B,2862B,3384B 'due':402B,924B,1446B,1968B,2490B,3012B,3534B 'durabl':137B,287B,659B,809B,1181B,1331B,1703B,1853B,2225B,2375B,2747B,2897B,3269B,3419B,3753A 'earli':444B,966B,1488B,2010B,2532B,3054B,3576B 'effect':556B,1078B,1600B,2122B,2644B,3166B,3688B 'element':376B,898B,1420B,1942B,2464B,2986B,3508B 'elev':139B,661B,1183B,1705B,2227B,2749B,3271B 'empir':470B,992B,1514B,2036B,2558B,3080B,3602B 'engin':85B,115B,212B,238B,330B,397B,468B,541B,576B,607B,637B,734B,760B,852B,919B,990B,1063B,1098B,1129B,1159B,1256B,1282B,1374B,1441B,1512B,1585B,1620B,1651B,1681B,1778B,1804B,1896B,1963B,2034B,2107B,2142B,2173B,2203B,2300B,2326B,2418B,2485B,2556B,2629B,2664B,2695B,2725B,2822B,2848B,2940B,3007B,3078B,3151B,3186B,3217B,3247B,3344B,3370B,3462B,3529B,3600B,3673B,3708B 'environ':11A,22A,33A,44A,55A,66A,77A,335B,341B,411B,857B,863B,933B,1379B,1385B,1455B,1901B,1907B,1977B,2423B,2429B,2499B,2945B,2951B,3021B,3467B,3473B,3543B 'environment':191B,312B,713B,834B,1235B,1356B,1757B,1878B,2279B,2400B,2801B,2922B,3323B,3444B 'establish':360B,882B,1404B,1926B,2448B,2970B,3492B 'etc':381B,903B,1425B,1947B,2469B,2991B,3513B 'evalu':326B,848B,1370B,1892B,2414B,2936B,3458B 'execut':119B,641B,1163B,1685B,2207B,2729B,3251B 'experiment':506B,1028B,1550B,2072B,2594B,3116B,3638B 'exploit':205B,727B,1249B,1771B,2293B,2815B,3337B 'extens':264B,786B,1308B,1830B,2352B,2874B,3396B 'extrem':340B,862B,1384B,1906B,2428B,2950B,3472B 'face':291B,813B,1335B,1857B,2379B,2901B,3423B 'factor':192B,714B,1236B,1758B,2280B,2802B,3324B 'failur':383B,905B,1427B,1949B,2471B,2993B,3515B 'fidel':546B,1068B,1590B,2112B,2634B,3156B,3678B 'first':554B,1076B,1598B,2120B,2642B,3164B,3686B 'flat':228B,478B,750B,1000B,1272B,1522B,1794B,2044B,2316B,2566B,2838B,3088B,3360B,3610B 'focus':552B,1074B,1596B,2118B,2640B,3162B,3684B 'fuel':150B,672B,1194B,1716B,2238B,2760B,3282B 'full':395B,466B,574B,917B,988B,1096B,1439B,1510B,1618B,1961B,2032B,2140B,2483B,2554B,2662B,3005B,3076B,3184B,3527B,3598B,3706B 'full-scal':465B,573B,987B,1095B,1509B,1617B,2031B,2139B,2553B,2661B,3075B,3183B,3597B,3705B 'fulli':204B,726B,1248B,1770B,2292B,2814B,3336B 'gas':83B,605B,1127B,1649B,2171B,2693B,3215B 'gase':345B,867B,1389B,1911B,2433B,2955B,3477B 'generat':436B,473B,586B,958B,995B,1108B,1480B,1517B,1630B,2002B,2039B,2152B,2524B,2561B,2674B,3046B,3083B,3196B,3568B,3605B,3718B 'goal':512B,1034B,1556B,2078B,2600B,3122B,3644B 'gradient':297B,357B,819B,879B,1341B,1401B,1863B,1923B,2385B,2445B,2907B,2967B,3429B,3489B 'hardwar':388B,910B,1432B,1954B,2476B,2998B,3520B 'high':100B,241B,342B,622B,763B,864B,1144B,1285B,1386B,1666B,1807B,1908B,2188B,2329B,2430B,2710B,2851B,2952B,3232B,3373B,3474B,3739A 'hot':112B,209B,344B,634B,731B,866B,1156B,1253B,1388B,1678B,1775B,1910B,2200B,2297B,2432B,2722B,2819B,2954B,3244B,3341B,3476B 'howev':232B,754B,1276B,1798B,2320B,2842B,3364B 'impact':320B,416B,842B,938B,1364B,1460B,1886B,1982B,2408B,2504B,2930B,3026B,3452B,3548B 'improv':136B,148B,658B,670B,1180B,1192B,1702B,1714B,2224B,2236B,2746B,2758B,3268B,3280B 'includ':135B,657B,1179B,1701B,2223B,2745B,3267B 'increas':141B,663B,1185B,1707B,2229B,2751B,3273B 'initi':590B,1112B,1634B,2156B,2678B,3200B,3722B 'innov':81B,180B,425B,603B,702B,947B,1125B,1224B,1469B,1647B,1746B,1991B,2169B,2268B,2513B,2691B,2790B,3035B,3213B,3312B,3557B 'insight':567B,1089B,1611B,2133B,2655B,3177B,3699B 'introduct':463B,985B,1507B,2029B,2551B,3073B,3595B 'issu':570B,1092B,1614B,2136B,2658B,3180B,3702B 'life':324B,419B,481B,515B,538B,560B,846B,941B,1003B,1037B,1060B,1082B,1368B,1463B,1525B,1559B,1582B,1604B,1890B,1985B,2047B,2081B,2104B,2126B,2412B,2507B,2569B,2603B,2626B,2648B,2934B,3029B,3091B,3125B,3148B,3170B,3456B,3551B,3613B,3647B,3670B,3692B,3746A 'limit':558B,1080B,1602B,2124B,2646B,3168B,3690B 'link':1A,12A,23A,34A,45A,56A,67A 'load':294B,350B,408B,816B,872B,930B,1338B,1394B,1452B,1860B,1916B,1974B,2382B,2438B,2496B,2904B,2960B,3018B,3426B,3482B,3540B 'manufactur':275B,797B,1319B,1841B,2363B,2885B,3407B 'materi':91B,102B,164B,613B,624B,686B,1135B,1146B,1208B,1657B,1668B,1730B,2179B,2190B,2252B,2701B,2712B,2774B,3223B,3234B,3296B 'materials/processes':3732A,3733A,3734A,3735A,3736A,3737A,3738A 'matrix':94B,256B,616B,778B,1138B,1300B,1660B,1822B,2182B,2344B,2704B,2866B,3226B,3388B 'mechan':293B,314B,815B,836B,1337B,1358B,1859B,1880B,2381B,2402B,2903B,2924B,3425B,3446B 'metal':168B,365B,690B,887B,1212B,1409B,1734B,1931B,2256B,2453B,2778B,2975B,3300B,3497B 'method':362B,426B,503B,532B,563B,884B,948B,1025B,1054B,1085B,1406B,1470B,1547B,1576B,1607B,1928B,1992B,2069B,2098B,2129B,2450B,2514B,2591B,2620B,2651B,2972B,3036B,3113B,3142B,3173B,3494B,3558B,3635B,3664B,3695B 'methodolog':182B,704B,1226B,1748B,2270B,2792B,3314B 'model':3749A,3755A 'moistur':347B,869B,1391B,1913B,2435B,2957B,3479B 'much':78B,600B,1122B,1644B,2166B,2688B,3210B 'need':154B,202B,428B,523B,533B,676B,724B,950B,1045B,1055B,1198B,1246B,1472B,1567B,1577B,1720B,1768B,1994B,2089B,2099B,2242B,2290B,2516B,2611B,2621B,2764B,2812B,3038B,3133B,3143B,3286B,3334B,3560B,3655B,3665B 'new':423B,439B,945B,961B,1467B,1483B,1989B,2005B,2511B,2527B,3033B,3049B,3555B,3571B 'next':585B,1107B,1629B,2151B,2673B,3195B,3717B 'ni':130B,652B,1174B,1696B,2218B,2740B,3262B 'ni-bas':129B,651B,1173B,1695B,2217B,2739B,3261B 'occur':385B,907B,1429B,1951B,2473B,2995B,3517B 'order':555B,1077B,1599B,2121B,2643B,3165B,3687B 'oxid':3748A 'panel':229B,479B,751B,1001B,1273B,1523B,1795B,2045B,2317B,2567B,2839B,3089B,3361B,3611B 'part':401B,923B,1445B,1967B,2489B,3011B,3533B 'path':162B,684B,1206B,1728B,2250B,2772B,3294B 'perform':434B,956B,1478B,2000B,2522B,3044B,3566B 'physic':184B,706B,1228B,1750B,2272B,2794B,3316B 'pli':251B,254B,281B,773B,776B,803B,1295B,1298B,1325B,1817B,1820B,1847B,2339B,2342B,2369B,2861B,2864B,2891B,3383B,3386B,3413B 'poros':279B,801B,1323B,1845B,2367B,2889B,3411B 'possibl':450B,972B,1494B,2016B,2538B,3060B,3582B 'potenti':569B,1091B,1613B,2135B,2657B,3179B,3701B 'predict':535B,548B,1057B,1070B,1579B,1592B,2101B,2114B,2623B,2636B,3145B,3158B,3667B,3680B,3747A 'preexist':412B,934B,1456B,1978B,2500B,3022B,3544B 'prefer':502B,1024B,1546B,2068B,2590B,3112B,3634B 'pressur':343B,865B,1387B,1909B,2431B,2953B,3475B 'prior':460B,982B,1504B,2026B,2548B,3070B,3592B 'process':448B,970B,1492B,2014B,2536B,3058B,3580B 'program':599B,1121B,1643B,2165B,2687B,3209B,3731B 'prolong':489B,1011B,1533B,2055B,2577B,3099B,3621B 'promis':99B,621B,1143B,1665B,2187B,2709B,3231B 'properti':221B,743B,1265B,1787B,2309B,2831B,3353B 'propos':531B,562B,1053B,1084B,1575B,1606B,2097B,2128B,2619B,2650B,3141B,3172B,3663B,3694B 'propuls':588B,1110B,1632B,2154B,2676B,3198B,3720B 'provid':452B,566B,974B,1088B,1496B,1610B,2018B,2132B,2540B,2654B,3062B,3176B,3584B,3698B 'ratio':146B,668B,1190B,1712B,2234B,2756B,3278B 'recent':106B,628B,1150B,1672B,2194B,2716B,3238B 'reduc':518B,1040B,1562B,2084B,2606B,3128B,3650B 'reduct':454B,976B,1498B,2020B,2542B,3064B,3586B 'region':258B,780B,1302B,1824B,2346B,2868B,3390B 'relev':9A,20A,31A,42A,53A,64A,75A,190B,333B,712B,855B,1234B,1377B,1756B,1899B,2278B,2421B,2800B,2943B,3322B,3465B 'requir':250B,336B,487B,772B,858B,1009B,1294B,1380B,1531B,1816B,1902B,2053B,2338B,2424B,2575B,2860B,2946B,3097B,3382B,3468B,3619B 'research':218B,740B,1262B,1784B,2306B,2828B,3350B 'result':298B,820B,1342B,1864B,2386B,2908B,3430B 'rich':257B,779B,1301B,1823B,2345B,2867B,3389B 'rig':3757A 'roll':390B,912B,1434B,1956B,2478B,3000B,3522B 'scale':379B,396B,467B,575B,901B,918B,989B,1097B,1423B,1440B,1511B,1619B,1945B,1962B,2033B,2141B,2467B,2484B,2555B,2663B,2989B,3006B,3077B,3185B,3511B,3528B,3599B,3707B 'section':113B,210B,635B,732B,1157B,1254B,1679B,1776B,2201B,2298B,2723B,2820B,3245B,3342B 'servic':10A,21A,32A,43A,54A,65A,76A,334B,410B,413B,418B,537B,559B,856B,932B,935B,940B,1059B,1081B,1378B,1454B,1457B,1462B,1581B,1603B,1900B,1976B,1979B,1984B,2103B,2125B,2422B,2498B,2501B,2506B,2625B,2647B,2944B,3020B,3023B,3028B,3147B,3169B,3466B,3542B,3545B,3550B,3669B,3691B 'sever':107B,122B,629B,644B,1151B,1166B,1673B,1688B,2195B,2210B,2717B,2732B,3239B,3254B 'signific':319B,841B,1363B,1885B,2407B,2929B,3451B 'specif':149B,671B,1193B,1715B,2237B,2759B,3281B 'standard':309B,831B,1353B,1875B,2397B,2919B,3441B 'state':302B,824B,1346B,1868B,2390B,2912B,3434B 'still':384B,906B,1428B,1950B,2472B,2994B,3516B 'stress':301B,823B,1345B,1867B,2389B,2911B,3433B 'studi':263B,785B,1307B,1829B,2351B,2873B,3395B 'sub':375B,378B,897B,900B,1419B,1422B,1941B,1944B,2463B,2466B,2985B,2988B,3507B,3510B,3751A 'sub-compon':3750A 'sub-el':374B,896B,1418B,1940B,2462B,2984B,3506B 'sub-scal':377B,899B,1421B,1943B,2465B,2987B,3509B 'success':108B,630B,1152B,1674B,2196B,2718B,3240B 'super':132B,654B,1176B,1698B,2220B,2742B,3264B 'support':582B,1104B,1626B,2148B,2670B,3192B,3714B 'technolog':86B,92B,442B,589B,608B,614B,964B,1111B,1130B,1136B,1486B,1633B,1652B,1658B,2008B,2155B,2174B,2180B,2530B,2677B,2696B,2702B,3052B,3199B,3218B,3224B,3574B,3721B 'temperatur':101B,140B,623B,662B,1145B,1184B,1667B,1706B,2189B,2228B,2711B,2750B,3233B,3272B,3740A 'test':181B,231B,310B,361B,399B,458B,522B,703B,753B,832B,883B,921B,980B,1044B,1225B,1275B,1354B,1405B,1443B,1502B,1566B,1747B,1797B,1876B,1927B,1965B,2024B,2088B,2269B,2319B,2398B,2449B,2487B,2546B,2610B,2791B,2841B,2920B,2971B,3009B,3068B,3132B,3313B,3363B,3442B,3493B,3531B,3590B,3654B,3741A,3743A,3758A 'thermal':296B,356B,818B,878B,1340B,1400B,1862B,1922B,2384B,2444B,2906B,2966B,3428B,3488B 'throughout':366B,888B,1410B,1932B,2454B,2976B,3498B 'thrust':143B,665B,1187B,1709B,2231B,2753B,3275B 'thrust-to-weight':142B,664B,1186B,1708B,2230B,2752B,3274B 'time':459B,491B,981B,1013B,1503B,1535B,2025B,2057B,2547B,2579B,3069B,3101B,3591B,3623B 'tool':187B,516B,709B,1038B,1231B,1560B,1753B,2082B,2275B,2604B,2797B,3126B,3319B,3648B 'tradit':128B,650B,1172B,1694B,2216B,2738B,3260B 'transit':161B,683B,1205B,1727B,2249B,2771B,3293B 'turbin':84B,114B,211B,237B,246B,329B,606B,636B,733B,759B,768B,851B,1128B,1158B,1255B,1281B,1290B,1373B,1650B,1680B,1777B,1803B,1812B,1895B,2172B,2202B,2299B,2325B,2334B,2417B,2694B,2724B,2821B,2847B,2856B,2939B,3216B,3246B,3343B,3369B,3378B,3461B 'unanticip':382B,904B,1426B,1948B,2470B,2992B,3514B 'uniqu':176B,197B,698B,719B,1220B,1241B,1742B,1763B,2264B,2285B,2786B,2807B,3308B,3329B 'use':125B,207B,359B,647B,729B,881B,1169B,1251B,1403B,1691B,1773B,1925B,2213B,2295B,2447B,2735B,2817B,2969B,3257B,3339B,3491B 'vaat':598B,1120B,1642B,2164B,2686B,3208B,3730B 'vane':249B,771B,1293B,1815B,2337B,2859B,3381B 'verifi':430B,952B,1474B,1996B,2518B,3040B,3562B 'vibratori':354B,876B,1398B,1920B,2442B,2964B,3486B 'weight':145B,667B,1189B,1711B,2233B,2755B,3277B 'within':543B,596B,1065B,1118B,1587B,1640B,2109B,2162B,2631B,2684B,3153B,3206B,3675B,3728B 'wrinkl':282B,804B,1326B,1848B,2370B,2892B,3414B	AirForce
3	AF151-078	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46383	Ephemeral Security Overlay for GPS	2	Military GPS receivers are unlike any other cryptography-based system in the Department of Defense (DoD).  Nearly every weapon system in DoD uses GPS, the host equipment must be unclassified, and military receivers are exported to over 55 authorized nations.  GPS is a broadcast system, with receivers passively receiving the encrypted signal.  The encryption does not primarily protect classified information, as a communication system does, but provides Transmission Security (TRANSEC) to support military exclusivity  ensuring U.S. and Allied forces have access to the signal with the assurance that an adversary does not.  Furthermore, GPS utilizes black keys  encrypted keys that can be transmitted unclassified over the air.  This adds a requirement that each receiver include a key decryption capability buried within a secure module protected by anti-tamper.\r\n\r\nThese security requirements for GPS place a heavy burden on GPS User Equipment to protect CPI within the receiver, driving up the Size, Weight, Power, and Cost (SWAP-C) of military receivers while exposing the CPI to exploitation should the receivers find themselves in enemy hands.  With most GPS receivers now integrated into systems with tactical or strategic communications capability, and the advent of advanced Information Assurance (IA) techniques for protecting access to classified systems, a new approach is desirable that combines operational concepts, technology, and connectivity to enhance the protection of GPS CPI while reducing the hardware burden on military GPS receivers.\r\n\r\nThis SBIR will develop an ephemeral security overlay for fielded GPS receivers.  The purpose of the ephemeral attribute is to eliminate permanence of the CPI within the GPS receiver  all critical data will exist temporarily and be removed automatically at the end of a session.  Modern techniques to maintain control and allow access by the military receivers to the military signals should be evaluated, including location-based access (receivers purge data outside of an authorized region), biometrics (only authorized users may initialize a receiver), and advanced key distribution and protection concepts.  The availability of a network should be assumed, and should form the foundation for the overlay architecture.  No changes to the GPS satellites, GPS control segment, or GPS cryptography should be considered  instead, this architecture should be an overlay that augments the existing security architecture.	Develop a network-based security overlay for military GPS that provides enhanced security for GPS Critical Program Information (CPI) while relieving GPS devices from burdensome protection measures.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'55':64B,435B,806B,1177B,1548B 'access':107B,228B,312B,328B,478B,599B,683B,699B,849B,970B,1054B,1070B,1220B,1341B,1425B,1441B,1591B,1712B,1796B,1812B 'add':135B,506B,877B,1248B,1619B 'advanc':221B,346B,592B,717B,963B,1088B,1334B,1459B,1705B,1830B 'advent':219B,590B,961B,1332B,1703B 'adversari':116B,487B,858B,1229B,1600B 'air':133B,504B,875B,1246B,1617B 'alli':104B,475B,846B,1217B,1588B 'allow':311B,682B,1053B,1424B,1795B 'anti':154B,525B,896B,1267B,1638B 'anti-tamp':153B,524B,895B,1266B,1637B 'approach':234B,605B,976B,1347B,1718B 'architectur':368B,386B,396B,739B,757B,767B,1110B,1128B,1138B,1481B,1499B,1509B,1852B,1870B,1880B 'assum':359B,730B,1101B,1472B,1843B 'assur':113B,223B,484B,594B,855B,965B,1226B,1336B,1597B,1707B,1896A 'attribut':277B,648B,1019B,1390B,1761B 'augment':392B,763B,1134B,1505B,1876B 'author':65B,335B,339B,436B,706B,710B,807B,1077B,1081B,1178B,1448B,1452B,1549B,1819B,1823B 'automat':298B,669B,1040B,1411B,1782B 'avail':353B,724B,1095B,1466B,1837B 'base':35B,327B,406B,698B,777B,1069B,1148B,1440B,1519B,1811B 'biometr':337B,708B,1079B,1450B,1821B 'black':122B,493B,864B,1235B,1606B 'broadcast':70B,441B,812B,1183B,1554B 'burden':164B,255B,535B,626B,906B,997B,1277B,1368B,1648B,1739B 'buri':146B,517B,888B,1259B,1630B 'c':185B,556B,927B,1298B,1669B 'capabl':145B,216B,516B,587B,887B,958B,1258B,1329B,1629B,1700B 'chang':370B,741B,1112B,1483B,1854B 'classifi':85B,230B,456B,601B,827B,972B,1198B,1343B,1569B,1714B 'combin':238B,609B,980B,1351B,1722B 'communic':89B,215B,460B,586B,831B,957B,1202B,1328B,1573B,1699B 'concept':240B,351B,611B,722B,982B,1093B,1353B,1464B,1724B,1835B 'connect':243B,614B,985B,1356B,1727B 'consid':383B,754B,1125B,1496B,1867B 'control':309B,376B,680B,747B,1051B,1118B,1422B,1489B,1793B,1860B 'cost':182B,553B,924B,1295B,1666B 'cpi':171B,192B,250B,284B,542B,563B,621B,655B,913B,934B,992B,1026B,1284B,1305B,1363B,1397B,1655B,1676B,1734B,1768B 'critic':290B,661B,1032B,1403B,1774B 'cryptographi':34B,380B,405B,751B,776B,1122B,1147B,1493B,1518B,1864B,1891A 'cryptography-bas':33B,404B,775B,1146B,1517B 'data':291B,331B,662B,702B,1033B,1073B,1404B,1444B,1775B,1815B 'decrypt':144B,515B,886B,1257B,1628B 'defens':41B,412B,783B,1154B,1525B 'depart':39B,410B,781B,1152B,1523B 'desir':236B,607B,978B,1349B,1720B 'develop':263B,634B,1005B,1376B,1747B 'distribut':348B,719B,1090B,1461B,1832B 'dod':42B,48B,413B,419B,784B,790B,1155B,1161B,1526B,1532B 'drive':175B,546B,917B,1288B,1659B 'electron':1892A 'elimin':280B,651B,1022B,1393B,1764B 'encrypt':77B,80B,124B,448B,451B,495B,819B,822B,866B,1190B,1193B,1237B,1561B,1564B,1608B 'end':301B,672B,1043B,1414B,1785B 'enemi':201B,572B,943B,1314B,1685B 'enhanc':245B,616B,987B,1358B,1729B 'ensur':101B,472B,843B,1214B,1585B 'ephemer':1A,6A,11A,16A,21A,265B,276B,636B,647B,1007B,1018B,1378B,1389B,1749B,1760B 'equip':53B,168B,424B,539B,795B,910B,1166B,1281B,1537B,1652B 'evalu':323B,694B,1065B,1436B,1807B 'everi':44B,415B,786B,1157B,1528B 'exclus':100B,471B,842B,1213B,1584B 'exist':293B,394B,664B,765B,1035B,1136B,1406B,1507B,1777B,1878B 'exploit':194B,565B,936B,1307B,1678B 'export':61B,432B,803B,1174B,1545B 'expos':190B,561B,932B,1303B,1674B 'field':269B,640B,1011B,1382B,1753B 'find':198B,569B,940B,1311B,1682B 'forc':105B,476B,847B,1218B,1589B 'form':362B,733B,1104B,1475B,1846B 'foundat':364B,735B,1106B,1477B,1848B 'furthermor':119B,490B,861B,1232B,1603B 'gps':5A,10A,15A,20A,25A,27B,50B,67B,120B,160B,166B,205B,249B,258B,270B,287B,373B,375B,379B,398B,421B,438B,491B,531B,537B,576B,620B,629B,641B,658B,744B,746B,750B,769B,792B,809B,862B,902B,908B,947B,991B,1000B,1012B,1029B,1115B,1117B,1121B,1140B,1163B,1180B,1233B,1273B,1279B,1318B,1362B,1371B,1383B,1400B,1486B,1488B,1492B,1511B,1534B,1551B,1604B,1644B,1650B,1689B,1733B,1742B,1754B,1771B,1857B,1859B,1863B,1897A 'hand':202B,573B,944B,1315B,1686B 'hardwar':254B,625B,996B,1367B,1738B 'heavi':163B,534B,905B,1276B,1647B 'host':52B,423B,794B,1165B,1536B 'ia':224B,595B,966B,1337B,1708B 'includ':141B,324B,512B,695B,883B,1066B,1254B,1437B,1625B,1808B 'inform':86B,222B,457B,593B,828B,964B,1199B,1335B,1570B,1706B,1895A 'initi':342B,713B,1084B,1455B,1826B 'instead':384B,755B,1126B,1497B,1868B 'integr':208B,579B,950B,1321B,1692B 'key':123B,125B,143B,347B,494B,496B,514B,718B,865B,867B,885B,1089B,1236B,1238B,1256B,1460B,1607B,1609B,1627B,1831B 'locat':326B,697B,1068B,1439B,1810B 'location-bas':325B,696B,1067B,1438B,1809B 'maintain':308B,679B,1050B,1421B,1792B 'may':341B,712B,1083B,1454B,1825B 'militari':26B,58B,99B,187B,257B,315B,319B,397B,429B,470B,558B,628B,686B,690B,768B,800B,841B,929B,999B,1057B,1061B,1139B,1171B,1212B,1300B,1370B,1428B,1432B,1510B,1542B,1583B,1671B,1741B,1799B,1803B 'modern':305B,676B,1047B,1418B,1789B 'modul':150B,521B,892B,1263B,1634B 'must':54B,425B,796B,1167B,1538B 'nation':66B,437B,808B,1179B,1550B 'near':43B,414B,785B,1156B,1527B 'network':356B,727B,1098B,1469B,1840B 'new':233B,604B,975B,1346B,1717B 'oper':239B,610B,981B,1352B,1723B 'outsid':332B,703B,1074B,1445B,1816B 'overlay':3A,8A,13A,18A,23A,267B,367B,390B,638B,738B,761B,1009B,1109B,1132B,1380B,1480B,1503B,1751B,1851B,1874B 'passiv':74B,445B,816B,1187B,1558B 'perman':281B,652B,1023B,1394B,1765B 'place':161B,532B,903B,1274B,1645B 'platform':1882A,1884A,1886A,1888A,1890A 'pnt':1894A 'power':180B,551B,922B,1293B,1664B 'primarili':83B,454B,825B,1196B,1567B 'protect':84B,151B,170B,227B,247B,350B,455B,522B,541B,598B,618B,721B,826B,893B,912B,969B,989B,1092B,1197B,1264B,1283B,1340B,1360B,1463B,1568B,1635B,1654B,1711B,1731B,1834B 'provid':93B,464B,835B,1206B,1577B 'purg':330B,701B,1072B,1443B,1814B 'purpos':273B,644B,1015B,1386B,1757B 'receiv':28B,59B,73B,75B,140B,174B,188B,197B,206B,259B,271B,288B,316B,329B,344B,399B,430B,444B,446B,511B,545B,559B,568B,577B,630B,642B,659B,687B,700B,715B,770B,801B,815B,817B,882B,916B,930B,939B,948B,1001B,1013B,1030B,1058B,1071B,1086B,1141B,1172B,1186B,1188B,1253B,1287B,1301B,1310B,1319B,1372B,1384B,1401B,1429B,1442B,1457B,1512B,1543B,1557B,1559B,1624B,1658B,1672B,1681B,1690B,1743B,1755B,1772B,1800B,1813B,1828B 'reduc':252B,623B,994B,1365B,1736B 'region':336B,707B,1078B,1449B,1820B 'remov':297B,668B,1039B,1410B,1781B 'requir':137B,158B,508B,529B,879B,900B,1250B,1271B,1621B,1642B 'satellit':374B,745B,1116B,1487B,1858B 'sbir':261B,632B,1003B,1374B,1745B 'secur':2A,7A,12A,17A,22A,95B,149B,157B,266B,395B,466B,520B,528B,637B,766B,837B,891B,899B,1008B,1137B,1208B,1262B,1270B,1379B,1508B,1579B,1633B,1641B,1750B,1879B 'segment':377B,748B,1119B,1490B,1861B 'session':304B,675B,1046B,1417B,1788B 'signal':78B,110B,320B,449B,481B,691B,820B,852B,1062B,1191B,1223B,1433B,1562B,1594B,1804B 'size':178B,549B,920B,1291B,1662B 'space':1881A,1883A,1885A,1887A,1889A 'strateg':214B,585B,956B,1327B,1698B 'support':98B,469B,840B,1211B,1582B 'swap':184B,555B,926B,1297B,1668B 'swap-c':183B,554B,925B,1296B,1667B 'system':36B,46B,71B,90B,210B,231B,407B,417B,442B,461B,581B,602B,778B,788B,813B,832B,952B,973B,1149B,1159B,1184B,1203B,1323B,1344B,1520B,1530B,1555B,1574B,1694B,1715B 'tactic':212B,583B,954B,1325B,1696B 'tamper':155B,526B,897B,1268B,1639B 'techniqu':225B,306B,596B,677B,967B,1048B,1338B,1419B,1709B,1790B 'technolog':241B,612B,983B,1354B,1725B 'temporarili':294B,665B,1036B,1407B,1778B 'transec':96B,467B,838B,1209B,1580B 'transmiss':94B,465B,836B,1207B,1578B 'transmit':129B,500B,871B,1242B,1613B 'u.s':102B,473B,844B,1215B,1586B 'unclassifi':56B,130B,427B,501B,798B,872B,1169B,1243B,1540B,1614B 'unlik':30B,401B,772B,1143B,1514B 'use':49B,420B,791B,1162B,1533B 'user':167B,340B,538B,711B,909B,1082B,1280B,1453B,1651B,1824B 'util':121B,492B,863B,1234B,1605B 'warfar':1893A 'weapon':45B,416B,787B,1158B,1529B 'weight':179B,550B,921B,1292B,1663B 'within':147B,172B,285B,518B,543B,656B,889B,914B,1027B,1260B,1285B,1398B,1631B,1656B,1769B	AirForce
188	AF151-012	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46325	Airborne Fuel Cell Prime Power for Weapons Systems	2	The existing fuel cell state of the art now provides an advantageous source of prime power for most vehicular applications, both laser and microwave, under development at the Air Force Research Laboratory [1]. These efforts should advance the state of the art compared to turbo-generator power generation units, via SWAP and fuel consumption. There are several types of fuel cells; however, the hydrogen fueled PEM (Proton Exchange Membrane) type is probably the most suitable at this time. The DOE has several programs working the development of fuel cells for automotive and other applications. These programs include the logistics of hydrogen fuel production and storage as well as the cells themselves. Based on this work, the time is now for AFRL to get involved and start planning the integration of fuel cell technology to provide the prime power for present and future advanced weapons systems, such as typical GA MQ-9 Reaper unmanned aerial vehicle (UAV) and up to combat aircraft, such as the JSF F-35. Projected burst mode power requirements range from 100kW to1MW average power. The projected energy capability should be traceable to more than 25MJ per mission. The optimum use of fuel cells for pulsed power systems uses the fuel cell to deliver a relatively constant power direct current that is stored in a Li-ion or Li-polymer battery, in combination with power electronics, to provide the high peak pulsed power to the load. An interesting advanced commercial PEM fuel cell rated at 110kW available from Nuvera [1]. Hydrogen storage and logistics problems are also being addressed in terms of existing components and technologies [2,3]. Fuel cells are ideal for typical AFRL pulsed power weapons applications. PEM fuel cells have no start-up time compared to turbo-generator prime power sources. The fuel cell approach advances the state of the arr by the fact that there is essentially no mechanical inertial or electrical inductance that seriously degrades the conventional appraoch of turbo-generators.  In missions that require a long stand-by mode a turbo-generator has to be running, no load, at rated speed in order to provide fire power on demand. Typically, a turbine consumes about 70 percent of the full power fuel when running at rated speed and no-load. This obviously results in very high fuel consumption for missions requiring extended ready mode duration. PEM cells in addition to having a higher efficiency, do not consume fuel at no-load, provide fire power on demand from a cold stand-by, and converts the fuel directly into direct current. The SOFC (solid oxide fuel cell) [4] is also a possible candidate for prime power. The SOFC fuel requirement consists has a wide range of acceptable fuel, including JP-8, ethanol, propane, and most hydrocarbons. However, the SOFC operates at a temperature of approximately 800 degrees C and therefore does not have an instantaneous start up time. In some applications the flexible fuel type logistics may be advantageous.	Develop innovative, airworthy, power systems based on fuel cell prime power that are scaleable to levels for directed energy systems with maximum achievable energy densities.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'-35':216B,722B,1228B,1734B,2240B,2746B '-8':516B,1022B,1528B,2034B,2540B,3046B '-9':200B,706B,1212B,1718B,2224B,2730B '1':81B,304B,587B,810B,1093B,1316B,1599B,1822B,2105B,2328B,2611B,2834B '100kw':224B,730B,1236B,1742B,2248B,2754B '110kw':300B,806B,1312B,1818B,2324B,2830B '2':321B,827B,1333B,1839B,2345B,2851B '25mj':238B,744B,1250B,1756B,2262B,2768B '3':322B,828B,1334B,1840B,2346B,2852B '4':493B,999B,1505B,2011B,2517B,3023B '70':420B,926B,1432B,1938B,2444B,2950B '800':531B,1037B,1543B,2049B,2555B,3061B 'accept':512B,1018B,1524B,2030B,2536B,3042B 'addit':454B,960B,1466B,1972B,2478B,2984B 'address':313B,819B,1325B,1831B,2337B,2843B 'advanc':85B,192B,293B,355B,591B,698B,799B,861B,1097B,1204B,1305B,1367B,1603B,1710B,1811B,1873B,2109B,2216B,2317B,2379B,2615B,2722B,2823B,2885B 'advantag':60B,554B,566B,1060B,1072B,1566B,1578B,2072B,2084B,2578B,2590B,3084B 'aerial':203B,709B,1215B,1721B,2227B,2733B 'afrl':170B,329B,676B,835B,1182B,1341B,1688B,1847B,2194B,2353B,2700B,2859B 'air':77B,583B,1089B,1595B,2101B,2607B,3100A 'airborn':1A,9A,17A,25A,33A,41A 'aircraft':210B,716B,1222B,1728B,2234B,2740B 'also':311B,495B,817B,1001B,1323B,1507B,1829B,2013B,2335B,2519B,2841B,3025B 'applic':68B,143B,333B,546B,574B,649B,839B,1052B,1080B,1155B,1345B,1558B,1586B,1661B,1851B,2064B,2092B,2167B,2357B,2570B,2598B,2673B,2863B,3076B 'appraoch':379B,885B,1391B,1897B,2403B,2909B 'approach':354B,860B,1366B,1872B,2378B,2884B 'approxim':530B,1036B,1542B,2048B,2554B,3060B 'apu':3097A 'arr':360B,866B,1372B,1878B,2384B,2890B 'art':56B,90B,562B,596B,1068B,1102B,1574B,1608B,2080B,2114B,2586B,2620B 'automot':140B,646B,1152B,1658B,2164B,2670B 'avail':301B,807B,1313B,1819B,2325B,2831B 'averag':226B,732B,1238B,1744B,2250B,2756B 'base':161B,667B,1173B,1679B,2185B,2691B 'batteri':275B,781B,1287B,1793B,2299B,2805B 'burst':218B,724B,1230B,1736B,2242B,2748B 'c':533B,1039B,1545B,2051B,2557B,3063B 'candid':498B,1004B,1510B,2016B,2522B,3028B 'capabl':231B,737B,1243B,1749B,2255B,2761B 'cell':3A,11A,19A,27A,35A,43A,52B,110B,138B,159B,181B,246B,254B,297B,324B,336B,353B,452B,492B,558B,616B,644B,665B,687B,752B,760B,803B,830B,842B,859B,958B,998B,1064B,1122B,1150B,1171B,1193B,1258B,1266B,1309B,1336B,1348B,1365B,1464B,1504B,1570B,1628B,1656B,1677B,1699B,1764B,1772B,1815B,1842B,1854B,1871B,1970B,2010B,2076B,2134B,2162B,2183B,2205B,2270B,2278B,2321B,2348B,2360B,2377B,2476B,2516B,2582B,2640B,2668B,2689B,2711B,2776B,2784B,2827B,2854B,2866B,2883B,2982B,3022B,3096A,3105A 'cold':475B,981B,1487B,1993B,2499B,3005B 'combat':209B,715B,1221B,1727B,2233B,2739B 'combin':277B,783B,1289B,1795B,2301B,2807B 'commerci':294B,800B,1306B,1812B,2318B,2824B 'compar':91B,343B,597B,849B,1103B,1355B,1609B,1861B,2115B,2367B,2621B,2873B 'compon':318B,824B,1330B,1836B,2342B,2848B 'consist':506B,1012B,1518B,2024B,2530B,3036B 'constant':259B,765B,1271B,1777B,2283B,2789B 'consum':418B,462B,924B,968B,1430B,1474B,1936B,1980B,2442B,2486B,2948B,2992B 'consumpt':103B,443B,609B,949B,1115B,1455B,1621B,1961B,2127B,2467B,2633B,2973B 'convent':378B,884B,1390B,1896B,2402B,2908B 'convert':480B,986B,1492B,1998B,2504B,3010B 'current':262B,486B,768B,992B,1274B,1498B,1780B,2004B,2286B,2510B,2792B,3016B 'degrad':376B,882B,1388B,1894B,2400B,2906B 'degre':532B,1038B,1544B,2050B,2556B,3062B 'deliv':256B,762B,1268B,1774B,2280B,2786B 'demand':414B,472B,920B,978B,1426B,1484B,1932B,1990B,2438B,2496B,2944B,3002B 'develop':74B,135B,580B,641B,1086B,1147B,1592B,1653B,2098B,2159B,2604B,2665B 'direct':261B,483B,485B,767B,989B,991B,1273B,1495B,1497B,1779B,2001B,2003B,2285B,2507B,2509B,2791B,3013B,3015B 'doe':129B,635B,1141B,1647B,2153B,2659B 'durat':450B,956B,1462B,1968B,2474B,2980B 'effici':459B,965B,1471B,1977B,2483B,2989B 'effort':83B,589B,1095B,1601B,2107B,2613B 'electr':372B,878B,1384B,1890B,2396B,2902B 'electron':280B,786B,1292B,1798B,2304B,2810B,3098A 'energi':230B,736B,1242B,1748B,2254B,2760B,3108A 'essenti':367B,873B,1379B,1885B,2391B,2897B 'ethanol':517B,1023B,1529B,2035B,2541B,3047B 'exchang':117B,623B,1129B,1635B,2141B,2647B 'exist':50B,317B,556B,823B,1062B,1329B,1568B,1835B,2074B,2341B,2580B,2847B 'extend':447B,953B,1459B,1965B,2471B,2977B 'f':215B,721B,1227B,1733B,2239B,2745B 'fact':363B,869B,1375B,1881B,2387B,2893B 'fire':411B,469B,917B,975B,1423B,1481B,1929B,1987B,2435B,2493B,2941B,2999B 'flexibl':548B,1054B,1560B,2066B,2572B,3078B 'forc':78B,584B,1090B,1596B,2102B,2608B 'fuel':2A,10A,18A,26A,34A,42A,51B,102B,109B,114B,137B,151B,180B,245B,253B,296B,323B,335B,352B,426B,442B,463B,482B,491B,504B,513B,549B,557B,608B,615B,620B,643B,657B,686B,751B,759B,802B,829B,841B,858B,932B,948B,969B,988B,997B,1010B,1019B,1055B,1063B,1114B,1121B,1126B,1149B,1163B,1192B,1257B,1265B,1308B,1335B,1347B,1364B,1438B,1454B,1475B,1494B,1503B,1516B,1525B,1561B,1569B,1620B,1627B,1632B,1655B,1669B,1698B,1763B,1771B,1814B,1841B,1853B,1870B,1944B,1960B,1981B,2000B,2009B,2022B,2031B,2067B,2075B,2126B,2133B,2138B,2161B,2175B,2204B,2269B,2277B,2320B,2347B,2359B,2376B,2450B,2466B,2487B,2506B,2515B,2528B,2537B,2573B,2581B,2632B,2639B,2644B,2667B,2681B,2710B,2775B,2783B,2826B,2853B,2865B,2882B,2956B,2972B,2993B,3012B,3021B,3034B,3043B,3079B,3095A,3104A 'full':424B,930B,1436B,1942B,2448B,2954B 'futur':191B,697B,1203B,1709B,2215B,2721B 'ga':198B,704B,1210B,1716B,2222B,2728B 'generat':95B,97B,347B,383B,397B,601B,603B,853B,889B,903B,1107B,1109B,1359B,1395B,1409B,1613B,1615B,1865B,1901B,1915B,2119B,2121B,2371B,2407B,2421B,2625B,2627B,2877B,2913B,2927B 'get':172B,678B,1184B,1690B,2196B,2702B 'high':284B,441B,790B,947B,1296B,1453B,1802B,1959B,2308B,2465B,2814B,2971B 'higher':458B,964B,1470B,1976B,2482B,2988B 'howev':111B,522B,617B,1028B,1123B,1534B,1629B,2040B,2135B,2546B,2641B,3052B 'hydrocarbon':521B,1027B,1533B,2039B,2545B,3051B 'hydrogen':113B,150B,305B,619B,656B,811B,1125B,1162B,1317B,1631B,1668B,1823B,2137B,2174B,2329B,2643B,2680B,2835B 'ideal':326B,832B,1338B,1844B,2350B,2856B 'includ':146B,514B,652B,1020B,1158B,1526B,1664B,2032B,2170B,2538B,2676B,3044B 'induct':373B,879B,1385B,1891B,2397B,2903B 'inerti':370B,876B,1382B,1888B,2394B,2900B 'instantan':540B,1046B,1552B,2058B,2564B,3070B 'integr':178B,684B,1190B,1696B,2202B,2708B 'interest':292B,798B,1304B,1810B,2316B,2822B 'involv':173B,679B,1185B,1691B,2197B,2703B 'ion':270B,776B,1282B,1788B,2294B,2800B 'jp':515B,1021B,1527B,2033B,2539B,3045B 'jsf':214B,720B,1226B,1732B,2238B,2744B 'laboratori':80B,586B,1092B,1598B,2104B,2610B 'laser':70B,576B,1082B,1588B,2094B,2600B 'li':269B,273B,775B,779B,1281B,1285B,1787B,1791B,2293B,2297B,2799B,2803B 'li-ion':268B,774B,1280B,1786B,2292B,2798B 'li-polym':272B,778B,1284B,1790B,2296B,2802B 'load':290B,403B,435B,467B,796B,909B,941B,973B,1302B,1415B,1447B,1479B,1808B,1921B,1953B,1985B,2314B,2427B,2459B,2491B,2820B,2933B,2965B,2997B 'logist':148B,308B,551B,654B,814B,1057B,1160B,1320B,1563B,1666B,1826B,2069B,2172B,2332B,2575B,2678B,2838B,3081B 'long':389B,895B,1401B,1907B,2413B,2919B 'may':552B,1058B,1564B,2070B,2576B,3082B 'mechan':369B,875B,1381B,1887B,2393B,2899B 'membran':118B,624B,1130B,1636B,2142B,2648B 'microwav':72B,578B,1084B,1590B,2096B,2602B 'mission':240B,385B,445B,746B,891B,951B,1252B,1397B,1457B,1758B,1903B,1963B,2264B,2409B,2469B,2770B,2915B,2975B 'mode':219B,393B,449B,725B,899B,955B,1231B,1405B,1461B,1737B,1911B,1967B,2243B,2417B,2473B,2749B,2923B,2979B 'mq':199B,705B,1211B,1717B,2223B,2729B 'no-load':433B,465B,939B,971B,1445B,1477B,1951B,1983B,2457B,2489B,2963B,2995B 'nuvera':303B,809B,1315B,1821B,2327B,2833B 'obvious':437B,943B,1449B,1955B,2461B,2967B 'oper':525B,1031B,1537B,2043B,2549B,3055B 'optimum':242B,748B,1254B,1760B,2266B,2772B 'order':408B,914B,1420B,1926B,2432B,2938B 'oxid':490B,996B,1502B,2008B,2514B,3020B 'peak':285B,791B,1297B,1803B,2309B,2815B 'pem':115B,295B,334B,451B,621B,801B,840B,957B,1127B,1307B,1346B,1463B,1633B,1813B,1852B,1969B,2139B,2319B,2358B,2475B,2645B,2825B,2864B,2981B 'per':239B,745B,1251B,1757B,2263B,2769B 'percent':421B,927B,1433B,1939B,2445B,2951B 'plan':176B,682B,1188B,1694B,2200B,2706B 'platform':3101A 'polym':274B,780B,1286B,1792B,2298B,2804B 'possibl':497B,1003B,1509B,2015B,2521B,3027B 'power':5A,13A,21A,29A,37A,45A,64B,96B,187B,220B,227B,249B,260B,279B,287B,331B,349B,412B,425B,470B,501B,570B,602B,693B,726B,733B,755B,766B,785B,793B,837B,855B,918B,931B,976B,1007B,1076B,1108B,1199B,1232B,1239B,1261B,1272B,1291B,1299B,1343B,1361B,1424B,1437B,1482B,1513B,1582B,1614B,1705B,1738B,1745B,1767B,1778B,1797B,1805B,1849B,1867B,1930B,1943B,1988B,2019B,2088B,2120B,2211B,2244B,2251B,2273B,2284B,2303B,2311B,2355B,2373B,2436B,2449B,2494B,2525B,2594B,2626B,2717B,2750B,2757B,2779B,2790B,2809B,2817B,2861B,2879B,2942B,2955B,3000B,3031B,3092A,3103A,3107A 'present':189B,695B,1201B,1707B,2213B,2719B 'prime':4A,12A,20A,28A,36A,44A,63B,186B,348B,500B,569B,692B,854B,1006B,1075B,1198B,1360B,1512B,1581B,1704B,1866B,2018B,2087B,2210B,2372B,2524B,2593B,2716B,2878B,3030B,3102A,3106A 'probabl':121B,627B,1133B,1639B,2145B,2651B 'problem':309B,815B,1321B,1827B,2333B,2839B 'product':152B,658B,1164B,1670B,2176B,2682B 'program':132B,145B,638B,651B,1144B,1157B,1650B,1663B,2156B,2169B,2662B,2675B 'project':217B,229B,723B,735B,1229B,1241B,1735B,1747B,2241B,2253B,2747B,2759B 'propan':518B,1024B,1530B,2036B,2542B,3048B 'proton':116B,622B,1128B,1634B,2140B,2646B 'provid':58B,184B,282B,410B,468B,564B,690B,788B,916B,974B,1070B,1196B,1294B,1422B,1480B,1576B,1702B,1800B,1928B,1986B,2082B,2208B,2306B,2434B,2492B,2588B,2714B,2812B,2940B,2998B 'puls':248B,286B,330B,754B,792B,836B,1260B,1298B,1342B,1766B,1804B,1848B,2272B,2310B,2354B,2778B,2816B,2860B,3091A 'rang':222B,510B,728B,1016B,1234B,1522B,1740B,2028B,2246B,2534B,2752B,3040B 'rate':298B,405B,430B,804B,911B,936B,1310B,1417B,1442B,1816B,1923B,1948B,2322B,2429B,2454B,2828B,2935B,2960B 'readi':448B,954B,1460B,1966B,2472B,2978B 'reaper':201B,707B,1213B,1719B,2225B,2731B 'relat':258B,764B,1270B,1776B,2282B,2788B 'requir':221B,387B,446B,505B,727B,893B,952B,1011B,1233B,1399B,1458B,1517B,1739B,1905B,1964B,2023B,2245B,2411B,2470B,2529B,2751B,2917B,2976B,3035B 'research':79B,585B,1091B,1597B,2103B,2609B 'result':438B,944B,1450B,1956B,2462B,2968B 'run':401B,428B,907B,934B,1413B,1440B,1919B,1946B,2425B,2452B,2931B,2958B 'serious':375B,881B,1387B,1893B,2399B,2905B 'sever':106B,131B,612B,637B,1118B,1143B,1624B,1649B,2130B,2155B,2636B,2661B 'sofc':488B,503B,524B,994B,1009B,1030B,1500B,1515B,1536B,2006B,2021B,2042B,2512B,2527B,2548B,3018B,3033B,3054B 'solid':489B,995B,1501B,2007B,2513B,3019B 'sourc':61B,350B,567B,856B,1073B,1362B,1579B,1868B,2085B,2374B,2591B,2880B 'speed':406B,431B,912B,937B,1418B,1443B,1924B,1949B,2430B,2455B,2936B,2961B 'stand':391B,477B,897B,983B,1403B,1489B,1909B,1995B,2415B,2501B,2921B,3007B 'stand-bi':390B,476B,896B,982B,1402B,1488B,1908B,1994B,2414B,2500B,2920B,3006B 'start':175B,340B,541B,681B,846B,1047B,1187B,1352B,1553B,1693B,1858B,2059B,2199B,2364B,2565B,2705B,2870B,3071B 'start-up':339B,845B,1351B,1857B,2363B,2869B 'state':53B,87B,357B,559B,593B,863B,1065B,1099B,1369B,1571B,1605B,1875B,2077B,2111B,2381B,2583B,2617B,2887B 'storag':154B,306B,660B,812B,1166B,1318B,1672B,1824B,2178B,2330B,2684B,2836B,3109A 'store':265B,771B,1277B,1783B,2289B,2795B 'suitabl':124B,630B,1136B,1642B,2148B,2654B 'swap':100B,606B,1112B,1618B,2124B,2630B 'system':8A,16A,24A,32A,40A,48A,194B,250B,700B,756B,1206B,1262B,1712B,1768B,2218B,2274B,2724B,2780B,3094A 'technolog':182B,320B,688B,826B,1194B,1332B,1700B,1838B,2206B,2344B,2712B,2850B 'temperatur':528B,1034B,1540B,2046B,2552B,3058B 'term':315B,821B,1327B,1833B,2339B,2845B 'therefor':535B,1041B,1547B,2053B,2559B,3065B 'time':127B,166B,342B,543B,633B,672B,848B,1049B,1139B,1178B,1354B,1555B,1645B,1684B,1860B,2061B,2151B,2190B,2366B,2567B,2657B,2696B,2872B,3073B 'to1mw':225B,731B,1237B,1743B,2249B,2755B 'traceabl':234B,740B,1246B,1752B,2258B,2764B 'turbin':417B,923B,1429B,1935B,2441B,2947B 'turbo':94B,346B,382B,396B,600B,852B,888B,902B,1106B,1358B,1394B,1408B,1612B,1864B,1900B,1914B,2118B,2370B,2406B,2420B,2624B,2876B,2912B,2926B 'turbo-gener':93B,345B,381B,395B,599B,851B,887B,901B,1105B,1357B,1393B,1407B,1611B,1863B,1899B,1913B,2117B,2369B,2405B,2419B,2623B,2875B,2911B,2925B 'type':107B,119B,550B,613B,625B,1056B,1119B,1131B,1562B,1625B,1637B,2068B,2131B,2143B,2574B,2637B,2649B,3080B 'typic':197B,328B,415B,703B,834B,921B,1209B,1340B,1427B,1715B,1846B,1933B,2221B,2352B,2439B,2727B,2858B,2945B 'uav':205B,711B,1217B,1723B,2229B,2735B 'unit':98B,604B,1110B,1616B,2122B,2628B 'unman':202B,708B,1214B,1720B,2226B,2732B 'use':243B,251B,749B,757B,1255B,1263B,1761B,1769B,2267B,2275B,2773B,2781B 'vehicl':204B,710B,1216B,1722B,2228B,2734B 'vehicular':67B,573B,1079B,1585B,2091B,2597B 'via':99B,605B,1111B,1617B,2123B,2629B 'warfar':3099A 'weapon':7A,15A,23A,31A,39A,47A,193B,332B,699B,838B,1205B,1344B,1711B,1850B,2217B,2356B,2723B,2862B,3085A,3086A,3087A,3088A,3089A,3090A,3093A 'well':156B,662B,1168B,1674B,2180B,2686B 'wide':509B,1015B,1521B,2027B,2533B,3039B 'work':133B,164B,639B,670B,1145B,1176B,1651B,1682B,2157B,2188B,2663B,2694B	AirForce
183	AF15-AT30	DoD STTR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46497	Rapid Deployment of Thermodynamic Capability for Integrated Computational Materials Engineering	1	Recently, the Air Force Research Laboratory's Materials & Manufacturing Directorate has proposed using Integrated Computational Materials Engineering (ICME) to significantly reduce the time to develop and deploy new materials [1]. One technology that can markedly impact this problem is the Calculation of Phase Diagrams (CALPHAD) method [2]. These are thermodynamic models for making quantitative predictions of phase equilibria, volume fraction, solidification paths, and other thermodynamic quantities of engineering materials. Currently, hypothetical questions involving systems with 10-plus components can be answered about metallic systems from desktop CALPHAD software systems. Such results provide the fundamental underpinnings of evolutionary and revolutionary materials development. Expanding the reach of these tools would accelerate materials development and implementation across the transportation and energy generation (turbine engine) communities. The main sources of error in these methods are the availability and accuracy of multi-component databases, the physical and numerical representation of the thermodynamic quantities and the stability of the multivariate solvers. Developing these databases is costly and time consuming and the underlying structure representing this data in the CALPHAD methods is inflexible, requiring significant hard coding to incorporate new or improved experimental data. Significantly advancing the CALPHAD methods requires changes in the structure and extensibility of the databases which would lead to a natural, community-driven evolution of the underlying data. Advances in these methods should also include Bayesian, or its equivalent, methods for managing and reducing the intrinsic errors in the predicted properties. Further, the methods should provide feedback to the user based on what experimental data (phases, chemistry and temperature) are needed to improve the accuracy of the approach for a particular problem. Finally, rapid, parallel and robust experimental-testing techniques need to be developed to provide the breadth of thermodynamic data needed for these databases. In order to reach the stated ICME goal of a 50 percent reduction in time and cost, proposals are sought for developing technologies that produce rapid and accurate thermodynamic predictions through (but not limited to): accelerated development of thermodynamic databases, new easily extensible databases, more accurate thermodynamic models [3], advanced application of multivariate solvers, Bayesian methods for improving precision and feedback to the user on the optimum pathway for improving the databases for a specific application.	Significantly accelerate the development, deployment and accuracy of thermodynamic and kinetic databases used in the Integrated Computational Materials Engineering processes.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'1':70B,441B,812B,1183B '10':116B,487B,858B,1229B '2':87B,458B,829B,1200B '3':384B,755B,1126B,1497B '50':346B,717B,1088B,1459B 'acceler':149B,371B,520B,742B,891B,1113B,1262B,1484B 'accur':363B,381B,734B,752B,1105B,1123B,1476B,1494B 'accuraci':175B,304B,546B,675B,917B,1046B,1288B,1417B 'across':154B,525B,896B,1267B 'advanc':230B,258B,385B,601B,629B,756B,972B,1000B,1127B,1343B,1371B,1498B 'air':43B,414B,785B,1156B 'alloy':1529A 'also':263B,634B,1005B,1376B 'answer':121B,492B,863B,1234B 'applic':386B,411B,757B,782B,1128B,1153B,1499B,1524B 'approach':307B,678B,1049B,1420B 'avail':173B,544B,915B,1286B 'base':290B,661B,1032B,1403B 'bayesian':265B,390B,636B,761B,1007B,1132B,1378B,1503B 'breadth':328B,699B,1070B,1441B 'calcul':81B,452B,823B,1194B 'calphad':85B,127B,214B,232B,456B,498B,585B,603B,827B,869B,956B,974B,1198B,1240B,1327B,1345B 'capabl':5A,15A,25A,35A 'chang':235B,606B,977B,1348B 'chemistri':296B,667B,1038B,1409B 'code':221B,592B,963B,1334B 'communiti':162B,251B,533B,622B,904B,993B,1275B,1364B 'community-driven':250B,621B,992B,1363B 'compon':118B,179B,489B,550B,860B,921B,1231B,1292B 'comput':8A,18A,28A,38A,55B,426B,797B,1168B 'consum':204B,575B,946B,1317B 'cost':201B,352B,572B,723B,943B,1094B,1314B,1465B 'current':110B,481B,852B,1223B 'data':211B,228B,257B,294B,331B,582B,599B,628B,665B,702B,953B,970B,999B,1036B,1073B,1324B,1341B,1370B,1407B,1444B 'databas':180B,199B,243B,335B,375B,379B,407B,551B,570B,614B,706B,746B,750B,778B,922B,941B,985B,1077B,1117B,1121B,1149B,1293B,1312B,1356B,1448B,1488B,1492B,1520B 'deploy':2A,12A,22A,32A,67B,438B,809B,1180B 'desktop':126B,497B,868B,1239B 'develop':65B,141B,151B,197B,324B,357B,372B,436B,512B,522B,568B,695B,728B,743B,807B,883B,893B,939B,1066B,1099B,1114B,1178B,1254B,1264B,1310B,1437B,1470B,1485B,1530A 'diagram':84B,455B,826B,1197B,1532A 'director':50B,421B,792B,1163B 'driven':252B,623B,994B,1365B 'easili':377B,748B,1119B,1490B 'energi':158B,529B,900B,1271B 'engin':10A,20A,30A,40A,57B,108B,161B,428B,479B,532B,799B,850B,903B,1170B,1221B,1274B 'equilibria':98B,469B,840B,1211B 'equival':268B,639B,1010B,1381B 'error':167B,276B,538B,647B,909B,1018B,1280B,1389B 'evolut':253B,624B,995B,1366B 'evolutionari':137B,508B,879B,1250B 'expand':142B,513B,884B,1255B 'experiment':227B,293B,318B,598B,664B,689B,969B,1035B,1060B,1340B,1406B,1431B 'experimental-test':317B,688B,1059B,1430B 'extens':240B,378B,611B,749B,982B,1120B,1353B,1491B 'feedback':286B,396B,657B,767B,1028B,1138B,1399B,1509B 'final':312B,683B,1054B,1425B 'forc':44B,415B,786B,1157B 'fraction':100B,471B,842B,1213B 'fundament':134B,505B,876B,1247B 'generat':159B,530B,901B,1272B 'goal':343B,714B,1085B,1456B 'hard':220B,591B,962B,1333B 'hypothet':111B,482B,853B,1224B 'icm':58B,342B,429B,713B,800B,1084B,1171B,1455B,1534A 'impact':76B,447B,818B,1189B 'implement':153B,524B,895B,1266B 'improv':226B,302B,393B,405B,597B,673B,764B,776B,968B,1044B,1135B,1147B,1339B,1415B,1506B,1518B 'includ':264B,635B,1006B,1377B 'incorpor':223B,594B,965B,1336B 'inflex':217B,588B,959B,1330B 'integr':7A,17A,27A,37A,54B,425B,796B,1167B 'intrins':275B,646B,1017B,1388B 'involv':113B,484B,855B,1226B 'laboratori':46B,417B,788B,1159B 'lead':246B,617B,988B,1359B 'limit':369B,740B,1111B,1482B 'main':164B,535B,906B,1277B 'make':93B,464B,835B,1206B 'manag':271B,642B,1013B,1384B 'manufactur':49B,420B,791B,1162B 'mark':75B,446B,817B,1188B 'materi':9A,19A,29A,39A,48B,56B,69B,109B,140B,150B,419B,427B,440B,480B,511B,521B,790B,798B,811B,851B,882B,892B,1161B,1169B,1182B,1222B,1253B,1263B 'materials/processes':1525A,1526A,1527A,1528A 'metal':123B,494B,865B,1236B 'method':86B,170B,215B,233B,261B,269B,283B,391B,457B,541B,586B,604B,632B,640B,654B,762B,828B,912B,957B,975B,1003B,1011B,1025B,1133B,1199B,1283B,1328B,1346B,1374B,1382B,1396B,1504B 'model':91B,383B,462B,754B,833B,1125B,1204B,1496B 'multi':178B,549B,920B,1291B 'multi-compon':177B,548B,919B,1290B 'multivari':195B,388B,566B,759B,937B,1130B,1308B,1501B 'natur':249B,620B,991B,1362B 'need':300B,321B,332B,671B,692B,703B,1042B,1063B,1074B,1413B,1434B,1445B 'new':68B,224B,376B,439B,595B,747B,810B,966B,1118B,1181B,1337B,1489B 'numer':184B,555B,926B,1297B 'one':71B,442B,813B,1184B 'optimum':402B,773B,1144B,1515B 'order':337B,708B,1079B,1450B 'parallel':314B,685B,1056B,1427B 'particular':310B,681B,1052B,1423B 'path':102B,473B,844B,1215B 'pathway':403B,774B,1145B,1516B 'percent':347B,718B,1089B,1460B 'phase':83B,97B,295B,454B,468B,666B,825B,839B,1037B,1196B,1210B,1408B,1531A 'physic':182B,553B,924B,1295B 'plus':117B,488B,859B,1230B 'precis':394B,765B,1136B,1507B 'predict':95B,279B,365B,466B,650B,736B,837B,1021B,1107B,1208B,1392B,1478B 'problem':78B,311B,449B,682B,820B,1053B,1191B,1424B 'produc':360B,731B,1102B,1473B 'properti':280B,651B,1022B,1393B 'propos':52B,353B,423B,724B,794B,1095B,1165B,1466B 'provid':132B,285B,326B,503B,656B,697B,874B,1027B,1068B,1245B,1398B,1439B 'quantit':94B,465B,836B,1207B 'quantiti':106B,189B,477B,560B,848B,931B,1219B,1302B 'question':112B,483B,854B,1225B 'rapid':1A,11A,21A,31A,313B,361B,684B,732B,1055B,1103B,1426B,1474B 'reach':144B,339B,515B,710B,886B,1081B,1257B,1452B 'recent':41B,412B,783B,1154B 'reduc':61B,273B,432B,644B,803B,1015B,1174B,1386B 'reduct':348B,719B,1090B,1461B 'repres':209B,580B,951B,1322B 'represent':185B,556B,927B,1298B 'requir':218B,234B,589B,605B,960B,976B,1331B,1347B 'research':45B,416B,787B,1158B 'result':131B,502B,873B,1244B 'revolutionari':139B,510B,881B,1252B 'robust':316B,687B,1058B,1429B 'signific':60B,219B,229B,431B,590B,600B,802B,961B,971B,1173B,1332B,1342B 'softwar':128B,499B,870B,1241B 'solidif':101B,472B,843B,1214B 'solver':196B,389B,567B,760B,938B,1131B,1309B,1502B 'sought':355B,726B,1097B,1468B 'sourc':165B,536B,907B,1278B 'specif':410B,781B,1152B,1523B 'stabil':192B,563B,934B,1305B 'state':341B,712B,1083B,1454B 'structur':208B,238B,579B,609B,950B,980B,1321B,1351B 'system':114B,124B,129B,485B,495B,500B,856B,866B,871B,1227B,1237B,1242B 'techniqu':320B,691B,1062B,1433B 'technolog':72B,358B,443B,729B,814B,1100B,1185B,1471B 'temperatur':298B,669B,1040B,1411B 'test':319B,690B,1061B,1432B 'thermodynam':4A,14A,24A,34A,90B,105B,188B,330B,364B,374B,382B,461B,476B,559B,701B,735B,745B,753B,832B,847B,930B,1072B,1106B,1116B,1124B,1203B,1218B,1301B,1443B,1477B,1487B,1495B,1533A 'time':63B,203B,350B,434B,574B,721B,805B,945B,1092B,1176B,1316B,1463B 'tool':147B,518B,889B,1260B 'transport':156B,527B,898B,1269B 'turbin':160B,531B,902B,1273B 'under':207B,256B,578B,627B,949B,998B,1320B,1369B 'underpin':135B,506B,877B,1248B 'use':53B,424B,795B,1166B 'user':289B,399B,660B,770B,1031B,1141B,1402B,1512B 'volum':99B,470B,841B,1212B 'would':148B,245B,519B,616B,890B,987B,1261B,1358B	AirForce
114	AF151-101	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46400	Hardware-in-the-loop Celestial Navigation Test Bed	2	Celestial navigation concepts are being developed to augment inertial navigation systems on long-range guidance systems. These systems sense airframe attitude, through measurement of the relative angular position of known celestial objects, and position, if a reference frame relative to the local horizontal can be inferred. Since these systems directly impact accuracy of closed-loop guidance, a capability to test them as an integral part of the guidance system, i.e., hardware-in-the-loop simulation, is desired. Development of advanced star trackers for use in manned aircraft, remotely piloted aircraft (RPAs) and weapons will require a hardware-in-the-loop capability to integrate, test, and calibrate the system on the ground. This technology could also be used to support commercial interests, such as testing trackers for use in commercial maritime, aviation, and space navigation applications.\r\n\r\nA number of challenges exist that exceed the capability of current hardware-in-the-loop simulators.  Optical representation of star maps with radiometric accuracy is required in the visible through the short wave infrared spectrum. Collimated representation of the star field is required to sub-microradian accuracy. These advancements will require innovative solutions to extend scene generation capabilities to shorter wavelengths with increased contrast (greater than 2000:1).\r\n\r\nCapability is needed to represent the sky and stellar background including for a wide range of day and night celestial objects, backgrounds and optical distortions.  Representation of atmospheric objects (clouds, aerosols, etc.) and scatter along with possible interference of earth/sea glint and earth limb must also be considered. It is also a goal to provide radiometrically adjustable targets.  In other words, it would be nice to have the ability to accurately simulate star color in the scene generator.\r\n\r\nThese advancements will require innovative solutions to extend scene generation capabilities to shorter wavelengths with increased contrast (much greater than 2000:1), represent point source angular position to higher accuracy (about 100 urad) over a large field of view (greater than 20 degrees), and to represent a broad spectrum of airframe motion to navigation accuracy (greater than 400 deg/sec). Dynamic representation of stellar objects including Sun (V.M. -26), Moon, stars and space objects ranging from Magnitude 15 to Mag  -4+ are needed.  The need for objects with static magnitudes and temporally modulated magnitudes is also anticipated.\r\n\r\nInnovative solutions are being sought that will allow the insertion of celestial navigation systems, including associated inertial measurement units, into a hardware-in-the-loop test environment. While complete solution concepts are strongly encouraged and will be given priority, partial capabilities that describe one or more of the identified challenges will also be considered. Anticipated solutions range from complete environmental simulation using hardware simulators, to full or partial digital injection capabilities if hardware solutions are unreasonable.\r\n\r\nDynamics of the platforms under consideration deviate in major ways from traditional stellar inertial instrument application for attitude control on stable satellite platforms.  A star tracker for use in manned aircraft, RPAs and weapons will require a much more robust dynamic environment for targets and backgrounds due to the missile and aircraft high G dynamics and severe flight vibrations to be replicated during star tracker testing. Some instrument concepts under consideration require stimulation of the star field at up to 800 frames per seconds to reduce air frame vibration effects at high Mach number.\r\n\r\nThe approach should represent point source angular position to higher accuracy (less than 100 microradians) over a large field of view (greater than 20 degrees), and to represent a broad spectrum of airframe motion to navigation accuracy. Goals include to provide image motion rates of more than 400 deg/second in a random direction to represent actual flight dynamics of an airborne missile platform.  The number and type of targets to be projected or simulated and the approach for quasistatic and dynamic stellar objects must be addressed to provide a representative number of objects in the stellar instrument field of view.\r\n\r\nOther considerations include angular static accuracy measurement.  Calibration of the instrument in a very high fidelity angular measurement system  something that is capable of calibrating to 5-10X better than what is required on the star tracker.  Current test systems range from an angular accuracy of about 1 arcsecond to 20 milli-arc-seconds (100 nanoradians).	Develop technologies leading to an advanced hardware-in-the-loop (HWIL) test and demonstration capability for integration of future miniature strap-down precision celestial navigation systems with guidance concepts for long-range platforms.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'-10':745B,1457B,2169B,2881B,3593B,4305B,5017B '-26':418B,1130B,1842B,2554B,3266B,3978B,4690B '-4':430B,1142B,1854B,2566B,3278B,3990B,4702B '1':272B,372B,766B,984B,1084B,1478B,1696B,1796B,2190B,2408B,2508B,2902B,3120B,3220B,3614B,3832B,3932B,4326B,4544B,4644B,5038B '100':382B,631B,774B,1094B,1343B,1486B,1806B,2055B,2198B,2518B,2767B,2910B,3230B,3479B,3622B,3942B,4191B,4334B,4654B,4903B,5046B '15':427B,1139B,1851B,2563B,3275B,3987B,4699B '20':392B,641B,769B,1104B,1353B,1481B,1816B,2065B,2193B,2528B,2777B,2905B,3240B,3489B,3617B,3952B,4201B,4329B,4664B,4913B,5041B '2000':271B,371B,983B,1083B,1695B,1795B,2407B,2507B,3119B,3219B,3831B,3931B,4543B,4643B '400':408B,665B,1120B,1377B,1832B,2089B,2544B,2801B,3256B,3513B,3968B,4225B,4680B,4937B '5':744B,1456B,2168B,2880B,3592B,4304B,5016B '800':604B,1316B,2028B,2740B,3452B,4164B,4876B 'abil':341B,1053B,1765B,2477B,3189B,3901B,4613B 'accur':343B,1055B,1767B,2479B,3191B,3903B,4615B 'accuraci':116B,227B,251B,380B,405B,628B,654B,723B,763B,828B,939B,963B,1092B,1117B,1340B,1366B,1435B,1475B,1540B,1651B,1675B,1804B,1829B,2052B,2078B,2147B,2187B,2252B,2363B,2387B,2516B,2541B,2764B,2790B,2859B,2899B,2964B,3075B,3099B,3228B,3253B,3476B,3502B,3571B,3611B,3676B,3787B,3811B,3940B,3965B,4188B,4214B,4283B,4323B,4388B,4499B,4523B,4652B,4677B,4900B,4926B,4995B,5035B 'actual':673B,1385B,2097B,2809B,3521B,4233B,4945B 'address':703B,1415B,2127B,2839B,3551B,4263B,4975B 'adjust':329B,1041B,1753B,2465B,3177B,3889B,4601B 'advanc':146B,253B,352B,858B,965B,1064B,1570B,1677B,1776B,2282B,2389B,2488B,2994B,3101B,3200B,3706B,3813B,3912B,4418B,4525B,4624B 'aerosol':303B,1015B,1727B,2439B,3151B,3863B,4575B 'air':610B,1322B,2034B,2746B,3458B,4170B,4882B 'airborn':678B,1390B,2102B,2814B,3526B,4238B,4950B 'aircraft':153B,156B,554B,575B,865B,868B,1266B,1287B,1577B,1580B,1978B,1999B,2289B,2292B,2690B,2711B,3001B,3004B,3402B,3423B,3713B,3716B,4114B,4135B,4425B,4428B,4826B,4847B 'airfram':84B,401B,650B,796B,1113B,1362B,1508B,1825B,2074B,2220B,2537B,2786B,2932B,3249B,3498B,3644B,3961B,4210B,4356B,4673B,4922B 'allow':454B,1166B,1878B,2590B,3302B,4014B,4726B 'along':307B,1019B,1731B,2443B,3155B,3867B,4579B 'also':182B,318B,323B,445B,499B,894B,1030B,1035B,1157B,1211B,1606B,1742B,1747B,1869B,1923B,2318B,2454B,2459B,2581B,2635B,3030B,3166B,3171B,3293B,3347B,3742B,3878B,3883B,4005B,4059B,4454B,4590B,4595B,4717B,4771B 'angular':91B,376B,624B,721B,734B,762B,803B,1088B,1336B,1433B,1446B,1474B,1515B,1800B,2048B,2145B,2158B,2186B,2227B,2512B,2760B,2857B,2870B,2898B,2939B,3224B,3472B,3569B,3582B,3610B,3651B,3936B,4184B,4281B,4294B,4322B,4363B,4648B,4896B,4993B,5006B,5034B 'anticip':446B,502B,1158B,1214B,1870B,1926B,2582B,2638B,3294B,3350B,4006B,4062B,4718B,4774B 'applic':202B,539B,914B,1251B,1626B,1963B,2338B,2675B,3050B,3387B,3762B,4099B,4474B,4811B 'approach':619B,694B,1331B,1406B,2043B,2118B,2755B,2830B,3467B,3542B,4179B,4254B,4891B,4966B 'arc':772B,1484B,2196B,2908B,3620B,4332B,5044B 'arcsecond':767B,1479B,2191B,2903B,3615B,4327B,5039B 'associ':462B,1174B,1886B,2598B,3310B,4022B,4734B 'atmospher':300B,1012B,1724B,2436B,3148B,3860B,4572B 'attitud':85B,541B,797B,1253B,1509B,1965B,2221B,2677B,2933B,3389B,3645B,4101B,4357B,4813B 'augment':71B,783B,1495B,2207B,2919B,3631B,4343B 'aviat':198B,910B,1622B,2334B,3046B,3758B,4470B 'background':282B,294B,569B,994B,1006B,1281B,1706B,1718B,1993B,2418B,2430B,2705B,3130B,3142B,3417B,3842B,3854B,4129B,4554B,4566B,4841B 'bed':9A,18A,27A,36A,45A,54A,63A,5058A 'better':747B,1459B,2171B,2883B,3595B,4307B,5019B 'broad':398B,647B,1110B,1359B,1822B,2071B,2534B,2783B,3246B,3495B,3958B,4207B,4670B,4919B 'calibr':173B,725B,742B,885B,1437B,1454B,1597B,2149B,2166B,2309B,2861B,2878B,3021B,3573B,3590B,3733B,4285B,4302B,4445B,4997B,5014B 'capabl':123B,168B,211B,262B,273B,361B,488B,518B,740B,835B,880B,923B,974B,985B,1073B,1200B,1230B,1452B,1547B,1592B,1635B,1686B,1697B,1785B,1912B,1942B,2164B,2259B,2304B,2347B,2398B,2409B,2497B,2624B,2654B,2876B,2971B,3016B,3059B,3110B,3121B,3209B,3336B,3366B,3588B,3683B,3728B,3771B,3822B,3833B,3921B,4048B,4078B,4300B,4395B,4440B,4483B,4534B,4545B,4633B,4760B,4790B,5012B 'celesti':6A,15A,24A,33A,42A,51A,60A,64B,95B,292B,458B,776B,807B,1004B,1170B,1488B,1519B,1716B,1882B,2200B,2231B,2428B,2594B,2912B,2943B,3140B,3306B,3624B,3655B,3852B,4018B,4336B,4367B,4564B,4730B 'challeng':206B,497B,918B,1209B,1630B,1921B,2342B,2633B,3054B,3345B,3766B,4057B,4478B,4769B 'close':119B,831B,1543B,2255B,2967B,3679B,4391B 'closed-loop':118B,830B,1542B,2254B,2966B,3678B,4390B 'cloud':302B,1014B,1726B,2438B,3150B,3862B,4574B 'collim':239B,951B,1663B,2375B,3087B,3799B,4511B 'color':346B,1058B,1770B,2482B,3194B,3906B,4618B 'commerci':187B,196B,899B,908B,1611B,1620B,2323B,2332B,3035B,3044B,3747B,3756B,4459B,4468B 'complet':476B,506B,1188B,1218B,1900B,1930B,2612B,2642B,3324B,3354B,4036B,4066B,4748B,4778B 'concept':66B,478B,592B,778B,1190B,1304B,1490B,1902B,2016B,2202B,2614B,2728B,2914B,3326B,3440B,3626B,4038B,4152B,4338B,4750B,4864B 'consid':320B,501B,1032B,1213B,1744B,1925B,2456B,2637B,3168B,3349B,3880B,4061B,4592B,4773B 'consider':529B,594B,719B,1241B,1306B,1431B,1953B,2018B,2143B,2665B,2730B,2855B,3377B,3442B,3567B,4089B,4154B,4279B,4801B,4866B,4991B 'contrast':268B,367B,980B,1079B,1692B,1791B,2404B,2503B,3116B,3215B,3828B,3927B,4540B,4639B 'control':542B,1254B,1966B,2678B,3390B,4102B,4814B 'could':181B,893B,1605B,2317B,3029B,3741B,4453B 'current':213B,756B,925B,1468B,1637B,2180B,2349B,2892B,3061B,3604B,3773B,4316B,4485B,5028B 'day':289B,1001B,1713B,2425B,3137B,3849B,4561B 'deg/sec':409B,1121B,1833B,2545B,3257B,3969B,4681B 'deg/second':666B,1378B,2090B,2802B,3514B,4226B,4938B 'degre':393B,642B,1105B,1354B,1817B,2066B,2529B,2778B,3241B,3490B,3953B,4202B,4665B,4914B 'describ':490B,1202B,1914B,2626B,3338B,4050B,4762B 'desir':143B,855B,1567B,2279B,2991B,3703B,4415B 'develop':69B,144B,781B,856B,1493B,1568B,2205B,2280B,2917B,2992B,3629B,3704B,4341B,4416B 'deviat':530B,1242B,1954B,2666B,3378B,4090B,4802B 'digit':516B,1228B,1940B,2652B,3364B,4076B,4788B 'direct':114B,670B,826B,1382B,1538B,2094B,2250B,2806B,2962B,3518B,3674B,4230B,4386B,4942B 'distort':297B,1009B,1721B,2433B,3145B,3857B,4569B 'due':570B,1282B,1994B,2706B,3418B,4130B,4842B 'dynam':410B,524B,564B,578B,675B,698B,1122B,1236B,1276B,1290B,1387B,1410B,1834B,1948B,1988B,2002B,2099B,2122B,2546B,2660B,2700B,2714B,2811B,2834B,3258B,3372B,3412B,3426B,3523B,3546B,3970B,4084B,4124B,4138B,4235B,4258B,4682B,4796B,4836B,4850B,4947B,4970B 'earth':315B,1027B,1739B,2451B,3163B,3875B,4587B 'earth/sea':312B,1024B,1736B,2448B,3160B,3872B,4584B 'effect':613B,1325B,2037B,2749B,3461B,4173B,4885B 'encourag':481B,1193B,1905B,2617B,3329B,4041B,4753B 'environ':474B,565B,1186B,1277B,1898B,1989B,2610B,2701B,3322B,3413B,4034B,4125B,4746B,4837B 'environment':507B,1219B,1931B,2643B,3355B,4067B,4779B 'etc':304B,1016B,1728B,2440B,3152B,3864B,4576B 'exceed':209B,921B,1633B,2345B,3057B,3769B,4481B 'exist':207B,919B,1631B,2343B,3055B,3767B,4479B 'extend':259B,358B,971B,1070B,1683B,1782B,2395B,2494B,3107B,3206B,3819B,3918B,4531B,4630B 'fidel':733B,1445B,2157B,2869B,3581B,4293B,5005B 'field':244B,387B,600B,636B,715B,956B,1099B,1312B,1348B,1427B,1668B,1811B,2024B,2060B,2139B,2380B,2523B,2736B,2772B,2851B,3092B,3235B,3448B,3484B,3563B,3804B,3947B,4160B,4196B,4275B,4516B,4659B,4872B,4908B,4987B 'flight':581B,674B,1293B,1386B,2005B,2098B,2717B,2810B,3429B,3522B,4141B,4234B,4853B,4946B 'frame':102B,605B,611B,814B,1317B,1323B,1526B,2029B,2035B,2238B,2741B,2747B,2950B,3453B,3459B,3662B,4165B,4171B,4374B,4877B,4883B 'full':513B,1225B,1937B,2649B,3361B,4073B,4785B 'g':577B,1289B,2001B,2713B,3425B,4137B,4849B 'generat':261B,350B,360B,973B,1062B,1072B,1685B,1774B,1784B,2397B,2486B,2496B,3109B,3198B,3208B,3821B,3910B,3920B,4533B,4622B,4632B 'given':485B,1197B,1909B,2621B,3333B,4045B,4757B 'glint':313B,1025B,1737B,2449B,3161B,3873B,4585B 'goal':325B,655B,1037B,1367B,1749B,2079B,2461B,2791B,3173B,3503B,3885B,4215B,4597B,4927B 'greater':269B,369B,390B,406B,639B,981B,1081B,1102B,1118B,1351B,1693B,1793B,1814B,1830B,2063B,2405B,2505B,2526B,2542B,2775B,3117B,3217B,3238B,3254B,3487B,3829B,3929B,3950B,3966B,4199B,4541B,4641B,4662B,4678B,4911B 'ground':178B,890B,1602B,2314B,3026B,3738B,4450B 'guidanc':79B,121B,133B,791B,833B,845B,1503B,1545B,1557B,2215B,2257B,2269B,2927B,2969B,2981B,3639B,3681B,3693B,4351B,4393B,4405B 'hardwar':2A,11A,20A,29A,38A,47A,56A,137B,164B,215B,469B,510B,520B,849B,876B,927B,1181B,1222B,1232B,1561B,1588B,1639B,1893B,1934B,1944B,2273B,2300B,2351B,2605B,2646B,2656B,2985B,3012B,3063B,3317B,3358B,3368B,3697B,3724B,3775B,4029B,4070B,4080B,4409B,4436B,4487B,4741B,4782B,4792B 'hardware-in-the-loop':1A,10A,19A,28A,37A,46A,55A,136B,163B,214B,468B,848B,875B,926B,1180B,1560B,1587B,1638B,1892B,2272B,2299B,2350B,2604B,2984B,3011B,3062B,3316B,3696B,3723B,3774B,4028B,4408B,4435B,4486B,4740B 'high':576B,615B,732B,1288B,1327B,1444B,2000B,2039B,2156B,2712B,2751B,2868B,3424B,3463B,3580B,4136B,4175B,4292B,4848B,4887B,5004B 'higher':379B,627B,1091B,1339B,1803B,2051B,2515B,2763B,3227B,3475B,3939B,4187B,4651B,4899B 'horizont':107B,819B,1531B,2243B,2955B,3667B,4379B 'hwil':5070A 'i.e':135B,847B,1559B,2271B,2983B,3695B,4407B 'identifi':496B,1208B,1920B,2632B,3344B,4056B,4768B 'imag':659B,1371B,2083B,2795B,3507B,4219B,4931B 'impact':115B,827B,1539B,2251B,2963B,3675B,4387B 'includ':283B,415B,461B,656B,720B,995B,1127B,1173B,1368B,1432B,1707B,1839B,1885B,2080B,2144B,2419B,2551B,2597B,2792B,2856B,3131B,3263B,3309B,3504B,3568B,3843B,3975B,4021B,4216B,4280B,4555B,4687B,4733B,4928B,4992B 'increas':267B,366B,979B,1078B,1691B,1790B,2403B,2502B,3115B,3214B,3827B,3926B,4539B,4638B 'inerti':72B,463B,537B,784B,1175B,1249B,1496B,1887B,1961B,2208B,2599B,2673B,2920B,3311B,3385B,3632B,4023B,4097B,4344B,4735B,4809B,5056A 'infer':110B,822B,1534B,2246B,2958B,3670B,4382B 'infrar':237B,949B,1661B,2373B,3085B,3797B,4509B 'inject':517B,1229B,1941B,2653B,3365B,4077B,4789B 'innov':256B,355B,447B,968B,1067B,1159B,1680B,1779B,1871B,2392B,2491B,2583B,3104B,3203B,3295B,3816B,3915B,4007B,4528B,4627B,4719B 'insert':456B,1168B,1880B,2592B,3304B,4016B,4728B 'instrument':538B,591B,714B,728B,1250B,1303B,1426B,1440B,1962B,2015B,2138B,2152B,2674B,2727B,2850B,2864B,3386B,3439B,3562B,3576B,4098B,4151B,4274B,4288B,4810B,4863B,4986B,5000B 'integr':129B,170B,841B,882B,1553B,1594B,2265B,2306B,2977B,3018B,3689B,3730B,4401B,4442B 'interest':188B,900B,1612B,2324B,3036B,3748B,4460B 'interfer':310B,1022B,1734B,2446B,3158B,3870B,4582B 'ir':5069A 'known':94B,806B,1518B,2230B,2942B,3654B,4366B 'larg':386B,635B,1098B,1347B,1810B,2059B,2522B,2771B,3234B,3483B,3946B,4195B,4658B,4907B 'less':629B,1341B,2053B,2765B,3477B,4189B,4901B 'limb':316B,1028B,1740B,2452B,3164B,3876B,4588B 'local':106B,818B,1530B,2242B,2954B,3666B,4378B 'long':77B,789B,1501B,2213B,2925B,3637B,4349B 'long-rang':76B,788B,1500B,2212B,2924B,3636B,4348B 'loop':5A,14A,23A,32A,41A,50A,59A,120B,140B,167B,218B,472B,832B,852B,879B,930B,1184B,1544B,1564B,1591B,1642B,1896B,2256B,2276B,2303B,2354B,2608B,2968B,2988B,3015B,3066B,3320B,3680B,3700B,3727B,3778B,4032B,4392B,4412B,4439B,4490B,4744B 'mach':616B,1328B,2040B,2752B,3464B,4176B,4888B 'mag':429B,1141B,1853B,2565B,3277B,3989B,4701B 'magnitud':426B,439B,443B,1138B,1151B,1155B,1850B,1863B,1867B,2562B,2575B,2579B,3274B,3287B,3291B,3986B,3999B,4003B,4698B,4711B,4715B 'major':532B,1244B,1956B,2668B,3380B,4092B,4804B 'man':152B,553B,864B,1265B,1576B,1977B,2288B,2689B,3000B,3401B,3712B,4113B,4424B,4825B 'map':224B,936B,1648B,2360B,3072B,3784B,4496B 'maritim':197B,909B,1621B,2333B,3045B,3757B,4469B 'measur':87B,464B,724B,735B,799B,1176B,1436B,1447B,1511B,1888B,2148B,2159B,2223B,2600B,2860B,2871B,2935B,3312B,3572B,3583B,3647B,4024B,4284B,4295B,4359B,4736B,4996B,5007B 'microradian':250B,632B,962B,1344B,1674B,2056B,2386B,2768B,3098B,3480B,3810B,4192B,4522B,4904B 'milli':771B,1483B,2195B,2907B,3619B,4331B,5043B 'milli-arc-second':770B,1482B,2194B,2906B,3618B,4330B,5042B 'missil':573B,679B,1285B,1391B,1997B,2103B,2709B,2815B,3421B,3527B,4133B,4239B,4845B,4951B 'modul':442B,1154B,1866B,2578B,3290B,4002B,4714B 'moon':419B,1131B,1843B,2555B,3267B,3979B,4691B 'motion':402B,651B,660B,1114B,1363B,1372B,1826B,2075B,2084B,2538B,2787B,2796B,3250B,3499B,3508B,3962B,4211B,4220B,4674B,4923B,4932B 'much':368B,561B,1080B,1273B,1792B,1985B,2504B,2697B,3216B,3409B,3928B,4121B,4640B,4833B 'must':317B,701B,1029B,1413B,1741B,2125B,2453B,2837B,3165B,3549B,3877B,4261B,4589B,4973B 'nanoradian':775B,1487B,2199B,2911B,3623B,4335B,5047B 'navig':7A,16A,25A,34A,43A,52A,61A,65B,73B,201B,404B,459B,653B,777B,785B,913B,1116B,1171B,1365B,1489B,1497B,1625B,1828B,1883B,2077B,2201B,2209B,2337B,2540B,2595B,2789B,2913B,2921B,3049B,3252B,3307B,3501B,3625B,3633B,3761B,3964B,4019B,4213B,4337B,4345B,4473B,4676B,4731B,4925B 'need':275B,432B,434B,987B,1144B,1146B,1699B,1856B,1858B,2411B,2568B,2570B,3123B,3280B,3282B,3835B,3992B,3994B,4547B,4704B,4706B 'nice':337B,1049B,1761B,2473B,3185B,3897B,4609B 'night':291B,1003B,1715B,2427B,3139B,3851B,4563B 'number':204B,617B,682B,708B,916B,1329B,1394B,1420B,1628B,2041B,2106B,2132B,2340B,2753B,2818B,2844B,3052B,3465B,3530B,3556B,3764B,4177B,4242B,4268B,4476B,4889B,4954B,4980B 'object':96B,293B,301B,414B,423B,436B,700B,710B,808B,1005B,1013B,1126B,1135B,1148B,1412B,1422B,1520B,1717B,1725B,1838B,1847B,1860B,2124B,2134B,2232B,2429B,2437B,2550B,2559B,2572B,2836B,2846B,2944B,3141B,3149B,3262B,3271B,3284B,3548B,3558B,3656B,3853B,3861B,3974B,3983B,3996B,4260B,4270B,4368B,4565B,4573B,4686B,4695B,4708B,4972B,4982B 'one':491B,1203B,1915B,2627B,3339B,4051B,4763B 'optic':220B,296B,932B,1008B,1644B,1720B,2356B,2432B,3068B,3144B,3780B,3856B,4492B,4568B,5059A 'part':130B,842B,1554B,2266B,2978B,3690B,4402B 'partial':487B,515B,1199B,1227B,1911B,1939B,2623B,2651B,3335B,3363B,4047B,4075B,4759B,4787B 'per':606B,1318B,2030B,2742B,3454B,4166B,4878B 'pilot':155B,867B,1579B,2291B,3003B,3715B,4427B 'platform':527B,546B,680B,1239B,1258B,1392B,1951B,1970B,2104B,2663B,2682B,2816B,3375B,3394B,3528B,4087B,4106B,4240B,4799B,4818B,4952B 'point':374B,622B,1086B,1334B,1798B,2046B,2510B,2758B,3222B,3470B,3934B,4182B,4646B,4894B 'posit':92B,98B,377B,625B,804B,810B,1089B,1337B,1516B,1522B,1801B,2049B,2228B,2234B,2513B,2761B,2940B,2946B,3225B,3473B,3652B,3658B,3937B,4185B,4364B,4370B,4649B,4897B 'possibl':309B,1021B,1733B,2445B,3157B,3869B,4581B 'prioriti':486B,1198B,1910B,2622B,3334B,4046B,4758B 'project':689B,1401B,2113B,2825B,3537B,4249B,4961B 'provid':327B,658B,705B,1039B,1370B,1417B,1751B,2082B,2129B,2463B,2794B,2841B,3175B,3506B,3553B,3887B,4218B,4265B,4599B,4930B,4977B 'quasistat':696B,1408B,2120B,2832B,3544B,4256B,4968B 'radiometr':226B,328B,938B,1040B,1650B,1752B,2362B,2464B,3074B,3176B,3786B,3888B,4498B,4600B 'random':669B,1381B,2093B,2805B,3517B,4229B,4941B 'rang':78B,287B,424B,504B,759B,790B,999B,1136B,1216B,1471B,1502B,1711B,1848B,1928B,2183B,2214B,2423B,2560B,2640B,2895B,2926B,3135B,3272B,3352B,3607B,3638B,3847B,3984B,4064B,4319B,4350B,4559B,4696B,4776B,5031B 'rate':661B,1373B,2085B,2797B,3509B,4221B,4933B 'real':5061A 'reduc':609B,1321B,2033B,2745B,3457B,4169B,4881B 'refer':101B,813B,1525B,2237B,2949B,3661B,4373B 'relat':90B,103B,802B,815B,1514B,1527B,2226B,2239B,2938B,2951B,3650B,3663B,4362B,4375B 'remot':154B,866B,1578B,2290B,3002B,3714B,4426B 'replic':585B,1297B,2009B,2721B,3433B,4145B,4857B 'repres':277B,373B,396B,621B,645B,672B,707B,989B,1085B,1108B,1333B,1357B,1384B,1419B,1701B,1797B,1820B,2045B,2069B,2096B,2131B,2413B,2509B,2532B,2757B,2781B,2808B,2843B,3125B,3221B,3244B,3469B,3493B,3520B,3555B,3837B,3933B,3956B,4181B,4205B,4232B,4267B,4549B,4645B,4668B,4893B,4917B,4944B,4979B 'represent':221B,240B,298B,411B,933B,952B,1010B,1123B,1645B,1664B,1722B,1835B,2357B,2376B,2434B,2547B,3069B,3088B,3146B,3259B,3781B,3800B,3858B,3971B,4493B,4512B,4570B,4683B 'requir':161B,229B,246B,255B,354B,559B,595B,751B,873B,941B,958B,967B,1066B,1271B,1307B,1463B,1585B,1653B,1670B,1679B,1778B,1983B,2019B,2175B,2297B,2365B,2382B,2391B,2490B,2695B,2731B,2887B,3009B,3077B,3094B,3103B,3202B,3407B,3443B,3599B,3721B,3789B,3806B,3815B,3914B,4119B,4155B,4311B,4433B,4501B,4518B,4527B,4626B,4831B,4867B,5023B 'robust':563B,1275B,1987B,2699B,3411B,4123B,4835B 'rpas':157B,555B,869B,1267B,1581B,1979B,2293B,2691B,3005B,3403B,3717B,4115B,4429B,4827B 'satellit':545B,1257B,1969B,2681B,3393B,4105B,4817B 'scatter':306B,1018B,1730B,2442B,3154B,3866B,4578B 'scene':260B,349B,359B,972B,1061B,1071B,1684B,1773B,1783B,2396B,2485B,2495B,3108B,3197B,3207B,3820B,3909B,3919B,4532B,4621B,4631B 'second':607B,773B,1319B,1485B,2031B,2197B,2743B,2909B,3455B,3621B,4167B,4333B,4879B,5045B 'sens':83B,795B,1507B,2219B,2931B,3643B,4355B 'sever':580B,1292B,2004B,2716B,3428B,4140B,4852B 'short':235B,947B,1659B,2371B,3083B,3795B,4507B,5067A 'shorter':264B,363B,976B,1075B,1688B,1787B,2400B,2499B,3112B,3211B,3824B,3923B,4536B,4635B 'simul':141B,219B,344B,508B,511B,691B,853B,931B,1056B,1220B,1223B,1403B,1565B,1643B,1768B,1932B,1935B,2115B,2277B,2355B,2480B,2644B,2647B,2827B,2989B,3067B,3192B,3356B,3359B,3539B,3701B,3779B,3904B,4068B,4071B,4251B,4413B,4491B,4616B,4780B,4783B,4963B,5060A 'sinc':111B,823B,1535B,2247B,2959B,3671B,4383B 'sky':279B,991B,1703B,2415B,3127B,3839B,4551B 'solut':257B,356B,448B,477B,503B,521B,969B,1068B,1160B,1189B,1215B,1233B,1681B,1780B,1872B,1901B,1927B,1945B,2393B,2492B,2584B,2613B,2639B,2657B,3105B,3204B,3296B,3325B,3351B,3369B,3817B,3916B,4008B,4037B,4063B,4081B,4529B,4628B,4720B,4749B,4775B,4793B 'someth':737B,1449B,2161B,2873B,3585B,4297B,5009B 'sought':451B,1163B,1875B,2587B,3299B,4011B,4723B 'sourc':375B,623B,1087B,1335B,1799B,2047B,2511B,2759B,3223B,3471B,3935B,4183B,4647B,4895B 'space':200B,422B,912B,1134B,1624B,1846B,2336B,2558B,3048B,3270B,3760B,3982B,4472B,4694B 'spectrum':238B,399B,648B,950B,1111B,1360B,1662B,1823B,2072B,2374B,2535B,2784B,3086B,3247B,3496B,3798B,3959B,4208B,4510B,4671B,4920B 'stabl':544B,1256B,1968B,2680B,3392B,4104B,4816B 'star':147B,223B,243B,345B,420B,548B,587B,599B,754B,859B,935B,955B,1057B,1132B,1260B,1299B,1311B,1466B,1571B,1647B,1667B,1769B,1844B,1972B,2011B,2023B,2178B,2283B,2359B,2379B,2481B,2556B,2684B,2723B,2735B,2890B,2995B,3071B,3091B,3193B,3268B,3396B,3435B,3447B,3602B,3707B,3783B,3803B,3905B,3980B,4108B,4147B,4159B,4314B,4419B,4495B,4515B,4617B,4692B,4820B,4859B,4871B,5026B,5063A 'static':438B,722B,1150B,1434B,1862B,2146B,2574B,2858B,3286B,3570B,3998B,4282B,4710B,4994B 'stellar':281B,413B,536B,699B,713B,993B,1125B,1248B,1411B,1425B,1705B,1837B,1960B,2123B,2137B,2417B,2549B,2672B,2835B,2849B,3129B,3261B,3384B,3547B,3561B,3841B,3973B,4096B,4259B,4273B,4553B,4685B,4808B,4971B,4985B,5055A 'stimul':596B,1308B,2020B,2732B,3444B,4156B,4868B 'strong':480B,1192B,1904B,2616B,3328B,4040B,4752B 'sub':249B,961B,1673B,2385B,3097B,3809B,4521B 'sub-microradian':248B,960B,1672B,2384B,3096B,3808B,4520B 'sun':416B,1128B,1840B,2552B,3264B,3976B,4688B 'support':186B,898B,1610B,2322B,3034B,3746B,4458B 'swir':5066A 'system':74B,80B,82B,113B,134B,175B,460B,736B,758B,786B,792B,794B,825B,846B,887B,1172B,1448B,1470B,1498B,1504B,1506B,1537B,1558B,1599B,1884B,2160B,2182B,2210B,2216B,2218B,2249B,2270B,2311B,2596B,2872B,2894B,2922B,2928B,2930B,2961B,2982B,3023B,3308B,3584B,3606B,3634B,3640B,3642B,3673B,3694B,3735B,4020B,4296B,4318B,4346B,4352B,4354B,4385B,4406B,4447B,4732B,5008B,5030B 'target':330B,567B,686B,1042B,1279B,1398B,1754B,1991B,2110B,2466B,2703B,2822B,3178B,3415B,3534B,3890B,4127B,4246B,4602B,4839B,4958B 'technolog':180B,892B,1604B,2316B,3028B,3740B,4452B 'tempor':441B,1153B,1865B,2577B,3289B,4001B,4713B 'test':8A,17A,26A,35A,44A,53A,62A,125B,171B,191B,473B,589B,757B,837B,883B,903B,1185B,1301B,1469B,1549B,1595B,1615B,1897B,2013B,2181B,2261B,2307B,2327B,2609B,2725B,2893B,2973B,3019B,3039B,3321B,3437B,3605B,3685B,3731B,3751B,4033B,4149B,4317B,4397B,4443B,4463B,4745B,4861B,5029B,5057A,5065A 'time':5062A 'tracker':148B,192B,549B,588B,755B,860B,904B,1261B,1300B,1467B,1572B,1616B,1973B,2012B,2179B,2284B,2328B,2685B,2724B,2891B,2996B,3040B,3397B,3436B,3603B,3708B,3752B,4109B,4148B,4315B,4420B,4464B,4821B,4860B,5027B,5064A 'tradit':535B,1247B,1959B,2671B,3383B,4095B,4807B 'type':684B,1396B,2108B,2820B,3532B,4244B,4956B 'unit':465B,1177B,1889B,2601B,3313B,4025B,4737B 'unreason':523B,1235B,1947B,2659B,3371B,4083B,4795B 'urad':383B,1095B,1807B,2519B,3231B,3943B,4655B 'use':150B,184B,194B,509B,551B,862B,896B,906B,1221B,1263B,1574B,1608B,1618B,1933B,1975B,2286B,2320B,2330B,2645B,2687B,2998B,3032B,3042B,3357B,3399B,3710B,3744B,3754B,4069B,4111B,4422B,4456B,4466B,4781B,4823B 'v.m':417B,1129B,1841B,2553B,3265B,3977B,4689B 'vibrat':582B,612B,1294B,1324B,2006B,2036B,2718B,2748B,3430B,3460B,4142B,4172B,4854B,4884B 'view':389B,638B,717B,1101B,1350B,1429B,1813B,2062B,2141B,2525B,2774B,2853B,3237B,3486B,3565B,3949B,4198B,4277B,4661B,4910B,4989B 'visibl':232B,944B,1656B,2368B,3080B,3792B,4504B 'wave':236B,948B,1660B,2372B,3084B,3796B,4508B,5068A 'wavelength':265B,364B,977B,1076B,1689B,1788B,2401B,2500B,3113B,3212B,3825B,3924B,4537B,4636B 'way':533B,1245B,1957B,2669B,3381B,4093B,4805B 'weapon':159B,557B,871B,1269B,1583B,1981B,2295B,2693B,3007B,3405B,3719B,4117B,4431B,4829B,5048A,5049A,5050A,5051A,5052A,5053A,5054A 'wide':286B,998B,1710B,2422B,3134B,3846B,4558B 'word':333B,1045B,1757B,2469B,3181B,3893B,4605B 'would':335B,1047B,1759B,2471B,3183B,3895B,4607B 'x':746B,1458B,2170B,2882B,3594B,4306B,5018B	AirForce
67	AF151-158	DoD SBIR 2015.1	http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46448	Very Large Multi-Modal NDI	2	As the age of our legacy fleets increase, there is an increasing requirement to scan very large areas of the outer mold line.  Traditional inspection equipment were primarily designed as hand held operations for specific locations on the structure.  This equipment was adapted for semi-automated operations and manipulation by computers and x-y scanners.  Research should include but not limited to the use of array probes, both ultrasonic and eddy current, to increase the area that can be scanned at one time, increased scan speed, improve data collection rates, improve data fusion, and provide automatic defect recognition/reporting.  This program will also investigate using multiple inspection modes simultaneously, (i.e., ultrasonic/eddy current, high frequency/low frequency).  For example, the KC-135 has an inspection requirement on the crown skin for both a high frequency and a low frequency eddy current inspection of the spot welds.  This currently requires two set ups and two separate scans.  If high frequency and low frequency eddy current could be combined, this would result in an automatic 50 percent reduction in manhours, and the use of arrays will be faster than manual, further reducing the manhours required.	The objective is to move away from non-destructive inspection (NDI) hand-held operations to very large surface areas of aircraft structures that will reduce man hours and depot cycle times.	2014-12-12 00:00:00	2015-01-15 00:00:00	2015-02-18 00:00:00	'-135':157B,349B,541B,733B,925B,1117B '50':209B,401B,593B,785B,977B,1169B 'adapt':79B,271B,463B,655B,847B,1039B 'age':39B,231B,423B,615B,807B,999B 'also':140B,332B,524B,716B,908B,1100B 'area':54B,114B,246B,306B,438B,498B,630B,690B,822B,882B,1014B,1074B,1199A 'array':104B,218B,296B,410B,488B,602B,680B,794B,872B,986B,1064B,1178B,1201A 'autom':83B,275B,467B,659B,851B,1043B 'automat':134B,208B,326B,400B,518B,592B,710B,784B,902B,976B,1094B,1168B 'collect':127B,319B,511B,703B,895B,1087B 'combin':202B,394B,586B,778B,970B,1162B 'comput':88B,280B,472B,664B,856B,1048B 'could':200B,392B,584B,776B,968B,1160B 'crown':164B,356B,548B,740B,932B,1124B 'current':110B,149B,176B,183B,199B,302B,341B,368B,375B,391B,494B,533B,560B,567B,583B,686B,725B,752B,759B,775B,878B,917B,944B,951B,967B,1070B,1109B,1136B,1143B,1159B,1206A 'data':126B,130B,318B,322B,510B,514B,702B,706B,894B,898B,1086B,1090B 'defect':135B,327B,519B,711B,903B,1095B 'design':65B,257B,449B,641B,833B,1025B 'eddi':109B,175B,198B,301B,367B,390B,493B,559B,582B,685B,751B,774B,877B,943B,966B,1069B,1135B,1158B,1205A 'equip':62B,77B,254B,269B,446B,461B,638B,653B,830B,845B,1022B,1037B 'exampl':154B,346B,538B,730B,922B,1114B 'faster':221B,413B,605B,797B,989B,1181B 'fleet':43B,235B,427B,619B,811B,1003B 'frequenc':152B,170B,174B,194B,197B,344B,362B,366B,386B,389B,536B,554B,558B,578B,581B,728B,746B,750B,770B,773B,920B,938B,942B,962B,965B,1112B,1130B,1134B,1154B,1157B 'frequency/low':151B,343B,535B,727B,919B,1111B 'fusion':131B,323B,515B,707B,899B,1091B 'hand':67B,259B,451B,643B,835B,1027B 'held':68B,260B,452B,644B,836B,1028B 'high':150B,169B,193B,342B,361B,385B,534B,553B,577B,726B,745B,769B,918B,937B,961B,1110B,1129B,1153B 'i.e':147B,339B,531B,723B,915B,1107B 'improv':125B,129B,317B,321B,509B,513B,701B,705B,893B,897B,1085B,1089B 'includ':96B,288B,480B,672B,864B,1056B 'increas':44B,48B,112B,122B,236B,240B,304B,314B,428B,432B,496B,506B,620B,624B,688B,698B,812B,816B,880B,890B,1004B,1008B,1072B,1082B 'inspect':61B,144B,160B,177B,253B,336B,352B,369B,445B,528B,544B,561B,637B,720B,736B,753B,829B,912B,928B,945B,1021B,1104B,1120B,1137B 'investig':141B,333B,525B,717B,909B,1101B 'kc':156B,348B,540B,732B,924B,1116B 'larg':2A,8A,14A,20A,26A,32A,53B,245B,437B,629B,821B,1013B,1198A 'legaci':42B,234B,426B,618B,810B,1002B 'limit':99B,291B,483B,675B,867B,1059B 'line':59B,251B,443B,635B,827B,1019B 'locat':72B,264B,456B,648B,840B,1032B 'low':173B,196B,365B,388B,557B,580B,749B,772B,941B,964B,1133B,1156B 'manhour':213B,227B,405B,419B,597B,611B,789B,803B,981B,995B,1173B,1187B 'manipul':86B,278B,470B,662B,854B,1046B 'manual':223B,415B,607B,799B,991B,1183B 'materials/processes':1189A,1190A,1191A,1192A,1193A,1194A 'modal':5A,11A,17A,23A,29A,35A,1197A 'mode':145B,337B,529B,721B,913B,1105B 'mold':58B,250B,442B,634B,826B,1018B 'multi':4A,10A,16A,22A,28A,34A,1196A 'multi-mod':3A,9A,15A,21A,27A,33A 'multipl':143B,335B,527B,719B,911B,1103B 'ndi':6A,12A,18A,24A,30A,36A,1195A,1200A 'one':120B,312B,504B,696B,888B,1080B 'oper':69B,84B,261B,276B,453B,468B,645B,660B,837B,852B,1029B,1044B 'outer':57B,249B,441B,633B,825B,1017B 'percent':210B,402B,594B,786B,978B,1170B 'primarili':64B,256B,448B,640B,832B,1024B 'probe':105B,297B,489B,681B,873B,1065B,1202A 'program':138B,330B,522B,714B,906B,1098B 'provid':133B,325B,517B,709B,901B,1093B 'rate':128B,320B,512B,704B,896B,1088B 'recognition/reporting':136B,328B,520B,712B,904B,1096B 'reduc':225B,417B,609B,801B,993B,1185B 'reduct':211B,403B,595B,787B,979B,1171B 'requir':49B,161B,184B,228B,241B,353B,376B,420B,433B,545B,568B,612B,625B,737B,760B,804B,817B,929B,952B,996B,1009B,1121B,1144B,1188B 'research':94B,286B,478B,670B,862B,1054B 'result':205B,397B,589B,781B,973B,1165B 'scan':51B,118B,123B,191B,243B,310B,315B,383B,435B,502B,507B,575B,627B,694B,699B,767B,819B,886B,891B,959B,1011B,1078B,1083B,1151B,1204A 'scanner':93B,285B,477B,669B,861B,1053B 'semi':82B,274B,466B,658B,850B,1042B 'semi-autom':81B,273B,465B,657B,849B,1041B 'separ':190B,382B,574B,766B,958B,1150B 'set':186B,378B,570B,762B,954B,1146B 'simultan':146B,338B,530B,722B,914B,1106B 'skin':165B,357B,549B,741B,933B,1125B 'specif':71B,263B,455B,647B,839B,1031B 'speed':124B,316B,508B,700B,892B,1084B 'spot':180B,372B,564B,756B,948B,1140B 'structur':75B,267B,459B,651B,843B,1035B 'time':121B,313B,505B,697B,889B,1081B 'tradit':60B,252B,444B,636B,828B,1020B 'two':185B,189B,377B,381B,569B,573B,761B,765B,953B,957B,1145B,1149B 'ultrason':107B,299B,491B,683B,875B,1067B,1203A 'ultrasonic/eddy':148B,340B,532B,724B,916B,1108B 'up':187B,379B,571B,763B,955B,1147B 'use':102B,142B,216B,294B,334B,408B,486B,526B,600B,678B,718B,792B,870B,910B,984B,1062B,1102B,1176B 'weld':181B,373B,565B,757B,949B,1141B 'would':204B,396B,588B,780B,972B,1164B 'x':91B,283B,475B,667B,859B,1051B 'x-i':90B,282B,474B,666B,858B,1050B 'y':92B,284B,476B,668B,860B,1052B	AirForce
\.


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sbirez
--

SELECT pg_catalog.setval('topics_id_seq', 189, false);


--
-- Data for Name: topicsareas; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY topicsareas (topic_id, area_id) FROM stdin;
173	7
7	7
14	1
71	4
76	4
3	1
183	4
188	2
114	2
67	4
\.


--
-- Data for Name: topicskeywords; Type: TABLE DATA; Schema: public; Owner: sbirez
--

COPY topicskeywords (topic_id, keyword_id) FROM stdin;
173	217
124	411
7	267
14	259
124	927
71	927
76	910
3	688
71	40
188	453
183	138
124	524
114	214
173	603
67	19
173	289
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
-- Name: references_reference_key; Type: CONSTRAINT; Schema: public; Owner: sbirez; Tablespace: 
--

ALTER TABLE ONLY "references"
    ADD CONSTRAINT references_reference_key UNIQUE (reference);


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
-- Name: tests_pkey; Type: CONSTRAINT; Schema: public; Owner: catherine; Tablespace: 
--

ALTER TABLE ONLY tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


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


--
-- Name: topics_fulltext_idx; Type: INDEX; Schema: public; Owner: sbirez; Tablespace: 
--

CREATE INDEX topics_fulltext_idx ON topics USING gin (full_text);


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

