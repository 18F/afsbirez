from flask.ext.sqlalchemy import SQLAlchemy
# Define the database functions
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)

    created_on = db.Column(db.DateTime, default=db.func.now())
    updated_on = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username

class Topic(db.Model):
    pass

class Award(db.Model):
    pass

class Organization(db.Model):
    pass

class Application(db.Model):
    pass

class Form(db.Model):
    pass

class Document(db.Model):
    pass

class Process(db.Model):
    pass