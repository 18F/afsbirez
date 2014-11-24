# -*- coding: utf-8 -*-
"""
    sbirez.framework.extensions
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from flask.ext.migrate import Migrate
migrate = Migrate()

from flask.ext.jwt import JWT
jwt = JWT()

from flask.ext.mail import Mail
mail = Mail()

from flask.ext.security import Security
security = Security()

__all__ = ("db", "migrate", "jwt", "mail", "security", )
