# -*- coding: utf-8 -*-
"""
    tests.factories
    ~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from datetime import datetime
from factory import Factory, Sequence, LazyAttribute, post_generation
from flask.ext.security.utils import encrypt_password

from sbirez.models.users import User, Role
from sbirez.models.todos import Todo
from sbirez.framework.sql import db

class BaseFactory(Factory):
    ABSTRACT_FACTORY = True

    @classmethod
    def _create(cls, target_class, *args, **kwargs):
        entity = target_class(**kwargs)
        db.session.add(entity)
        db.session.commit()
        return entity

class RoleFactory(BaseFactory):
    FACTORY_FOR = Role
    name = 'admin'
    description = 'Administrator'

class TodoFactory(BaseFactory):
    FACTORY_FOR = Todo
    title = Sequence(lambda n: "todo #{0}".format(n))

class UserFactory(BaseFactory):
    FACTORY_FOR = User
    email = Sequence(lambda n: 'user{0}@foobar.com'.format(n))
    confirmed_at = datetime.utcnow()
    last_login_at = datetime.utcnow()
    current_login_at = datetime.utcnow()
    last_login_ip = '127.0.0.1'
    current_login_ip = '127.0.0.1'
    login_count = 1
    active = True

    @post_generation
    def password(self, create, extracted, **kwargs):
        self.password = encrypt_password(extracted or "password")
