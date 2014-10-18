# coding: utf-8
from flask.ext.sqlalchemy import SQLAlchemy
# Define the database functions
db = SQLAlchemy()


class Content(db.Model):
    __tablename__ = 'contents'

    id = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.Integer)
    start_date = db.Column(db.DateTime(True))
    end_date = db.Column(db.DateTime(True))
    change_log = db.Column(db.Text)
    content = db.Column(db.LargeBinary)
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)
    document_id = db.Column(db.Integer)


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    filepath = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)
    organization_id = db.Column(db.ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))

    organization = db.relationship(u'Organization')


class Documentskeyword(db.Model):
    __tablename__ = 'documentskeywords'

    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)
    keyword_id = db.Column(db.ForeignKey(u'keywords.id'), primary_key=True, nullable=False)
    document_id = db.Column(db.ForeignKey(u'documents.id'), primary_key=True, nullable=False)

    document = db.relationship(u'Document')
    keyword = db.relationship(u'Keyword')


class Documentsproposal(db.Model):
    __tablename__ = 'documentsproposals'

    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)
    proposal_id = db.Column(db.ForeignKey(u'proposals.id'), primary_key=True, nullable=False)
    document_id = db.Column(db.ForeignKey(u'documents.id'), primary_key=True, nullable=False)

    document = db.relationship(u'Document')
    proposal = db.relationship(u'Proposal')


class Keyword(db.Model):
    __tablename__ = 'keywords'

    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)


class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    duns = db.Column(db.String(255))
    ein = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)


class Organizationsuser(db.Model):
    __tablename__ = 'organizationsusers'

    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)
    organization_id = db.Column(db.ForeignKey(u'organizations.id'), primary_key=True, nullable=False)
    user_id = db.Column(db.ForeignKey(u'users.id'), primary_key=True, nullable=False)

    organization = db.relationship(u'Organization')
    user = db.relationship(u'User')


class Proposal(db.Model):
    __tablename__ = 'proposals'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    sbir_topic_reference = db.Column(db.String(255))
    start_date = db.Column(db.DateTime(True))
    end_date = db.Column(db.DateTime(True))
    organization_id = db.Column(db.ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    workflow_id = db.Column(db.ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)

    organization = db.relationship(u'Organization')
    workflow = db.relationship(u'Workflow')


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255))
    email = db.Column(db.String(255))
    title = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)


class Workflow(db.Model):
    __tablename__ = 'workflows'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)


class WorkflowStepResult(db.Model):
    __tablename__ = 'workflowstepresults'

    id = db.Column(db.Integer, primary_key=True)
    result = db.Column(db.Text)
    completed_at = db.Column(db.DateTime(True))
    workflowstep_id = db.Column(db.ForeignKey(u'workflowsteps.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)

    workflowstep = db.relationship(u'Workflowstep')


class WorkflowStep(db.Model):
    __tablename__ = 'workflowsteps'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    work = db.Column(db.Text)
    workflow_id = db.Column(db.ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = db.Column(db.DateTime(True), nullable=False)
    updated_at = db.Column(db.DateTime(True), nullable=False)

    workflow = db.relationship(u'Workflow')
