from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework.response import Response

from django.test import TestCase

from sbirez import api
from django.contrib.auth.models import User, Group

factory = APIRequestFactory()

class UserTests(APITestCase):

    def test_user_view_set(self):
        request = factory.get('/users/')
        response = Response(request)
        self.assertEqual(200, response.status_code)

    # post user with good and complete parameter set
    def test_user_good_create(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(201, response.status_code)
        user = User.objects.get(username='xyz')
        self.assertEqual(user.username, 'xyz')
        self.assertEqual(user.email, 'a@b.com')

    # post user with empty parameter set
    def test_user_empty_create(self):
        response = self.client.post('/api/v1/users/', {})
        self.assertEqual(400, response.status_code)

    # post user without password
    def test_user_missing_password_create(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(400, response.status_code)

    # post user without username
    def test_user_missing_username_create(self):
        response = self.client.post('/api/v1/users/', 
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(400, response.status_code)

    # post user with existing username
    def test_user_existing_username_create(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(201, response.status_code)
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'b@c.com', 'groups':[]})
        self.assertEqual(400, response.status_code)

    # put user to update with good parameters
    def test_user_good_put(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'username':'abc', 'password':'234', 'email':'b@c.com', 'groups':[]})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(200, response.status_code)
        self.assertEqual('abc', user_after.username)
        self.assertEqual('b@c.com', user_after.email)

    # put user to update with no parameters 
    def test_user_empty_put(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(400, response.status_code)

    # put user with missing username
    def test_user_missing_username_put(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'password':'234', 'email':'b@c.com', 'groups':[]})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(400, response.status_code)
        self.assertEqual('xyz', user.username)
        self.assertEqual('a@b.com', user.email)

    # put user with missing groups
    def test_user_missing_groups_put(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'username':'abc', 'password':'234', 'email':'b@c.com'})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(200, response.status_code)
        self.assertEqual('xyz', user.username)
        self.assertEqual('a@b.com', user.email)

    # put user with missing password
    def test_user_missing_password_put(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'username':'abc', 'email':'b@c.com', 'groups':[]})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(400, response.status_code)
        self.assertEqual('xyz', user.username)
        self.assertEqual('a@b.com', user.email)

    # put user that does not exist
    def test_user_bad_user_put(self):
        response = self.client.put('/api/v1/users/12312321/',
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(404, response.status_code)

    # put user that does not exist
    def test_user_bad_user_alpha_put(self):
        response = self.client.put('/api/v1/users/abcdef/',
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(404, response.status_code)

    # patch user to change email
    def test_user_good_patch_email(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/', 
            {'email':'b@b.com'})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(200, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertNotEqual(user.email, user_after.email)

    # patch user to change username 
    def test_user_good_patch_username(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/', 
            {'username':'abc'})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(200, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertNotEqual(user.username, user_after.username)

    def test_user_empty_patch(self):
        response = self.client.post('/api/v1/users/', 
            {'username':'xyz', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = User.objects.get(username='xyz')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/', 
            {})
        user_after = User.objects.get(id=user.id)
        self.assertEqual(200, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertEqual(user.username, user_after.username)
        self.assertEqual(user.email, user_after.email)

    def test_group_view_set(self):
        request = factory.get('/groups/')
        response = Response(request)
        self.assertEqual(200, response.status_code)

    def test_topic_view_set(self):
        request = factory.get('/topics/')
        response = Response(request)
        self.assertEqual(200, response.status_code)
