# coding: utf-8
from flask.ext.sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as pg
# Define the database functions

from ..framework.sql import (Model, db)

class Content(Model):
    __tablename__ = 'contents'


    version = db.Column(db.Integer)
    start_date = db.Column(db.DateTime(True))
    end_date = db.Column(db.DateTime(True))
    change_log = db.Column(db.Text)
    content = db.Column(db.LargeBinary)
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now(), onupdate=db.func.now())

    document_id = db.Column(db.Integer,
                            db.ForeignKey(u'documents.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))


documentsproposals = db.Table(
    'documentsproposals',
    db.Column('document_id', db.Integer, db.ForeignKey('documents.id')),
    db.Column('proposal_id', db.Integer, db.ForeignKey('proposals.id')),
    db.Column('created_at', db.DateTime(True), nullable=False, default=db.func.now()),
    db.Column('updated_at', db.DateTime(True), nullable=False, default=db.func.now())
    )


documentskeywords = db.Table(
    'documentskeywords',
    db.Column('document_id', db.Integer, db.ForeignKey('documents.id')),
    db.Column('keyword_id', db.Integer, db.ForeignKey('keywords.id')),
    db.Column('created_at', db.DateTime(True), nullable=False, default=db.func.now()),
    db.Column('updated_at', db.DateTime(True), nullable=False, default=db.func.now())
    )


class Document(Model):
    __tablename__ = 'documents'


    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    filepath = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now(), onupdate=db.func.now())

    organization_id = db.Column(db.Integer,
                                db.ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    contents = db.relationship('Content', backref='document')
    proposals = db.relationship('Proposal', secondary=documentsproposals,
                                backref=db.backref('documents'))
    keywords = db.relationship('Keyword', secondary=documentskeywords,
                                backref=db.backref('documents'))


organizationsusers = db.Table(
    'organizationsusers',
    db.Column('organization_id', db.Integer, db.ForeignKey('organizations.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('created_at', db.DateTime(True), nullable=False, default=db.func.now()),
    db.Column('updated_at', db.DateTime(True), nullable=False, default=db.func.now())
    )


class Organization(Model):
    __tablename__ = 'organizations'


    name = db.Column(db.String(255), nullable=False)
    duns = db.Column(db.String(255))
    ein = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())

    documents = db.relationship('Document', backref='organization')
    users = db.relationship('User', secondary=organizationsusers,
                            backref=db.backref('organizations'))
    proposals = db.relationship('Proposal', backref='organization')


class Proposal(Model):
    __tablename__ = 'proposals'


    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    sbir_topic_reference = db.Column(db.String(255))
    start_date = db.Column(db.DateTime(True))
    end_date = db.Column(db.DateTime(True))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())

    organization_id = db.Column(db.Integer,
                                db.ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    workflows = db.relationship('Workflow', backref='proposal')

class Workflow(Model):
    __tablename__ = 'workflows'


    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    proposal_id = db.Column(db.Integer,
                            db.ForeignKey(u'proposals.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    steps = db.relationship('WorkflowStep', backref='workflow')


class WorkflowStep(Model):
    __tablename__ = 'workflowsteps'


    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    work = db.Column(db.Text)
    workflow_id = db.Column(db.Integer,
                            db.ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())

    workflow_id = db.Column(db.Integer, db.ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    results = db.relationship('WorkflowStepResult', backref='step')


class WorkflowStepResult(Model):
    __tablename__ = 'workflowstepresults'


    result = db.Column(db.Text)
    completed_at = db.Column(db.DateTime(True))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())

    workflowstep_id = db.Column(db.Integer,
                                db.ForeignKey(u'workflowsteps.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))


class Program(Model):
    __tablename__ = 'programs'

    program = db.Column(db.Text)
    topics = db.relationship('Topic', backref='program')


class Topic(Model):
    __tablename__ = 'topics'

    topic_number = db.Column(db.Text(), nullable=False, unique=True)
    solicitation_id = db.Column(db.Text(), nullable=False)
    url = db.Column(db.Text(), nullable=False, unique=True)
    title = db.Column(db.Text(), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey(u'programs.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    description = db.Column(db.Text(), nullable=False)
    objective = db.Column(db.Text(), nullable=False)
    pre_release_date = db.Column(db.DateTime(), nullable=False)
    proposals_begin_date = db.Column(db.DateTime(), nullable=False)
    proposals_end_date = db.Column(db.DateTime(), nullable=False)
    full_text = pg.TSVECTOR()


topicsareas = db.Table(
    'topicsareas',
    db.Column('topic_id', db.Integer, db.ForeignKey('topics.id')),
    db.Column('area_id', db.Integer, db.ForeignKey('areas.id')),
    )


class Area(Model):
    __tablename__ = 'areas'

    area = db.Column(db.Text(), nullable=False, unique=True)
    topics = db.relationship('Topic', secondary=topicsareas,
                             backref=db.backref('areas'))


topicskeywords = db.Table(
    'topicskeywords',
    db.Column('topic_id', db.Integer, db.ForeignKey('topics.id')),
    db.Column('keyword_id', db.Integer, db.ForeignKey('keywords.id')),
    )


class Keyword(Model):
    __tablename__ = 'keywords'


    keyword = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    topics = db.relationship('Topic', secondary=topicskeywords,
                             backref=db.backref('keywords'))



class Phase(Model):
    __tablename__ = 'phases'

    phase = db.Column(db.Text(), nullable=False)
    topic_id = db.Column(db.Integer(), db.ForeignKey('topics.id'), nullable=False)
    topic = db.relationship('Topic', backref='phases')


class Reference(Model):
    __tablename__ = 'references'

    reference = db.Column(db.Text(), nullable=False, unique=True)
    topic_id = db.Column(db.Integer(), db.ForeignKey('topics.id'), nullable=False)
    topic = db.relationship('Topic', backref='references')


participatingcomponentstopics = db.Table(
    'participatingcomponentstopics',
    db.Column('topic_id', db.Integer, db.ForeignKey('topics.id')),
    db.Column('participatingcomponent_id', db.Integer, db.ForeignKey('participatingcomponents.id')),
    )


class ParticipatingComponent(Model):
    __tablename__ = 'participatingcomponents'

    participatingcomponent = db.Column(db.Text(), nullable=False, unique=True)
    topics = db.relationship('Topic', secondary=participatingcomponentstopics,
                             backref=db.backref('participating_components'))


