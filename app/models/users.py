# -*- coding: utf-8 -*-
"""
    sbirez.models.users
    ~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.
"""
import base64
import os

from flask.ext.security import RoleMixin, UserMixin

from ..framework.sql import (
    db,
    Model,
    ReferenceColumn,
)


roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('users.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('roles.id')))


class Role(RoleMixin, Model):

    __tablename__ = "roles"

    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class Connection(Model):

    __tablename__ = "connections"

    user_id = ReferenceColumn("users")
    provider_id = db.Column(db.String(255))
    provider_user_id = db.Column(db.String(255))
    access_token = db.Column(db.String(255))
    secret = db.Column(db.String(255))
    display_name = db.Column(db.String(255))
    full_name = db.Column(db.String(255))
    profile_url = db.Column(db.String(512))
    image_url = db.Column(db.String(512))
    rank = db.Column(db.Integer)


def generate_secret():
    """Generate a random string used for salts and secret keys."""
    return base64.b64encode(os.urandom(48)).decode('utf-8')


class User(UserMixin, Model):

    __tablename__ = "users"

    #username = db.Column(db.String(64), unique, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(120))
    active = db.Column(db.Boolean())
    secret = db.Column(db.String(64), default=generate_secret)
    confirmed_at = db.Column(db.DateTime())
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String(100))
    login_count = db.Column(db.Integer)
    roles = db.relationship('Role', secondary=roles_users,
            backref=db.backref('users', lazy='dynamic'))
    connections = db.relationship('Connection',
            backref=db.backref('user', lazy='joined'), cascade='all')

    def reset_secret(self):
        self.secret = generate_secret()
        self.save()
