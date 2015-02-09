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
import pytest
import six
from jsonschema import Draft4Validator
from tests.factories import UserFactory

@pytest.fixture
def user(db):
    return UserFactory(password='myprecious')

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

    def test_root_index(self, testapi):
        resp = testapi.get('/api/tests/')
        resp.hal.links.should_not.be.empty

    def test_rel_index(self, testapi):
        resp = testapi.get("/api/tests/rels")
        resp.json.should_not.be.empty

    def test_rel_index_is_valid_json_schema(self, testapi):
        resp = testapi.get("/api/tests/rels")

        for schema in six.itervalues(resp.json):
            schema_errors = Draft4Validator.check_schema(schema)
            schema_errors.should.be.none

    def test_rel_get(self, testapi):
        resp = testapi.get("/api/tests/rels/foo")
        resp.json['properties'].should.have.key("name")
        resp.json['properties'].should.have.key("email")

    def test_jwt_log_in_returns_200_with_token(self, user, testapi):
        data = dict(username=user.email, password='myprecious')
        resp = testapi.post_json('/auth', data)
        assert resp.status_code == 200
        assert 'token' in resp.json
        return resp.json['token']

    @pytest.mark.usefixtures('db')
    def test_topic_search_accurate(self, db, testapi):
        resp = testapi.get('/api/tests/topics?q=security')
        resp.hal.links.should_not.be.empty
        for topic in resp.json['_embedded']['ea:topic']:
            assert (   'security' in topic['description'].lower()
                    or 'security' in topic['title'].lower()
                   )
        resp = testapi.get('/api/tests/topics?q=thereisnosuchword')
        assert len(resp.json['_embedded']['ea:topic']) == 0

    @pytest.mark.usefixtures('db')
    def test_single_topic(self, db, testapi):
        resp = testapi.get('/api/tests/topics/11')
        resp.hal.links.should_not.be.empty
        assert resp.json["id"] == 11
        assert 'title' in resp.json
        assert 'description' in resp.json


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

