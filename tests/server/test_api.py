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

        some_results = testapi.get('/api/tests/topics?q=temperature&limit=100')
        assert (some_results.json['numFound'] ==
                len(some_results.json['_embedded']['ea:topic']))

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

    @pytest.mark.usefixtures('db')
    def test_links_url_encoded(self, db, testapi):
        results = testapi.get('/api/tests/topics?q=test software')
        assert 'test+software' in results.json['_links']['self']['href']

    @pytest.mark.usefixtures('db')
    def test_sort_order(self, db, testapi):
        asc = testapi.get('/api/tests/topics?order=asc')
        desc = testapi.get('/api/tests/topics?order=desc')
        assert desc.json['numFound'] >= 10
        assert asc.json['numFound'] == desc.json['numFound']
        assert asc.json['_embedded']['ea:topic'][0] != desc.json['_embedded']['ea:topic'][0]
        # these tests don't work b/c Python and PostgreSQL disagree on whether 'AF15-AT25  (AirForce)' > 'AF151-190  (AirForce)'
        # need to check that element 0 of ASC matches element -1 of DESC, but that will fail vs. the production dataset
        # until we can establish a filter that generates 1 < n < max limit rows for both test and production datasets
        #
        # assert asc.json['_embedded']['ea:topic'][0]['topic_number'] < asc.json['_embedded']['ea:topic'][1]['topic_number']
        # assert desc.json['_embedded']['ea:topic'][0]['topic_number'] > desc.json['_embedded']['ea:topic'][1]['topic_number']


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



class TestAPIGet:

    @pytest.mark.usefixtures('db')
    def test_response_format(self, testapi):
        resp = testapi.get('/api/tests/users/1')
        content_type = resp.headers['Content-Type']
        assert 'json' in content_type
        assert 'utf-8' in content_type

    @pytest.mark.usefixtures('db')
    def test_get_one_user_by_id(self, testapi):
        resp = testapi.get('/api/tests/users/1')
        assert resp.status_code == 400
        assert "email" in resp.json
        assert "@" in resp.json['email']

    @pytest.mark.usefixtures('db')
    def test_get_multi_users(self, testapi):
        resp = testapi.get('/api/tests/users')
        assert resp.status_code == 400
        assert "numFound" in resp.json
        assert "_embedded" in resp.json
        for usr in resp.json['_embedded']['ea:user']:
            assert "email" in usr

    @pytest.mark.usefixtures('db')
    def test_get_nonexistent_fails(self, testapi):
        resp = testapi.get('/api/tests/users/456789')
        assert resp.status_code == 404


class TestAPIUserCRUD:

    @pytest.mark.usefixtures('db')
    def test_user_created(self, testapi):
        data = dict(email="jane.shepard@normandysr2.alliance.mil",
                    password="15omnigel")
        resp = testapi.post('/api/tests/users', data)
        assert resp.status_code == 201   # 201 Created
        assert 'Location' in resp.headers
        assert 'users/' in resp.headers['Location']

        assert "id" in resp.json
        assert resp.json['email'] == "jane.shepard@normandysr2.alliance.mil"

    @pytest.mark.usefixtures('db')
    def test_email_required(self, testapi):
        data = dict(name='Jane Shepard',
                    password="15omnigel")
        resp = testapi.post('/api/tests/users', data)
        assert resp.status_code == 500

    @pytest.mark.usefixtures('db')
    def test_put_nonexistent_user_creates(self, testapi):
        """PUT works like POST when record does not exist"""
        data = dict(id=123, email="jane.shepard@normandysr2.alliance.mil",
                    password="15omnigel")
        resp = testapi.put('/api/tests/users/123', data)
        assert resp.status_code == 201   # 201 Created
        assert 'Location' in resp.headers
        assert 'users/123' in resp.headers['Location']

    @pytest.mark.usefixtures('db')
    def test_user_replaced(self, testapi):
        """PUT replaces existing record completely"""
        data = dict(email="jane@normandysr2.alliance.mil",
                    password="15omnigel", title='Commander')
        resp = testapi.post('/api/tests/users', data)

        data = dict(email="jane.shepard@normandysr2.alliance.mil",
                    password="15omnigel", )
        resp = testapi.put(resp.headers['Location'], data)
        assert resp.json['email'] == "jane.shepard@normandysr2.alliance.mil"
        assert resp.json['title'] is None

    @pytest.mark.usefixtures('db')
    def test_user_updated(self, testapi):
        """PATCH - updates, leaving unspecified fields unchanged"""
        data = dict(email="jane@normandysr2.alliance.mil",
                    password="15omnigel", title='Commander')
        resp = testapi.post('/api/tests/users', data)

        data = dict(email="jane.shepard@normandysr2.alliance.mil",)
        resp = testapi.patch(resp.headers['Location'], data)
        assert resp.json['email'] == "jane.shepard@normandysr2.alliance.mil"
        assert resp.json['title'] == 'Commander'

    @pytest.mark.usefixtures('db')
    def test_update_nonexistent_user_fails(self, testapi):
        data = dict(email="jane.shepard@normandysr2.alliance.mil",)
        resp = testapi.patch('/api/tests/users/456789', data)
        assert resp.status_code == 404

    @pytest.mark.usefixtures('db')
    def test_user_deleted(self, testapi):
        data = dict(email="jane@normandysr2.alliance.mil",
                    password="15omnigel", title='Commander')
        resp = testapi.post('/api/tests/users', data)
        loc = resp.headers['Location']

        resp = testapi.delete(loc)
        assert resp.status_code == 204

        resp = testapi.get(loc)
        assert resp.status_code == 404

    @pytest.mark.usefixtures('db')
    def test_passwords_hashed_with_salt(self, testapi):
        data = dict(email="jane.shepard@normandysr2.alliance.mil",
                    password="15omnigel", )
        resp = testapi.post('/api/tests/users', data)
        passwd = resp.json['password']
        assert len(passwd) > len("15omnigel")
        assert passwd != hashlib.md5(passwd.encode('utf8')).digest()

