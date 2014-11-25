# -*- coding: utf-8 -*-
"""
    tests.settings
    ~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""

DEBUG = False
TESTING = False
SECRET_KEY = 'testing-secret-key'

CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES_EXCEPTIONS=True
BROKER_BACKEND='memory'

SQLALCHEMY_POOL_SIZE = None
SQLALCHEMY_POOL_TIMEOUT = None
SQLALCHEMY_POOL_RECYCLE = None
SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

SECURITY_PASSWORD_HASH = 'plaintext'
SECURITY_CONFIRMABLE = False
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = False
SECURITY_CHANGEABLE = True
SECURITY_TRACKABLE = True
SECURITY_FLASH_MESSAGES = True
SECURITY_SEND_PASSWORD_CHANGE_EMAIL = False

JWT_AUTH_HEADER_PREFIX = 'Bearer'
