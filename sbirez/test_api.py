from rest_framework.test import APIRequestFactory
from rest_framework.response import Response

from django.test import TestCase

from sbirez import api
from django.contrib.auth.models import User, Group

factory = APIRequestFactory()

class UserTests(TestCase):

    def test_user_view_set(self):
        request = factory.get('/users/')
        response = Response(request)
        self.assertEqual(200, response.status_code)

    def test_group_view_set(self):
        request = factory.get('/groups/')
        response = Response(request)
        self.assertEqual(200, response.status_code)