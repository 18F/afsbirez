# -*- coding: utf-8 -*-
"""
    test.apis
    ~~~~~~~~~

    :author: 18F
    :copyright: (c) 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from app import api


class SecureView(api.BaseView):

    @api.secure_endpoint()
    def index(self):
        return {
            "secret": "shhhhhh, keep this quiet",
        }

def classy_api(app):
    """Create an Flask-Classy-based API on app"""
    bp = api.v1.create_blueprint('test', url_prefix='/api/tests')
    SecureView.register(bp)
    api.register_blueprint(app, bp)
