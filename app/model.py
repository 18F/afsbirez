# coding: utf-8
from sqlalchemy import Column, DateTime, ForeignKey, Integer, LargeBinary, String, Text, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
metadata = Base.metadata


class Content(Base):
    __tablename__ = 'contents'

    id = Column(Integer, primary_key=True, server_default=text("nextval('contents_id_seq'::regclass)"))
    version = Column(Integer)
    start_date = Column(DateTime(True))
    end_date = Column(DateTime(True))
    change_log = Column(Text)
    content = Column(LargeBinary)
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)
    document_id = Column(Integer)


class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, server_default=text("nextval('documents_id_seq'::regclass)"))
    name = Column(String(255))
    description = Column(Text)
    filepath = Column(String(255), nullable=False)
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)
    organization_id = Column(ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))

    organization = relationship(u'Organization')


class Documentskeyword(Base):
    __tablename__ = 'documentskeywords'

    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)
    keyword_id = Column(ForeignKey(u'keywords.id'), primary_key=True, nullable=False)
    document_id = Column(ForeignKey(u'documents.id'), primary_key=True, nullable=False)

    document = relationship(u'Document')
    keyword = relationship(u'Keyword')


class Documentsproposal(Base):
    __tablename__ = 'documentsproposals'

    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)
    proposal_id = Column(ForeignKey(u'proposals.id'), primary_key=True, nullable=False)
    document_id = Column(ForeignKey(u'documents.id'), primary_key=True, nullable=False)

    document = relationship(u'Document')
    proposal = relationship(u'Proposal')


class Keyword(Base):
    __tablename__ = 'keywords'

    id = Column(Integer, primary_key=True, server_default=text("nextval('keywords_id_seq'::regclass)"))
    keyword = Column(String(255))
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)


class Organization(Base):
    __tablename__ = 'organizations'

    id = Column(Integer, primary_key=True, server_default=text("nextval('organizations_id_seq'::regclass)"))
    name = Column(String(255), nullable=False)
    duns = Column(String(255))
    ein = Column(String(255))
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)


class Organizationsuser(Base):
    __tablename__ = 'organizationsusers'

    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)
    organization_id = Column(ForeignKey(u'organizations.id'), primary_key=True, nullable=False)
    user_id = Column(ForeignKey(u'users.id'), primary_key=True, nullable=False)

    organization = relationship(u'Organization')
    user = relationship(u'User')


class Proposal(Base):
    __tablename__ = 'proposals'

    id = Column(Integer, primary_key=True, server_default=text("nextval('proposals_id_seq'::regclass)"))
    name = Column(String(255))
    description = Column(Text)
    sbir_topic_reference = Column(String(255))
    start_date = Column(DateTime(True))
    end_date = Column(DateTime(True))
    organization_id = Column(ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    workflow_id = Column(ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)

    organization = relationship(u'Organization')
    workflow = relationship(u'Workflow')


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, server_default=text("nextval('users_id_seq'::regclass)"))
    name = Column(String(255), nullable=False)
    password = Column(String(255))
    email = Column(String(255))
    title = Column(String(255))
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)


class Workflow(Base):
    __tablename__ = 'workflows'

    id = Column(Integer, primary_key=True, server_default=text("nextval('workflows_id_seq'::regclass)"))
    name = Column(String(255))
    description = Column(Text)
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)


class WorkflowStepResult(Base):
    __tablename__ = 'workflowstepresults'

    id = Column(Integer, primary_key=True, server_default=text("nextval('workflowstepresults_id_seq'::regclass)"))
    result = Column(Text)
    completed_at = Column(DateTime(True))
    workflowstep_id = Column(ForeignKey(u'workflowsteps.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)

    workflowstep = relationship(u'Workflowstep')


class WorkflowStep(Base):
    __tablename__ = 'workflowsteps'

    id = Column(Integer, primary_key=True, server_default=text("nextval('workflowsteps_id_seq'::regclass)"))
    name = Column(String(255))
    description = Column(Text)
    work = Column(Text)
    workflow_id = Column(ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = Column(DateTime(True), nullable=False)
    updated_at = Column(DateTime(True), nullable=False)

    workflow = relationship(u'Workflow')
