from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework.response import Response
from rest_framework import status
from rest_framework_proxy.views import ProxyView
from collections import OrderedDict
from copy import deepcopy
import collections
import dbm
import json
import tempfile
from unittest import mock

from django.test import TestCase
import django.core.mail
from django.core.files import uploadedfile

from sbirez.models import Firm, Naics, Proposal
from sbirez import api
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.utils import timezone

factory = APIRequestFactory()

def _fixture_user(self):
    """Authenticate as pre-existing user from test fixture.

    Returns user instance."""
    user_model = get_user_model()
    user = user_model.objects.get(email='r2d2@naboo.gov') # r2's password = 'bleep'
    self.client.force_authenticate(user=user)
    return user

class UserTests(APITestCase):

    def test_user_view_set(self):
        request = factory.get('/users/')
        response = Response(request)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # post user with good and complete parameter set
    def test_user_good_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        user = get_user_model().objects.get(email='a@b.com')
        self.assertEqual(user.email, 'a@b.com')

    # post user with poor password and complete parameter set
    def test_user_bad_password_missing_number_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'password', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['password'][0], 'Password must contain at least 1 digit.')

    def test_user_bad_password_missing_upper_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'password1', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['password'][0], 'Password must contain at least 1 uppercase letter.')

    def test_user_bad_password_missing_symbol_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'Password1', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['password'][0], 'Password must contain at least 1 special character.')

    def test_user_bad_password_too_short_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'pass&', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['password'][0], 'Password is too short')

    # created user can login via POST to get a JWT
    def test_user_can_login(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.post('/auth/',
            {'password':'passWord!234', 'email':'a@b.com'})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('token', response.data)

    def test_user_can_not_login_if_expired(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        user = get_user_model().objects.get(email='a@b.com')
        user.password_expires = timezone.now()
        user.save()
        response = self.client.post('/auth/',
            {'password':'passWord!234', 'email':'a@b.com'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['non_field_errors'][0], 'Password has expired.')

    # post user with empty parameter set
    def test_user_empty_create(self):
        response = self.client.post('/api/v1/users/', {})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user without password
    def test_user_missing_password_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user without email
    def test_user_missing_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'passWord!234', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user with existing email
    def test_user_existing_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user with bogus email
    def test_user_bad_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'passWord!234', 'email':'abdw', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user to update with good parameters and logged in
    def test_user_good_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'password':'PassWord!567', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual('b@c.com', user_after.email)

    # put user to update with no parameters
    def test_user_empty_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user to update with no parameters
    def test_user_empty_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    # put user with missing email
    def test_user_missing_email_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc','password':'234', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user with missing email
    def test_user_missing_email_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc','password':'PassWord!567', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    # put user with missing groups
    def test_user_missing_groups_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'password':'PassWord!567', 'email':'b@c.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual('b@c.com', user_after.email)

    # put user with missing groups
    def test_user_missing_groups_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'password':'PassWord!567', 'email':'b@c.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual('a@b.com', user_after.email)

    # put user with missing password
    def test_user_missing_password_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual('a@b.com', user.email)

    # put user with missing password
    def test_user_missing_password_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual('a@b.com', user.email)

    # put user that does not exist
    def test_user_bad_user_put(self):
        response = self.client.put('/api/v1/users/12312321/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # put user that does not exist
    def test_user_bad_user_alpha_put(self):
        response = self.client.put('/api/v1/users/abcdef/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # patch user to change email
    def test_user_good_patch_email(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {'email':'b@b.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertNotEqual(user.email, user_after.email)

    # patch user to change email
    def test_user_good_patch_email_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {'email':'b@b.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_user_empty_patch(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertEqual(user.email, user_after.email)

    def test_user_empty_patch_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_user_get_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.get('/api/v1/users/' + str(user.id) + '/');
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_user_get(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.get('/api/v1/users/' + str(user.id) + '/');
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.name, response.data['name'])
        self.assertEqual(user.email, response.data['email'])

    def test_user_list(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.get('/api/v1/users/');
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)

    def test_user_list_unauthed(self):
        response = self.client.get('/api/v1/users/');
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_group_view_set(self):
        request = factory.get('/groups/')
        response = Response(request)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # post two users with same name / avoid default firm creation error
    def test_two_users_same_name(self):
        self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a+1@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        user = get_user_model().objects.get(email='a+1@b.com')
        self.assertEqual(user.email, 'a+1@b.com')
        self.assertIn('abc', user.firm.name)

    # test password change endpoint
    def test_user_good_password_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': '432!droWssap', 'new_password2': '432!droWssap'})
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_user_bad_old_password_wrong_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'pass', 'new_password1': '432!droWssap', 'new_password2': '432!droWssap'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['old_password'][0], 'Invalid password')

    def test_user_bad_new_password_2_wrong_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': '432!droWssap', 'new_password2': 'password'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password2'][0], 'The two password fields didn\'t match.')

    def test_user_bad_password_missing_number_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': 'password', 'new_password2': 'password'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password1'][0], 'Password must contain at least 1 digit.')

    def test_user_bad_password_missing_upper_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': 'password1', 'new_password2': 'password1'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password1'][0], 'Password must contain at least 1 uppercase letter.')

    def test_user_bad_password_missing_symbol_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': 'Password1', 'new_password2': 'Password1'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password1'][0], 'Password must contain at least 1 special character.')

    def test_user_bad_password_too_short_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': 'pass&', 'new_password2': 'pass&'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password1'][0], 'Password is too short')

    def test_user_bad_password_not_different_enough_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': 'passWord!2345', 'new_password2': 'passWord!2345'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password1'][0],
            'Password must differ from the prior password by at least 4 characters')

    def test_user_bad_password_reused_password_change(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': 'passWord!234', 'new_password1': '432!droWssap', 'new_password2': '432!droWssap'})
        response = self.client.post('/rest-auth/password/change/',
            {'old_password': '432!droWssap', 'new_password1': 'passWord!234', 'new_password2': 'passWord!234'})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data['new_password1'][0],
            'Password can not have been one of the last 2 passwords')

