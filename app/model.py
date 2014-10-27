# coding: utf-8
from flask.ext.sqlalchemy import SQLAlchemy
import sqlalchemy as sa
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
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now(), onupdate=db.func.now())
    
    document_id = db.Column(db.Integer,
                            db.ForeignKey(u'documents.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))

    
documentsproposals = db.Table(
    'documentsproposals',
    db.Column('document_id', db.Integer, db.ForeignKey('documents.id')),
    db.Column('proposal_id', db.Integer, db.ForeignKey('proposals.id')),
    db.Column('created_at', db.DateTime(True), nullable=False, default=db.fun.now()),
    db.Column('updated_at', db.DateTime(True), nullable=False, default=db.fun.now())
    )


documentskeywords = db.Table(
    'documentskeywords',
    db.Column('document_id', db.Integer, db.ForeignKey('documents.id')),
    db.Column('keyword_id', db.Integer, db.ForeignKey('keywords.id')),
    db.Column('created_at', db.DateTime(True), nullable=False, default=db.fun.now()),
    db.Column('updated_at', db.DateTime(True), nullable=False, default=db.fun.now())
    )


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    filepath = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.func.now(), onupdate=db.func.now())
    
    organization_id = db.Column(db.Integer,
                                db.ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    contents = db.relationship('Content', backref='document')
    proposals = db.relationship('Proposal', secondary=documentsproposals, 
                                backref=db.backref('document'))
    keywords = db.relationship('Keyword', secondary=documentskeywords, 
                                backref=db.backref('document'))


class Keyword(db.Model):
    __tablename__ = 'keywords'

    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())


organizationsusers = db.Table(
    'organizationsusers',
    db.Column('organization_id', db.Integer, db.ForeignKey('organizations.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('created_at', db.DateTime(True), nullable=False, default=db.fun.now()),
    db.Column('updated_at', db.DateTime(True), nullable=False, default=db.fun.now())
    )


class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    duns = db.Column(db.String(255))
    ein = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    
    documents = db.relationship('Document', backref='organization')
    users = db.relationship('User', secondary=organizationsusers, 
                            backref=db.backref('organizations'))
    proposals = db.relationship('Proposal', backref='organization')
    

class Proposal(db.Model):
    __tablename__ = 'proposals'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    sbir_topic_reference = db.Column(db.String(255))
    start_date = db.Column(db.DateTime(True))
    end_date = db.Column(db.DateTime(True))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    
    organization_id = db.Column(db.Integer,
                                db.ForeignKey(u'organizations.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    workflows = db.relationship('Workflow', backref='proposal')


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255))
    email = db.Column(db.String(255))
    title = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())


class Workflow(db.Model):
    __tablename__ = 'workflows'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    proposal_id = db.Column(db.Integer, 
                            db.ForeignKey(u'proposals.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    steps = db.relationship('WorkflowStep', backref='workflow')

    
class WorkflowStep(db.Model):
    __tablename__ = 'workflowsteps'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    work = db.Column(db.Text)
    workflow_id = db.Column(db.Integer,
                            db.ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    
    workflow_id = db.Column(db.Integer, db.ForeignKey(u'workflows.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))
    results = db.relationship('WorkflowStepResult', backref='step')

    
class WorkflowStepResult(db.Model):
    __tablename__ = 'workflowstepresults'

    id = db.Column(db.Integer, primary_key=True)
    result = db.Column(db.Text)
    completed_at = db.Column(db.DateTime(True))
    created_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    updated_at = db.Column(db.DateTime(True), nullable=False, default=db.fun.now())
    
    workflowstep_id = db.Column(db.Integer,
                                db.ForeignKey(u'workflowsteps.id', ondelete=u'RESTRICT', onupdate=u'CASCADE'))

