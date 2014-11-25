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

class SecureResource(api.BaseResource):

    @api.secure_endpoint()
    def get(self):
        return {
            "secret": "shhhhhh, keep this quiet",
        }


def classy_api(app):
    """Create an Flask-Classy-based API on app"""
    bp = api.v1.create_blueprint('test', url_prefix='/api/tests')
    SecureView.register(bp)
    api.register_blueprint(app, bp)


def restful_api(app):
    """Create an Flask-RESTful-based API on app"""
    api_ext = app.extensions['classy_api']
    api_ext.add_resource(api.v1.TodosResource, '/api/tests/todos', endpoint='todos_api')
    api_ext.add_resource(api.v1.TodoResource, '/api/tests/todos/<int:id>', endpoint='todo_api')
    api_ext.add_resource(SecureResource, '/api/tests/secure', endpoint='secure')