_SAMPLE_SAM_API_RESPONSE = {
     'links': [{'href': 'https://api.data.gov/sam/v1/registrations?qterms=intellitech&start=1&length=10',
                'rel': 'self'}],
     'results': [{'cage': '1FUB9',
                  'duns': '003725520',
                  'dunsPlus4': '0000',
                  'expirationDate': '2015-09-02 09:13:51.000',
                  'hasDelinquentFederalDebt': False,
                  'hasKnownExclusion': False,
                  'legalBusinessName': 'INTELLITECH SYSTEMS INC',
                  'links': [{'href': 'https://api.data.gov/sam/v1/registrations/0037255200000',
                             'rel': 'details'}],
                  'samAddress': {'city': 'FAIRBORN',
                                 'country': 'USA',
                                 'line1': '3144 PRESIDENTIAL DRIVE',
                                 'stateOrProvince': 'OH',
                                 'zip': '45324',
                                 'zip4': '2039'},
                  'status': 'Active'},
                 {'cage': '6Z7N4',
                  'duns': '003725520',
                  'dunsPlus4': '0037',
                  'expirationDate': '2015-09-02 09:13:51.000',
                  'hasDelinquentFederalDebt': False,
                  'hasKnownExclusion': False,
                  'legalBusinessName': 'INTELLITECH SYSTEMS INC',
                  'links': [{'href': 'https://api.data.gov/sam/v1/registrations/0037255200037',
                             'rel': 'details'}],
                  'samAddress': {'city': 'FAIRBORN',
                                 'country': 'USA',
                                 'line1': '3144 PRESIDENTIAL DRIVE',
                                 'stateOrProvince': 'OH',
                                 'zip': '45324',
                                 'zip4': '2039'},
                  'status': 'Active'}]
    }

def mock_sam_api_server(*arg, **kwarg):
    if 'intellitech' in kwarg['searchterms'].lower():
        return Response(data=_SAMPLE_SAM_API_RESPONSE, status=status.HTTP_200_OK)
    else:
        return Response(data={'links':
                              [{'href': 'https://api.data.gov/sam/v1/registrations?' +
                                'qterms=snrgl&start=1&length=10',
                                'rel': 'self'}],
                              'results': []},
                        status=status.HTTP_200_OK)


