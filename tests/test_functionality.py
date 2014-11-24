# -*- coding: utf-8 -*-
"""
    tests.test_functionality
    ~~~~~~~~~~~~~~~~~~~~~~~~

    Test basic login and registration functionality

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
import pytest
from flask import url_for
from flask.ext.security.utils import verify_password

from sbirez.models.users import User
from .factories import UserFactory

@pytest.fixture
def user(db):
    return UserFactory(password='myprecious')

class TestLoggingIn:

    def test_jwt_log_in_returns_200_with_token(self, user, testapp):
        data = dict(username=user.email, password='myprecious')
        res = testapp.post_json('/auth', data)
        assert res.status_code == 200
        assert 'token' in res.json

    def test_log_in_returns_200_with_email_on_page(self, user, testapp):
        # Goes to homepage
        res = testapp.get("/")
        # Clicks Login link
        res = res.click("Login")
        # Fills out login form
        form = res.forms['login_form']
        form['email'] = user.email
        form['password'] = 'myprecious'
        # Submits
        res = form.submit().follow()
        assert res.status_code == 200
        assert user.email in res

    def test_sees_login_link_on_log_out(self, user, testapp):
        res = testapp.get("/login")
        # Fills out login form on the login page
        form = res.forms['login_form']
        form['email'] = user.email
        form['password'] = 'myprecious'
        # Submits
        res = form.submit().follow()
        res = testapp.get(url_for('security.logout')).follow()
        # sees login link
        assert url_for('security.login') in res

    def test_sees_error_message_if_password_is_incorrect(self, user, testapp):
        # Goes to homepage
        res = testapp.get("/login")
        # Fills out login form, password incorrect
        form = res.forms['login_form']
        form['email'] = user.email
        form['password'] = 'wrong'
        # Submits
        res = form.submit()
        # sees error
        assert "Invalid password" in res

    def test_sees_error_message_if_username_doesnt_exist(self, user, testapp):
        # Goes to homepage
        res = testapp.get("/login")
        # Fills out login form with an unknown email
        form = res.forms['login_form']
        form['email'] = 'unknown'
        form['password'] = 'myprecious'
        # Submits
        res = form.submit()
        # sees error
        assert "user does not exist" in res

    def test_auth_jwt_token_succeeds_with_logged_in_user_and_json_post(self, user, testapp):
        self.test_log_in_returns_200_with_email_on_page(user, testapp)
        resp = testapp.post_json("/auth/jwt/token", {})
        assert resp.status_code == 200
        assert 'token' in resp.json

    def test_auth_jwt_token_fails_with_logged_in_user_and_non_json_post(self, user, testapp):
        self.test_log_in_returns_200_with_email_on_page(user, testapp)
        resp = testapp.post("/auth/jwt/token", {}, expect_errors=True)
        assert resp.status_code == 415

    def test_auth_jwt_token_fails_without_logged_in_user(self, user, testapp):
        resp = testapp.post_json("/auth/jwt/token", {}, expect_errors=True)
        assert resp.status_code == 401


class TestRegistering:

    def test_can_register(self, user, testapp):
        old_count = len(User.all())
        # Goes to homepage
        res = testapp.get("/")
        # Clicks Create Account button
        res = res.click("Login")
        res = res.click("register")
        # Fills out the form
        form = res.forms["register_form"]
        form['email'] = 'foo@bar.com'
        form['password'] = 'secret'
        form['password_confirm'] = 'secret'
        # Submits
        res = form.submit().follow()
        assert res.status_code == 200
        # A new user was created
        assert len(User.all()) == old_count + 1

    def test_sees_error_message_if_the_password_is_too_short(self, user, testapp):
        # Goes to registration page
        res = testapp.get(url_for("security.register"))
        # Fills out registration form, but password is too short
        form = res.forms["register_form"]
        form['email'] = 'foo@bar.com'
        form['password'] = 'short'
        form['password_confirm'] = 'short'
        # Submits
        res = form.submit()
        # sees error
        assert "Password must be at least 6 characters" in res

    def test_sees_error_message_if_passwords_dont_match(self, user, testapp):
        # Goes to registration page
        res = testapp.get(url_for("security.register"))
        # Fills out form, but passwords don't match
        form = res.forms["register_form"]
        form['email'] = 'foobar'
        form['email'] = 'foo@bar.com'
        form['password'] = 'secret'
        form['password_confirm'] = 'secrets'
        # Submits
        res = form.submit()
        # sees error message
        assert "Passwords do not match" in res

    def test_sees_error_message_if_user_already_registered(self, user, testapp):
        user = UserFactory(active=True)  # A registered user
        user.save()
        # Goes to registration page
        res = testapp.get(url_for("security.register"))
        # Fills out form, but username is already registered
        form = res.forms["register_form"]
        form['email'] = user.email
        form['password'] = 'secret'
        form['password_confirm'] = 'secret'
        # Submits
        res = form.submit()
        # sees error
        assert "is already associated with an account" in res
