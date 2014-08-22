
CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    version integer,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    change_log text,
    content bytea,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    document_id integer
);


CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    name character varying(255),
    description text,
    filepath character varying(255) NOT NULL,
    organization_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


CREATE TABLE documentskeywords (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    keyword_id integer NOT NULL,
    document_id integer NOT NULL,
    PRIMARY KEY (keyword_id, document_id)
);

CREATE TABLE IF NOT EXISTS documentsproposals (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    proposal_id integer NOT NULL,
    document_id integer NOT NULL,
    PRIMARY KEY (proposal_id, document_id)
);

CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    keyword character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    duns character varying(255),
    ein character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS organizationsusers (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    organization_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    name character varying(255),
    description text,
    sbir_topic_reference character varying(255),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    organization_id integer,
    workflow_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    password character varying(255),
    email character varying(255),
    title character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS workflows (
    id SERIAL PRIMARY KEY,
    name character varying(255),
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS workflowstepresults (
    id SERIAL PRIMARY KEY,
    result text,
    completed_at timestamp with time zone,
    workflowstep_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS workflowsteps (
    id SERIAL PRIMARY KEY,
    name character varying(255),
    description text,
    work text,
    workflow_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

ALTER TABLE ONLY documents
    ADD CONSTRAINT documents_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY proposals
    ADD CONSTRAINT proposals_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY proposals
    ADD CONSTRAINT proposals_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY workflowstepresults
    ADD CONSTRAINT workflowstepresults_workflowstep_id_fkey FOREIGN KEY (workflowstep_id) REFERENCES workflowsteps(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY workflowsteps
    ADD CONSTRAINT workflowsteps_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE documentskeywords ADD FOREIGN KEY (keyword_id)
  REFERENCES keywords (id);
ALTER TABLE documentskeywords ADD FOREIGN KEY (document_id)
  REFERENCES documents (id);

ALTER TABLE documentsproposals ADD FOREIGN KEY (document_id)
  REFERENCES documents (id);
ALTER TABLE documentsproposals ADD FOREIGN KEY (proposal_id)
  REFERENCES proposals (id);

ALTER TABLE organizationsusers ADD FOREIGN KEY (organization_id)
  REFERENCES organizations (id);
ALTER TABLE organizationsusers ADD FOREIGN KEY (user_id)
  REFERENCES users (id);
