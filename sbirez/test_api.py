from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework.response import Response
from rest_framework import status

from django.test import TestCase

from sbirez import api
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

factory = APIRequestFactory()

class UserTests(APITestCase):

    def test_user_view_set(self):
        request = factory.get('/users/')
        response = Response(request)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # post user with good and complete parameter set
    def test_user_good_create(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        user = get_user_model().objects.get(email='a@b.com')
        self.assertEqual(user.email, 'a@b.com')

    # created user can login via POST to get a JWT
    def test_user_can_login(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.post('/auth/',
            {'password':'123', 'email':'a@b.com'})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('token', response.data)

    # post user with empty parameter set
    def test_user_empty_create(self):
        response = self.client.post('/api/v1/users/', {})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user without password
    def test_user_missing_password_create(self):
        response = self.client.post('/api/v1/users/',
            {'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user without email
    def test_user_missing_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user with existing email
    def test_user_existing_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user to update with good parameters
    def test_user_good_put(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'password':'234', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual('b@c.com', user_after.email)

    # put user to update with no parameters
    def test_user_empty_put(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user with missing email
    def test_user_missing_email_put(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'password':'234', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user with missing groups
    def test_user_missing_groups_put(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'password':'234', 'email':'b@c.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual('b@c.com', user_after.email)

    # put user with missing password
    def test_user_missing_password_put(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual('a@b.com', user.email)
        self.assertEqual('a@b.com', user.email)

    # put user that does not exist
    def test_user_bad_user_put(self):
        response = self.client.put('/api/v1/users/12312321/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # put user that does not exist
    def test_user_bad_user_alpha_put(self):
        response = self.client.put('/api/v1/users/abcdef/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # patch user to change email
    def test_user_good_patch_email(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {'email':'b@b.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertNotEqual(user.email, user_after.email)

    def test_user_empty_patch(self):
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertEqual(user.email, user_after.email)

    def test_group_view_set(self):
        request = factory.get('/groups/')
        response = Response(request)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

class TopicTests(APITestCase):

    fixtures = ['topictest.yaml']

    # Check that the topics index loads
    def test_topic_view_set(self):
        response = self.client.get('/api/v1/topics/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # Check that a topic detail loads
    def test_topic_detail(self):
        response = self.client.get('/api/v1/topics/19/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # Check that trying to save a topic when not authenticated fails
    def test_save_topic_must_be_authenticated(self):
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_save_topic_for_user(self):
        # create a user and login
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/',
            {'password':'123', 'email':'a@b.com'})
        user_model = get_user_model()
        user = user_model.objects.get(email='a@b.com')
        self.client.force_authenticate(user=user,
                                       token=response.data['token'])

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

    def test_unsave_topic(self):
        # create a user and login
        # TODO: just like the method above, this is SO not DRY
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/',
            {'password':'123', 'email':'a@b.com'})
        user_model = get_user_model()
        user = user_model.objects.get(email='a@b.com')
        self.client.force_authenticate(user=user,
                                       token=response.data['token'])

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


    # When a saved topic is saved again... TODO: what IS the desired response?
    def test_resave_topic(self):
        # create a user and login
        # TODO: just like the method above, this is SO not DRY
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/',
            {'password':'123', 'email':'a@b.com'})
        user_model = get_user_model()
        user = user_model.objects.get(email='a@b.com')
        self.client.force_authenticate(user=user,
                                       token=response.data['token'])

        # save a topic
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

        # re-save
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

    def test_filter_for_saved_topics(self):
        # create a user and login
        response = self.client.post('/api/v1/users/',
            {'password':'123', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/',
            {'password':'123', 'email':'a@b.com'})
        user_model = get_user_model()
        user = user_model.objects.get(email='a@b.com')
        self.client.force_authenticate(user=user,
                                       token=response.data['token'])
        # save the topic
        response = self.client.post('/api/v1/topics/19/saved/', {})

        # with `saved`=False, all topics should be returned
        response = self.client.get('/api/v1/topics/?closed=True&saved=False')
        self.assertGreater(response.data['count'], 1)
        # but with `saved`=True, only the topic we just saved should be returned
        response = self.client.get('/api/v1/topics/?closed=True&saved=True')
        self.assertEqual(response.data['count'], 1)