class FirmTests(APITestCase):

    fixtures = ['naics.json', ]

    firm_data = {'name':'TestCo', 'tax_id':'12345', 'sbc_id':'12345',
         'duns_id':'12345', 'cage_code':'12345', 'website':'www.testco.com',
         'founding_year':'1982', 'phase1_count':'1', 'phase1_year':2014,
         'phase2_count': 1,'phase2_year': 2015, 'phase2_employees': 3,
         'current_employees':5, 'patent_count':1,
         'naics': ['111110',],
         'total_revenue_range':'$1000', 'revenue_percent':12,
         'address': OrderedDict([('street', '123 Test St.'), ('street2', ''),
             ('city', 'Dayton'), ('state', 'OH'), ('zip', '45334')]),
         'point_of_contact': OrderedDict([('name', 'Test User'),
             ('title', 'Engineer'), ('email', 'test@test.com'),
             ('phone', '555-5555'), ('fax', '554-5555')])
          }

    def create_user_and_auth(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'passWord!234', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'passWord!234'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])

    # get firm without being authed
    def test_firm_list_unauthed(self):
        response = self.client.get('/api/v1/firms/');
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_firm_get_bad_unauthed(self):
        response = self.client.get('/api/v1/firms/123/');
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_firm_good_create(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        self.assertEqual(firm.tax_id, '12345')
        self.assertEqual(firm.sbc_id, '12345')
        self.assertEqual(firm.duns_id, '12345')
        self.assertEqual(firm.cage_code, '12345')
        self.assertEqual(firm.website, 'www.testco.com')
        self.assertEqual(firm.founding_year, 1982)
        self.assertEqual(firm.phase1_count, 1)
        self.assertEqual(firm.phase1_year, 2014)
        self.assertEqual(firm.phase2_count, 1)
        self.assertEqual(firm.phase2_year, 2015)
        self.assertEqual(firm.phase2_employees, 3)
        self.assertEqual(firm.current_employees, 5)
        self.assertEqual(firm.patent_count, 1)
        self.assertEqual(firm.total_revenue_range, '$1000')
        self.assertEqual(firm.revenue_percent, 12)
        self.assertEqual(firm.point_of_contact.name, 'Test User')
        self.assertEqual(firm.point_of_contact.title, 'Engineer')
        self.assertEqual(firm.point_of_contact.email, 'test@test.com')
        self.assertEqual(firm.point_of_contact.phone, '555-5555')
        self.assertEqual(firm.point_of_contact.fax, '554-5555')
        self.assertEqual(firm.address.street, '123 Test St.')
        self.assertEqual(firm.address.street2, '')
        self.assertEqual(firm.address.city, 'Dayton')
        self.assertEqual(firm.address.state, 'OH')
        self.assertEqual(firm.address.zip, '45334')

    def test_firm_good_create_no_poc(self):
        self.create_user_and_auth()
        local_data = self.firm_data.copy()
        local_data.pop('point_of_contact')
        response = self.client.post('/api/v1/firms/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        self.assertEqual(firm.point_of_contact, None)

    def test_firm_good_create_no_address(self):
        self.create_user_and_auth()
        local_data = self.firm_data.copy()
        local_data.pop('address')
        response = self.client.post('/api/v1/firms/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        self.assertEqual(firm.address, None)

    def test_firm_bad_create_empty(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              {}, content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    def test_firm_good_create_unauthed(self):
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    # assign user to firm
    def test_firm_add_user(self):
        self.create_user_and_auth()
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(user.id, user_after.id)
        self.assertEqual(user_after.firm.id, firm.id)

    def test_firm_update_good(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = self.firm_data.copy()
        local_data['name'] = 'New Test Co.'
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        response = self.client.get('/api/v1/firms/' + str(firm.id) + '/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(firm.id, response.data['id'])
        self.assertEqual(response.data['name'], 'New Test Co.')

    def test_firm_update_empty(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              {}, content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    def test_firm_update_missing_fields(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = self.firm_data.copy()
        local_data.pop('name')
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    def test_firm_update_missing_address(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        firm = Firm.objects.get(name='TestCo')
        local_data = self.firm_data.copy()
        local_data.pop('address')
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_firm_update_missing_poc(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        firm = Firm.objects.get(name='TestCo')
        local_data = self.firm_data.copy()
        local_data.pop('point_of_contact')
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_firm_update_poc(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = self.firm_data.copy()
        local_data['name'] = 'New Test Co.'
        local_data['point_of_contact']['name'] = 'New Test User'
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        response = self.client.get('/api/v1/firms/' + str(firm.id) + '/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(firm.id, response.data['id'])
        self.assertEqual(response.data['name'], 'New Test Co.')
        self.assertEqual(response.data['point_of_contact']['name'], 'New Test User')

    def test_firm_update_address(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = self.firm_data.copy()
        local_data['name'] = 'New Test Co.'
        local_data['address']['street'] = '222 New St.'
        response = self.client.put('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        firm_after = Firm.objects.get(id=firm.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(firm.id, firm_after.id)
        self.assertEqual(firm_after.name, 'New Test Co.')
        self.assertEqual(firm_after.address.street, '222 New St.')

    def test_firm_patch_name(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = dict()
        local_data['name'] = 'New Test Co.'
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        firm_after = Firm.objects.get(id=firm.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(firm.id, firm_after.id)
        self.assertEqual(firm_after.name, 'New Test Co.')

    def test_firm_patch_address(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = dict()
        local_data['address'] = OrderedDict()
        local_data['address']['street'] = '222 New St.'
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        response = self.client.get('/api/v1/firms/' + str(firm.id) + '/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(firm.id, response.data['id'])
        self.assertEqual(response.data['address']['street'], '222 New St.')

    def test_firm_patch_poc(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = dict()
        local_data['point_of_contact'] = OrderedDict()
        local_data['point_of_contact']['name'] = 'New User Name'
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        firm_after = Firm.objects.get(id=firm.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(firm.id, firm_after.id)
        self.assertEqual(firm_after.point_of_contact.name, 'New User Name')

    def test_firm_patch_poc_unauthed(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = dict()
        local_data['point_of_contact'] = OrderedDict()
        local_data['point_of_contact']['name'] = 'New User Name'
        self.client.credentials()
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_firm_patch_address_unauthed(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        local_data = dict()
        local_data['address'] = OrderedDict()
        local_data['address']['street'] = '222 New St.'
        self.client.credentials()
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(local_data), content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    @mock.patch('rest_framework_proxy.views.ProxyView.get', mock_sam_api_server)
    def test_firm_search_existing_firm(self):
        response = self.client.get('/api/v1/firms/search/Intellitech')
        firm0 = response.data['results'][0]
        self.assertEqual('INTELLITECH SYSTEMS INC', firm0['legalBusinessName'])
        self.assertEqual('003725520', firm0['duns'])

    @mock.patch('rest_framework_proxy.views.ProxyView.get', mock_sam_api_server)
    def test_firm_search_nonexisting_firm(self):
        response = self.client.get('/api/v1/firms/search/no_firm_has_this_silly_name')
        self.assertEqual([], response.data['results'])

    def test_firm_patch_naics(self):
        initial_num_naics = Naics.objects.count()
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        patch_data = {"naics": ['111', '111110', ]}
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(patch_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        firm_after = Firm.objects.get(id=firm.id)
        naics = [n.code for n in firm_after.naics.all()]
        self.assertIn('111', naics)
        self.assertEqual(initial_num_naics, Naics.objects.count())

    def test_firm_patch_to_remove_naics(self):
        self.create_user_and_auth()
        response = self.client.post('/api/v1/firms/',
              json.dumps(self.firm_data), content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        firm = Firm.objects.get(name='TestCo')
        patch_data = {"naics": []}
        response = self.client.patch('/api/v1/firms/' + str(firm.id) + '/',
              json.dumps(patch_data), content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        firm_after = Firm.objects.get(id=firm.id)
        naics = [n.code for n in firm_after.naics.all()]
        self.assertEqual([], naics)


class TopicTests(APITestCase):

    fixtures = ['topictest.json']

    # Check that the topics index loads
    def test_topic_view_set(self):
        response = self.client.get('/api/v1/topics/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # Check that closed topics are excluded from default search
    def test_topic_default_count(self):
        response = self.client.get('/api/v1/topics/')
        self.assertEqual(response.data["count"], 0)

    # Check that we're getting all closed topics back when closed is True
    def test_topic_closed_count(self):
        response = self.client.get('/api/v1/topics/?closed=true')
        self.assertEqual(response.data["count"], 188)

    # Check that pagination is behaving itself
    # (this may qualify as 'testing the library instead of the code')
    def test_pagination_count(self):
        # 20 results on first page:
        response = self.client.get('/api/v1/topics/?closed=true')
        self.assertEqual(len(response.data["results"]), 20)
        # Total of ten pages:
        response = self.client.get('/api/v1/topics/?page=10&closed=true')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        # No more than ten pages:
        response = self.client.get('/api/v1/topics/?page=11&closed=true')
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # Check that a topic detail loads
    def test_topic_detail(self):
        response = self.client.get('/api/v1/topics/19/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # Check that topics are deleting properly
    # TODO: Auth
    def test_topic_detail_delete(self):
        response = self.client.delete('/api/v1/topics/9/')
        self.assertEqual(204, response.status_code)
        response = self.client.delete('/api/v1/topics/9/')
        self.assertEqual(404, response.status_code)

    # Check that trying to save a topic when not authenticated fails
    def test_save_topic_must_be_authenticated(self):
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_save_topic_for_user(self):
        user = _fixture_user(self)

        # get a topic
        response = self.client.get('/api/v1/topics/19/')
        # verify that is not yet saved
        self.assertFalse(response.data['saved'])

        # save the topic
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

        # check that the topic now shows as saved
        response = self.client.get('/api/v1/topics/19/')
        self.assertTrue(response.data['saved'])

    def test_unsave_unsaved_topic_again(self):
        # should not error even if trying to "unsave" a topic the user had not saved
        user = _fixture_user(self)
        response = self.client.delete('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)

    def test_unsave_topic(self):
        user = _fixture_user(self)
        # save a topic

        response = self.client.post('/api/v1/topics/19/saved/', {})
        # check that the topic now shows as saved
        response = self.client.get('/api/v1/topics/19/')
        self.assertTrue(response.data['saved'])

        # now unsave
        response = self.client.delete('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        response = self.client.get('/api/v1/topics/19/')
        self.assertFalse(response.data['saved'])

    # Permit saved topic to be "saved" again without error
    def test_resave_topic(self):
        user = _fixture_user(self)

        # save a topic
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

        # re-save
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

    def test_filter_for_nonexistent_saved_topics(self):
        # Filter for saved topics should not error even if this user has not saved any
        user = _fixture_user(self)
        response = self.client.get('/api/v1/topics/?closed=True&saved=True')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_filter_for_saved_topics(self):
        user = _fixture_user(self)

        # save the topic
        response = self.client.post('/api/v1/topics/19/saved/', {})

        # with `saved`=False, all topics should be returned
        response = self.client.get('/api/v1/topics/?closed=True&saved=False')
        self.assertGreater(response.data['count'], 1)
        # but with `saved`=True, only the topic we just saved should be returned
        response = self.client.get('/api/v1/topics/?closed=True&saved=True')
        self.assertEqual(response.data['count'], 1)

    def test_save_nonexistent_topic(self):
        # should throw 404
        user = _fixture_user(self)
        response = self.client.post('/api/v1/topics/2222/saved/', {})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    def unsave_nonexistent_topic(self):
        # should throw 404
        user = _fixture_user(self)
        response = self.client.delete('/api/v1/topics/2222/saved/', {})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)


class ElementTests(APITestCase):

    fixtures = ['elements.json', ]

    # Check that the element index loads
    def test_element_view_set(self):
        response = self.client.get('/api/v1/elements/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # Check that fixture workflow included in GET result
    def test_workflow_included(self):
        response = self.client.get('/api/v1/elements/')
        self.assertGreater(response.data["count"], 0)
        all_element_names = [n['name'] for n in response.data['results']]
        self.assertIn('holy_grail_workflow', all_element_names)

    def test_get_single_element(self):
        response = self.client.get('/api/v1/elements/1/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["name"], 'holy_grail_workflow')
        self.assertEqual(response.data['children'][0]['human'], 'What is thy name?')

    # Check that nested jargon is included
    def test_jargon_present(self):
        response = self.client.get('/api/v1/elements/8/')
        self.assertEqual(len(response.data['jargons']), 1)
        self.assertEqual(type(response.data['jargons'][0]),
                         collections.OrderedDict)


class JargonTests(APITestCase):

    fixtures = ['elements.json', ]

    # Check that the jargon index loads
    def test_jargon_view_set(self):
        response = self.client.get('/api/v1/jargons/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_get_single_jargon(self):
        response = self.client.get('/api/v1/jargons/1/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["name"], 'courage')


class PersonTests(APITestCase):

    fixtures = ['thin.json']

    # Check that the proposal index loads
    def test_person_view_set(self):
        response = self.client.get('/api/v1/persons/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["count"], 1)

    def test_single_person_get(self):
        response = self.client.get('/api/v1/persons/1/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['name'], 'Leia Organa')
        self.assertEqual(response.data['title'], 'Princess')


class AddressTests(APITestCase):

    fixtures = ['thin.json']

    # Check that the proposal index loads
    def test_address_view_set(self):
        response = self.client.get('/api/v1/addresses/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["count"], 2)


class ProposalTests(APITestCase):

    fixtures = ['thin.json', ]

    # Check that the proposal index loads
    def test_proposal_view_set(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["count"], 1)

    def test_get_one_proposal(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/2/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["data"]['holy_grail_workflow']['get_on_with_it']["quest_thy_name"],
            'Galahad')

    def test_good_update_proposal(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/2/')
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']
                         ['quest_thy_favorite_color'], 'yellow')
        response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']['quest_thy_favorite_color'] = 'green'
        response.data['data'] = json.dumps(response.data['data'])
        response = self.client.put('/api/v1/proposals/2/', response.data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

        response = self.client.get('/api/v1/proposals/2/')
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']
                         ['quest_thy_favorite_color'], 'green')

    def test_good_partial_update_proposal(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'owner': 2, 'firm': 1, 'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {"holy_grail_workflow":
                    {"get_on_with_it":
                    {"quest_thy_name": "Galahad",
                     "subquest": {
                         "quest_thy_quest": "To seek the Grail",
                         "quest_thy_favorite_color":
                             "#0000FF"}}}})
             })
        proposal_id = response.data['id']
        proposal = Proposal.objects.get(id=proposal_id)

        response = self.client.patch('/api/v1/proposals/%s/partial/' % proposal_id,
            {
             'data': json.dumps(
                    {"holy_grail_workflow" :
                    {"get_on_with_it":
                     {"subquest": {
                         "quest_thy_favorite_color": "green", }}}})
             })
        self.assertEqual(status.HTTP_200_OK, response.status_code)

        response = self.client.get('/api/v1/proposals/%s/' % proposal_id)
        new_proposal = Proposal.objects.get(id=proposal_id)
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']
                         ['quest_thy_favorite_color'], 'green')

        self.assertNotEqual(None, proposal.verified_at)
        self.assertEqual(None, proposal.submitted_at)
        self.assertEqual(None, new_proposal.verified_at)
        self.assertEqual(None, new_proposal.submitted_at)

    def test_bad_update_proposal(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/2/')
        response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']['quest_thy_favorite_color'] = 'blue'
        response.data['data'] = json.dumps(response.data['data'])
        response = self.client.put('/api/v1/proposals/2/', response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn('quest_thy_favorite_color: Lancelot already said blue',
                      response.data['non_field_errors'])

    # omit a required field
    def test_incomplete_post_raises_error(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/',
            {'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {
                     "holy_grail_workflow": {
                     "get_on_with_it": {
                     "subquest": {
                         "quest_thy_quest": "To seek the Grail",
                         "quest_thy_favorite_color":
                             "#0000FF"}}}})
             })
        self.assertIn('Required field quest_thy_name not found',
                      response.data['non_field_errors'])

    # omit multiple required fields
    def test_very_incomplete_post_raises_multiple_errors(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'workflow': 1,
             'title': 'Title', 'topic': 1, 'data': json.dumps(
                    {'holy_grail_workflow':
                    {'get_on_with_it':
                    {"subquest":
                     {"quest_thy_quest": "To seek the Grail", }}}})
            })
        self.assertIn('Required field quest_thy_name not found',
                      response.data['non_field_errors'])
        self.assertIn('Required field quest_thy_favorite_color not found',
                      response.data['non_field_errors'])

    # omit one field, get one wrong
    def test_incomplete_and_wrong_post(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'workflow': 1,
             'title': 'Title', 'topic': 1, 'data': json.dumps(
                    {'holy_grail_workflow':
                    {"get_on_with_it":
                    {"subquest": {
                     "quest_thy_quest": "To seek the Grail",
                     "quest_thy_favorite_color": "blue"}}}})
            })
        self.assertIn('Required field quest_thy_name not found',
                      response.data['non_field_errors'])
        self.assertIn('quest_thy_favorite_color: Lancelot already said blue',
                      response.data['non_field_errors'])

    # omit a required field, but with /partial
    def test_intentionally_incomplete_post(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/partial/',
            {'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {'holy_grail_workflow':
                    {"get_on_with_it":
                    {
                     "subquest": {
                         "quest_thy_quest": "To seek the Grail",
                         "quest_thy_favorite_color":
                             "#0000FF"}}}})
             })
        proposal = Proposal.objects.get(id=response.data['id'])

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(None, proposal.verified_at)
        self.assertEqual(None, proposal.submitted_at)

    # patch a deliberately incomplete proposal with /partial/
    def test_intentionally_incomplete_patch(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/partial/',
            {'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {'holy_grail_workflow':
                    {"get_on_with_it":
                    {
                     "subquest": {
                         "quest_thy_quest": "To seek the Grail",
                         "quest_thy_favorite_color":
                             "#0000FF"}}}})
             })
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        proposal = Proposal.objects.get(id=response.data['id'])

        response = self.client.patch('/api/v1/proposals/%d/partial/' %
                                     response.data['id'],
            {
             'data': json.dumps(
                    {'holy_grail_workflow':
                    {"get_on_with_it":
                    {
                     "subquest": {
                         "quest_thy_quest": "Grail-thingie.  Get.", }}}})
             })
        new_proposal = Proposal.objects.get(id=response.data['id'])
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']['quest_thy_quest'],
                         'Grail-thingie.  Get.')
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']
                         ['quest_thy_favorite_color'], "#0000FF")
        self.assertEqual(response.data['title'], 'Title!')
        self.assertEqual(None, proposal.verified_at)
        self.assertEqual(None, proposal.submitted_at)
        self.assertEqual(None, new_proposal.verified_at)
        self.assertEqual(None, new_proposal.submitted_at)

    # patch a subquest-less proposal with /partial/
    def test_intentionally_incomplete_patch_missing_component(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/partial/',
            {'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps({})})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

        response = self.client.patch('/api/v1/proposals/%d/partial/' %
                                     response.data['id'],
            {
             'data': json.dumps(
                    {
                    "holy_grail_workflow": {"get_on_with_it": {
                     "subquest": {
                         "quest_thy_quest": "Grail-thingie.  Get.", }}}})
             })
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']['quest_thy_quest'],
                         'Grail-thingie.  Get.')
        self.assertEqual(response.data['title'], 'Title!')


    def test_post_full_proposal(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'owner': 2, 'firm': 1, 'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {"holy_grail_workflow": {"get_on_with_it":
                    {"quest_thy_name": "Galahad",
                     "subquest": {
                         "quest_thy_quest": "To seek the Grail",
                         "quest_thy_favorite_color":
                             "#0000FF"}}}})
             })

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

        response = self.client.get('/api/v1/proposals/%s/' % response.data['id'])
        proposal = Proposal.objects.get(id=response.data['id'])

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['data']['holy_grail_workflow']['get_on_with_it']['subquest']['quest_thy_favorite_color'],
            "#0000FF")
        self.assertNotEqual(None, proposal.verified_at)
        self.assertEqual(None, proposal.submitted_at)

    def test_ownership_automatically_assigned(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'workflow': 1,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {"holy_grail_workflow": {"get_on_with_it":
                    {"quest_thy_name": "Galahad",
                     "subquest": {
                         "quest_thy_quest": "To seek the Grail",
                         "quest_thy_favorite_color":
                             "#0000FF"}}}})
             })

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

        response = self.client.get('/api/v1/proposals/%s/' % response.data['id'])
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['owner'], 2)
        self.assertEqual(response.data['firm'], 1)

    def _messages(self, messages):
        result = {}
        for message in messages:
            if True:
                pass
        return result

    # test that submitting a proposal sends an email
    def test_email_upon_submission(self):
        user = _fixture_user(self)
        response = _upload_death_star_plans(self)

        proposal = Proposal.objects.get(id=2)
        initial_emails_in_memory = len(django.core.mail.outbox)
        response = self.client.post('/api/v1/proposals/2/submit/')
        new_proposal = Proposal.objects.get(id=2)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(django.core.mail.outbox),
                         initial_emails_in_memory + 2)
        # Note: if mock_submission emails deleted, these 2s
        # will become 1s
        messages = {m.subject: m for m in django.core.mail.outbox[-2:]}
        notification_message = messages['Your SBIR proposal has been submitted']
        self.assertIn('submitted', notification_message.subject)
        self.assertIn('Title', notification_message.body)
        self.assertEqual(None, proposal.submitted_at)
        self.assertNotEqual(None, new_proposal.submitted_at)

    """
    Cannot seem to test pdf successfully; from the
    test api, jwt stubbornly refuses to show up in
    the request, thus cannot be passed on
    def test_get_pdf(self):
        user = _fixture_user(self)
        _upload_death_star_plans(self)

        response = self.client.post('/auth/',
            {'password':'bleep', 'email':'r2d2@naboo.gov'})
        token = response.data['token']

        response = self.client.get('/api/v1/proposals/2/pdf/?jwt=%s'
            % token)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn(b'Content-Type: application/pdf',
                      response.serialize())
                      """

    # test that submitting a proposal sends an
    # email mocking the upstream submission
    # delete this when actual upstream submission enabled
    def test_mock_submission_email(self):
        user = _fixture_user(self)
        response = _upload_death_star_plans(self)
        response = self.client.post('/api/v1/proposals/2/submit/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        messages = {m.subject: m for m in django.core.mail.outbox[-2:]}
        message = messages['SBIR proposal submission: Title']
        self.assertIn("'quest_thy_quest': 'To seek the Grail'",
                      message.body)
        self.assertEqual(message.attachments[0][1],
                         "Don't shoot the exhaust port!")

    def test_mock_submission_email_with_binary_attachment(self):
        user = _fixture_user(self)

        # create and attach a binary file: a dbm k:v database
        shipfile = tempfile.NamedTemporaryFile(suffix='db')
        ships = dbm.open(shipfile.name, 'n')
        ships['Falcon'] = 'Solo'
        ships['Serenity'] = 'Reynolds'
        ships.close()

        response = self.client.post('/api/v1/documents/', {
        'name': 'ships.db',
        'description': 'Keep an eye on these shady characters.',
        'file': shipfile,
        'proposals': 2})

        response = self.client.post('/api/v1/proposals/2/submit/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

        messages = {m.subject: m for m in django.core.mail.outbox[-2:]}
        message = messages['SBIR proposal submission: Title']
        self.assertEqual(len(message.attachments), 1)

        # verify that the database can be reconstituted
        # from the attachment
        shipfile = tempfile.NamedTemporaryFile(suffix='db')
        shipfile.write(message.attachments[0][1])
        ships = dbm.open(shipfile.name, 'r')
        self.assertEqual(ships['Falcon'], b'Solo')


minstrel_data = {
     'workflow': 1,
     'title': 'Title!', 'topic': 1, 'data': json.dumps(
         {"holy_grail_workflow":
             {"get_on_with_it":
                 {"quest_thy_name": "Galahad",
                  "knights": {
                      "Galahad": {
                          "is_courageous": True,
                          "how_courageous_exactly": 9,
                          },
                      "Robin": {
                          "is_courageous": False,
                          },
                      },
                  "minstrels": {
                      "0": {
                          "name": "Phil",
                          "instrument": "phlute",
                          "kg": 77.1,
                          "lb": 169.7,
                          },
                      "1": {
                          "name": "Sasha",
                          "instrument": "sackbut",
                          "kg": 55,
                          "lb": 121,
                          "sings": "True",
                          "singing_part": "bass",
                          },
                      }
                }
            }
         })  # end of `data`
     }

class StaticReportTests(APITestCase):

    fixtures = ['thin.json', ]

    def test_static_report(self):
        user = _fixture_user(self)
        proposal = Proposal.objects.get(id=2)
        self.assertEqual(proposal.report('holy_grail_workflow').__next__()['question'],
            'Holy Grail Workflow')

    def test_integer_multiplicity(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/', minstrel_data)
        proposal = Proposal.objects.get(id=response.data['id'])
        qs_and_answers = [(e.get('question'), e.get('answer'))
                          for e in proposal.report('holy_grail_workflow')]
        self.assertIn(('Name', 'Sasha'), qs_and_answers)
        self.assertIn(('Instrument', 'sackbut'), qs_and_answers)
        self.assertEqual(proposal.report('holy_grail_workflow').__next__()['question'],
            'Holy Grail Workflow')


class ProposalValidationTests(APITestCase):

    fixtures = ['thin.json', ]

    def test_correct_submission_is_valid(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/', minstrel_data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        proposal = Proposal.objects.get(id=response.data['id'])
        self.assertNotEqual(None, proposal.verified_at)
        self.assertEqual(None, proposal.submitted_at)

    def test_missing_required(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        del(data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["kg"])
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Required field kg not found']})

    def test_missing_xor_fails(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        del(data["data"]['holy_grail_workflow']['get_on_with_it']['minstrels']['1']['singing_part'])
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn('Required field singing_part not found',
                      response.data['non_field_errors'])

    def test_too_many_answers_for_xor_fails(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']['minstrels']['1']['singing_part_unidentifiable'] = True
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn('singing_part_unidentifiable should not be filled',
                      response.data['non_field_errors'])

    def test_validation_violated(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["kg"] = -22
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['kg: failed not_less_than']})

    def test_two_validation_failures(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["kg"] = -22
        del(data["data"]['holy_grail_workflow']['get_on_with_it']["knights"]["Galahad"]["how_courageous_exactly"])
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data,
                         {'non_field_errors': ['Required field how_courageous_exactly not found',
                                               'kg: failed not_less_than']})

    def test_correct_patch_is_valid(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/', minstrel_data)
        proposal_id = response.data['id']
        proposal = Proposal.objects.get(id=proposal_id)
        patch_data = {"data": json.dumps({"minstrels": {"0": {"kg": 95}}})}
        response = self.client.patch('/api/v1/proposals/%d/' % response.data["id"], patch_data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        new_proposal = Proposal.objects.get(id=proposal_id)
        self.assertNotEqual(None, proposal.verified_at)
        self.assertNotEqual(new_proposal.verified_at, proposal.verified_at)
        self.assertNotEqual(None, new_proposal.verified_at)

    def test_incorrect_patch_is_invalid(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/', minstrel_data)
        proposal_id = response.data['id']
        proposal = Proposal.objects.get(id=proposal_id)
        patch_data = {"data": json.dumps({"holy_grail_workflow":{"get_on_with_it":{"minstrels": {"1": {"kg": -95}}}}})}
        response = self.client.patch('/api/v1/proposals/%d/' % response.data["id"], patch_data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual({'non_field_errors': ['kg: failed not_less_than']}, response.data)
        new_proposal = Proposal.objects.get(id=proposal_id)
        self.assertNotEqual(None, proposal.verified_at)
        self.assertEqual(new_proposal.verified_at, proposal.verified_at)

    def test_patch_add_complete_is_valid(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/', minstrel_data)
        proposal_id = response.data['id']
        proposal = Proposal.objects.get(id=proposal_id)
        patch_data = {"data": json.dumps({"knights": {"2": {"is_courageous": True,
                                                            "how_courageous_exactly": 8}}})}
        response = self.client.patch('/api/v1/proposals/%d/' % response.data["id"], patch_data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        new_proposal = Proposal.objects.get(id=proposal_id)
        self.assertNotEqual(None, proposal.verified_at)
        self.assertNotEqual(new_proposal.verified_at, proposal.verified_at)
        self.assertNotEqual(None, new_proposal.verified_at)

    def test_patch_add_incomplete_is_invalid(self):
        user = _fixture_user(self)
        response = self.client.post('/api/v1/proposals/', minstrel_data)
        proposal_id = response.data['id']
        proposal = Proposal.objects.get(id=proposal_id)
        patch_data = {"data": json.dumps({"holy_grail_workflow": {"get_on_with_it": {"knights": {"Robin": {"is_courageous": True}}}}})}
        response = self.client.patch('/api/v1/proposals/%d/' % response.data["id"], patch_data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual({'non_field_errors': ['Required field how_courageous_exactly not found']},
                         response.data)
        new_proposal = Proposal.objects.get(id=proposal_id)
        self.assertNotEqual(None, proposal.verified_at)
        self.assertEqual(new_proposal.verified_at, proposal.verified_at)

    def test_element_type_phone_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["phone"] = "123-456-7890"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_phone_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["phone"] = "Pennsylvania 6-5000"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid phone']})

    def test_element_type_email_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["email"] = "phil@peasantry.com"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_email_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["email"] = "I am not literate"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid email']})

    def test_element_type_zip_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["zip"] = "12345"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_zip_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["zip"] = "12345678987654321"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid zip']})

    def test_element_type_integer_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["teeth"] = 17
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_integer_as_string_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["teeth"] = "17"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_integer_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["teeth"] = "Maybe"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid integer']})

    def test_element_type_float_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["teeth"] = 12.8
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid integer']})

    def test_element_type_float_as_string_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["teeth"] = "12.8"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid integer']})

    def test_element_type_percent_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["skill"] = 22
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_percent_as_string_validation_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["skill"] = "22"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_percent_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["skill"] = -22
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid percent']})

    def test_element_type_percent_as_string_validation_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]['holy_grail_workflow']['get_on_with_it']["minstrels"]["0"]["skill"] = "-22"
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid percent']})

    def test_element_type_percent_validation_greater_than_100_pass(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]["holy_grail_workflow"]["get_on_with_it"]["minstrels"]["0"]["skill"] = 122
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_element_type_percent_validation_greater_than_1000_fail(self):
        user = _fixture_user(self)
        data = deepcopy(minstrel_data)
        data["data"] = json.loads(data["data"])
        data["data"]["holy_grail_workflow"]["get_on_with_it"]["minstrels"]["0"]["skill"] = 1001
        data["data"] = json.dumps(data["data"])

        response = self.client.post('/api/v1/proposals/', data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(response.data, {'non_field_errors': ['Not a valid percent']})

def _upload_death_star_plans(test_instance, login=True):
    if login:
        user = _fixture_user(test_instance)

    # Write the death star plans
    nobothans = bytearray("Don't shoot the exhaust port!", "UTF-8")
    plans = uploadedfile.TemporaryUploadedFile(name='deathstarplans.txt',
        size=len(nobothans), charset='utf-8', content_type='text/plain')
    plans.write(nobothans)
    plans.seek(0)

    # Upload the plans to R2's memory banks
    response = test_instance.client.post('/api/v1/documents/', {
        'name': 'Secret Death Star Plans',
        'description': 'Many bothan spies died to bring us this information.',
        'file': plans,
        'proposals': 2})
    plans.close()

    return response


class DocumentTests(APITestCase):

    fixtures = ['thin.json']

    def test_document_upload(self):
        response = _upload_death_star_plans(self)

        # Confirm upload
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

        # Confirm read
        planid = response.data['id']
        response = self.client.get('/api/v1/documents/' + str(planid) + '/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data['firm'], 1)
        response = self.client.get('/api/v1/documents/%d/file/' % planid)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_document_upload_requires_auth(self):
        response = _upload_death_star_plans(self, login=False)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_document_download(self):
        response = _upload_death_star_plans(self)
        response = self.client.get('/api/v1/documents/%d/' % response.data['id'])
        document_number = response.data['id']
        version_number = response.data['versions'][0]
        response = self.client.get('/api/v1/documents/%d/file/' % document_number)
        self.assertEqual(response.get_mime_type(), 'text/plain')
        response = self.client.get('/api/v1/documentversions/%d/file/' % version_number)
        self.assertEqual(response.get_mime_type(), 'text/plain')

    def test_document_download_requires_auth(self):
        response = _upload_death_star_plans(self)
        # Undo the authentication that was used to upload the plans
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/v1/documents/%d/file/' % response.data['id'])
        # He says that he is the property of Obi-Wan Kenobi, a resident of these parts,
        # and it's a private message for him.
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_patch_file(self):
        response = _upload_death_star_plans(self)
        doc_url = '/api/v1/documents/%d/' % response.data['id']
        response = self.client.patch(doc_url)

        # create a new file to upload
        plans = open('newdeathstarplans.txt', 'wb')
        vuln = bytearray("small exhaust port just above the main port",
                         "UTF-8")
        plans.write(vuln)
        plans.close()

        plans = open('newdeathstarplans.txt', 'rb')
        response = self.client.patch(doc_url, {
            'file': plans, })
        plans.close()
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(response.data['versions']), 2)

    def test_authorization_required(self):
        response = self.client.get('/api/v1/documents/', )
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_list_documents(self):
        _upload_death_star_plans(self)
        response = self.client.get('/api/v1/documents/', )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        doc_names = [doc['name'] for doc in response.data['results']]
        self.assertIn('Secret Death Star Plans', doc_names)


class DocumentVersionTests(APITestCase):

    fixtures = ['thin.json']

    def test_get_document_version(self):
        response = _upload_death_star_plans(self)
        response = self.client.get('/api/v1/documents/%d/' %
                                   response.data['id'], )
        id = response.data['versions'][0]
        response = self.client.get('/api/v1/documentversions/%d/' % id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)


class PasswordHandlingTests(APITestCase):

    # how should the API react to nonexistent email addresses?

    def test_reset_nonexistent_user(self):
        response = self.client.post('/rest-auth/password/reset/',
                                    {'email': 'catherine.devlin+1@gmail.com'})
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_reset_bad_email_address(self):
        response = self.client.post('/rest-auth/password/reset/',
                                    {'email': '  this is not an email address  '})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual('Enter a valid email address.', response.data['email'][0])
