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
from werkzeug.routing import ValidationError

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
        assert 'objective' in resp.json
        assert 'agency' in resp.json
        assert 'topic_number' in resp.json
        assert 'solicitation_id' in resp.json
        assert 'url' in resp.json
        assert 'program' in resp.json
        assert 'pre_release_date' in resp.json
        assert 'proposals_begin_date' in resp.json
        assert 'proposals_end_date' in resp.json
        assert 'days_to_close' in resp.json
        assert 'status' in resp.json
        assert 'areas' in resp.json
        assert isinstance(resp.json["areas"], list)
        assert 'phases' in resp.json
        assert isinstance(resp.json["phases"], list)
        assert 'references' in resp.json
        assert isinstance(resp.json["references"], list)
        assert 'keywords' in resp.json
        assert isinstance(resp.json["keywords"], list)


    @pytest.mark.usefixtures('db')
    def test_result_limit(self, db, testapi):
        # test limiting to two records
        resp = testapi.get('/api/tests/topics?limit=2')
        assert len(resp.json['_embedded']['ea:topic']) == 2

        # test default limit
        # default limit is actually 20, but our test data set is not that large
        resp = testapi.get('/api/tests/topics')
        assert len(resp.json['_embedded']['ea:topic']) >= 10

        # reject excessive demand for one... million... records
        with pytest.raises(Exception):
            resp = testapi.get('/api/tests/topics?limit=1000000')

        # reject nonsensical limit
        with pytest.raises(Exception):
            resp = testapi.get('/api/tests/topics?limit=-34.2')

    @pytest.mark.usefixtures('db')
    def test_result_start(self, db, testapi):
        resp1 = testapi.get('/api/tests/topics?start=1&limit=6')
        resp2 = testapi.get('/api/tests/topics?start=4&limit=3')
        assert resp2.json['_embedded']['ea:topic'] == resp1.json['_embedded']['ea:topic'][3:]

        # reject negative start point
        with pytest.raises(Exception):
            resp = testapi.get('/api/tests/topics?start=-22')

        # excessive start permitted, but no records result
        resp = testapi.get('/api/tests/topics?start=1000000')
        assert len(resp.json['_embedded']['ea:topic']) == 0

    @pytest.mark.usefixtures('db')
    def test_numFound(self, db, testapi):
        all_results = testapi.get('/api/tests/topics?start=1&limit=6')
        assert 'numFound' in all_results.json
        assert all_results.json['numFound'] >= 10

    @pytest.mark.usefixtures('db')
    def test_links_present(self, db, testapi):
        results = testapi.get('/api/tests/topics?start=1&limit=6')
        assert '_links' in results.json

        assert 'self' in results.json['_links']
        selflink = results.json['_links']['self']['href']
        assert '/topics' in selflink
        assert 'limit=6' in selflink

        assert 'prev' not in results.json['_links']

        assert 'next' in results.json['_links']
        assert 'start=7' in results.json['_links']['next']['href']

        results = testapi.get('/api/tests/topics?start=7&limit=6')
        assert 'prev' in results.json['_links']
        assert 'start=1' in results.json['_links']['prev']['href']


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

