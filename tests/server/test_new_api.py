# -*- coding: utf-8 -*-
"""
    tests.test_api
    ~~~~~~~~~~~~~~

    Test API

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
import copy
import pytest
import json
from jsonschema import Draft4Validator
from tests.factories import TodoFactory, UserFactory

@pytest.fixture
def user(db):
    return UserFactory(password='myprecious')

@pytest.fixture
def todos(db):
    return [TodoFactory(title='todo #{0}'.format(str(i+1))) for i in range(2)]


class TestAPI:
    """
    Tests both Flask-Classy and Flask-RESTful based APIs.  The `testapi` fixture
    will test each test function twice: `api_app0`==Classy, `api_app1`==RESTful.
    """

    def test_not_found(self, testapi):
        resp = testapi.get("/api/some-path-that-does-not-exist", expect_errors=True)
        assert resp.status_code == 404
        assert resp.json['status'] == 404
        assert 'Not Found' in resp.json['message']

    def test_not_found_with_envelope(self, testapi):
        resp = testapi.get("/api/non-existent-path?envelope=true", expect_errors=True)
        assert resp.status_code == 200
        assert resp.json['status'] == 404
        assert 'Not Found' in resp.json['data']['message']

    def test_not_found_with_callback(self, testapi):
        resp = testapi.get("/api/non-existent-path?callback=myfunc", expect_errors=True)
        assert resp.status_code == 200
        assert resp.json['status'] == 404
        assert 'Not Found' in resp.json['data']['message']

    def test_todos_index(self, todos, testapi):
        resp = testapi.get("/api/tests/todos")
        assert isinstance(resp.json['todos'], list)
        assert len(resp.json['todos']) == 2

    def test_todos_post(self, user, testapi):
        token = self.test_jwt_log_in_returns_200_with_token(user, testapi)
        resp = testapi.post_json("/api/tests/todos", {"title": "todo #1"}, headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        assert resp.status_code == 201
        assert 'id' in resp.json

    def test_todos_get(self, todos, testapi):
        resp = testapi.get("/api/tests/todos/1")
        assert resp.json['title'] == 'todo #1'
        assert resp.json['completed'] == False

    def test_todos_put(self, user, testapi):
        token = self.test_jwt_log_in_returns_200_with_token(user, testapi)
        resp = testapi.post_json("/api/tests/todos", {"title": "todo #1"}, headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        assert resp.status_code == 201
        assert 'id' in resp.json
        data = copy.copy(resp.json)
        data['completed'] = True
        uri = "/api/tests/todos/{0}".format(resp.json['id'])
        resp = testapi.put_json(uri, data, headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        assert resp.status_code == 200
        assert resp.json['completed'] == True

    def test_todos_delete(self, user, todos, testapi):
        token = self.test_jwt_log_in_returns_200_with_token(user, testapi)
        resp = testapi.delete("/api/tests/todos/{0}".format(todos[0].id), headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        resp.status_code == 204
        resp = testapi.delete_json("/api/tests/todos/{0}".format(todos[0].id), headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        resp.status_code == 204

    def test_rel_index(self, testapi):
        resp = testapi.get("/api/tests/rels")
        resp.json.should_not.be.empty

    def test_rel_index_is_valid_json_schema(self, testapi):
        resp = testapi.get("/api/tests/rels")

        for schema in resp.json.itervalues():
            schema_errors = Draft4Validator.check_schema(schema)
            schema_errors.should.be.none

    def test_rel_get(self, testapi):
        resp = testapi.get("/api/tests/rels/foo")
        resp.json['properties'].should.have.key("name")
        resp.json['properties'].should.have.key("email")

    def test_todos_patch(self, todos, testapi):
        uri = "/api/tests/todos/{0}".format(todos[0].id)
        resp = testapi.patch_json(uri, {"completed": True}, expect_errors=True)
        assert resp.status_code == 405

    def test_unsupported_media(self, testapi):
        """Non-JSON POSTs should fail with a 415 - Unsupported Media Type"""
        resp = testapi.post("/api/tests/todos", {"title": "something"},
                            expect_errors=True)
        assert resp.status_code == 415

    def test_enveloped_todos_index(self, todos, testapi):
        resp = testapi.get("/api/tests/todos?envelope=true")
        assert isinstance(resp.json, dict)
        assert resp.json['status'] == resp.status_code
        assert len(resp.json['data']['todos']) == 2

    def test_jwt_log_in_returns_200_with_token(self, user, testapi):
        data = dict(username=user.email, password='myprecious')
        resp = testapi.post_json('/auth', data)
        assert resp.status_code == 200
        assert 'token' in resp.json
        return resp.json['token']


class TestAPILoggingIn:

    def test_jwt_log_in_returns_200_with_token(self, user, testapi):
        data = dict(username=user.email, password='myprecious')
        resp = testapi.post_json('/auth', data)
        assert resp.status_code == 200
        assert 'token' in resp.json
        return resp.json['token']

    def test_secure_endpoint_fails_without_token(self, user, testapi):
        resp = testapi.get("/api/tests/secure", expect_errors=True)
        assert resp.status_code == 401

    def test_secure_endpoint_succeeds_with_jwt_token(self, user, testapi):
        token = self.test_jwt_log_in_returns_200_with_token(user, testapi)
        resp = testapi.get("/api/tests/secure", headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        assert resp.status_code == 200
        assert 'secret' in resp.json

    def test_secure_endpoint_fails_after_user_reset_secret(self, user, testapi):
        token = self.test_jwt_log_in_returns_200_with_token(user, testapi)
        resp = testapi.get("/api/tests/secure", headers={
            "Authorization": "Bearer {token}".format(token=token),
        })
        assert resp.status_code == 200
        assert 'secret' in resp.json
        user.reset_secret()
        resp = testapi.get("/api/tests/secure", headers={
            "Authorization": "Bearer {token}".format(token=token),
        }, expect_errors=True)
        assert resp.status_code == 400
        assert resp.json['error'] == 'Invalid JWT'
        assert resp.json['description'] == 'Invalid secret'

