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
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        user = get_user_model().objects.get(email='a@b.com')
        self.assertEqual(user.email, 'a@b.com')

    # created user can login via POST to get a JWT
    def test_user_can_login(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'123', 'email':'a@b.com', 'groups':[]})
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
            {'name':'abc','email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user without email
    def test_user_missing_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'123', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user with existing email
    def test_user_existing_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # post user with bogus email
    def test_user_bad_email_create(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc','password':'123', 'email':'abdw', 'groups':[]})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user to update with good parameters and logged in
    def test_user_good_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'password':'234', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual('b@c.com', user_after.email)

    # put user to update with no parameters
    def test_user_empty_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user to update with no parameters
    def test_user_empty_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    # put user with missing email
    def test_user_missing_email_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc','password':'234', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    # put user with missing email
    def test_user_missing_email_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc','password':'234', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    # put user with missing groups
    def test_user_missing_groups_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'password':'234', 'email':'b@c.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual('b@c.com', user_after.email)

    # put user with missing groups
    def test_user_missing_groups_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'password':'234', 'email':'b@c.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual('a@b.com', user_after.email)

    # put user with missing password
    def test_user_missing_password_put(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual('a@b.com', user.email)

    # put user with missing password
    def test_user_missing_password_put_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.put('/api/v1/users/' + str(user.id) + '/',
            {'name':'abc', 'email':'b@c.com', 'groups':[]})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual('a@b.com', user.email)

    # put user that does not exist
    def test_user_bad_user_put(self):
        response = self.client.put('/api/v1/users/12312321/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # put user that does not exist
    def test_user_bad_user_alpha_put(self):
        response = self.client.put('/api/v1/users/abcdef/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    # patch user to change email
    def test_user_good_patch_email(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
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
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {'email':'b@b.com'})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_user_empty_patch(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {})
        user_after = get_user_model().objects.get(id=user.id)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.id, user_after.id)
        self.assertEqual(user.email, user_after.email)

    def test_user_empty_patch_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.patch('/api/v1/users/' + str(user.id) + '/',
            {})
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_user_get_unauthed(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.get('/api/v1/users/' + str(user.id) + '/');
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_user_get(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        user = get_user_model().objects.get(email='a@b.com')
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['token'])
        response = self.client.get('/api/v1/users/' + str(user.id) + '/');
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(user.name, response.data['name'])
        self.assertEqual(user.email, response.data['email'])

    def test_user_list(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
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

    def _fixture_user(self):
        "Authenticate as pre-existing user from test fixture.  Returns user instance."
        user_model = get_user_model()
        user = user_model.objects.get(email='r2d2@naboo.gov') # r2's password = 'bleep'
        self.client.force_authenticate(user=user)
        return user

    def test_save_topic_for_user(self):
        user = self._fixture_user()

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
        user = self._fixture_user()
        response = self.client.delete('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)

    def test_unsave_topic(self):
        user = self._fixture_user()
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
        user = self._fixture_user()

        # save a topic
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

        # re-save
        response = self.client.post('/api/v1/topics/19/saved/', {})
        self.assertEqual(status.HTTP_206_PARTIAL_CONTENT, response.status_code)

    def test_filter_for_nonexistent_saved_topics(self):
        # Filter for saved topics should not error even if this user has not saved any
        user = self._fixture_user()
        response = self.client.get('/api/v1/topics/?closed=True&saved=True')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_filter_for_saved_topics(self):
        user = self._fixture_user()

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
        user = self._fixture_user()
        response = self.client.post('/api/v1/topics/2222/saved/', {})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

    def unsave_nonexistent_topic(self):
        # should throw 404
        user = self._fixture_user()
        response = self.client.delete('/api/v1/topics/2222/saved/', {})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)

