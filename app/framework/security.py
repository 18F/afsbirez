# -*- coding: utf-8 -*-
"""
    sbirez.framework.security
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
import logging

from flask import current_app
from flask.ext.jwt import JWTError
from flask.ext.security.utils import verify_and_update_password
from werkzeug.local import LocalProxy

_log = logging.getLogger(__name__)
_security = LocalProxy(lambda: current_app.extensions['security'])
_datastore = LocalProxy(lambda: _security.datastore)

def authenticate(username, password):
    user = _datastore.get_user(username)
    if user and verify_and_update_password(password, user):
        _log.info("%s authenticated successfully", username)
        return user
    if not user:
        _log.warn("Authentication failed; unknown username %s", username)
    else:
        _log.warn("Authentication failed; invalid password for %s", username)


def load_user(payload):
    user = _datastore.get_user(payload['user_id'])
    if user and user.secret == payload['secret']:
        return user
    if user:
        raise JWTError('Invalid JWT', 'Invalid secret')


def make_payload(user):
    """Returns a dictionary to be encoded based on the user."""
    return {
        "user_id": user.id,
        "secret": user.secret
    }
