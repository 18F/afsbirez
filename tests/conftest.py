# -*- coding: utf-8 -*-
"""
    tests.conftest
    ~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
import pytest
from webtest import TestApp

from app import api
from app import frontend
from app.framework.sql import db as _db
from .settings import TestingConfig
from .apis import classy_api
from .factories import UserFactory
from webtest import TestResponse
from dougrain import Document

#monkey patch the TestResponse to return a HAL dougrain object
def hal(self):
        """
        Return the response as a JSON response.  You must have `simplejson
        <http://goo.gl/B9g6s>`_ installed to use this, or be using a Python
        version with the json module.

        The content type must be one of json type to use this.
        """
        if not self.content_type.endswith(('+json', '/json')):
            raise AttributeError(
                "Not a JSON response body (content-type: %s)"
                % self.content_type)
        return Document.from_string(self.testbody)

TestResponse.hal = property(hal)

@pytest.yield_fixture(scope='function')
def app():
    _app = frontend.create_app(TestingConfig)
    ctx = _app.test_request_context()
    ctx.push()
    yield _app
    ctx.pop()

@pytest.yield_fixture(scope='function')
def apiapp(request):
    _app = api.create_app(TestingConfig)
    classy_api(_app)
    ctx = _app.test_request_context()
    ctx.push()
    yield _app
    ctx.pop()

@pytest.fixture(scope='function')
def testapp(app):
    """A Webtest app."""
    return TestApp(app)

@pytest.fixture(scope='function')
def testapi(apiapp):
    """A Webtest app."""
    return TestApp(apiapp)

@pytest.yield_fixture(scope='function')
def db(app):
    _db.app = app
    with app.app_context():
        _db.create_all()
    yield _db
    _db.drop_all()

@pytest.fixture
def user(db):
    return UserFactory()
