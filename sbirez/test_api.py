from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework.response import Response
from rest_framework import status
from collections import OrderedDict
import json

from django.test import TestCase

from sbirez.models import Firm
from sbirez import api
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

factory = APIRequestFactory()


def _fixture_user(self):
    "Authenticate as pre-existing user from test fixture.  Returns user instance."
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

class FirmTests(APITestCase):
    firm_data = {'name':'TestCo', 'tax_id':'12345', 'sbc_id':'12345',
         'duns_id':'12345', 'cage_code':'12345', 'website':'www.testco.com',
         'founding_year':'1982', 'phase1_count':'1', 'phase1_year':2014,
         'phase2_count': 1,'phase2_year': 2015, 'phase2_employees': 3,
         'current_employees':5, 'patent_count':1,
         'total_revenue_range':'$1000', 'revenue_percent':12,
         'address': OrderedDict([('street', '123 Test St.'), ('street2', ''),
             ('city', 'Dayton'), ('state', 'OH'), ('zip', '45334')]),
         'point_of_contact': OrderedDict([('name', 'Test User'),
             ('title', 'Engineer'), ('email', 'test@test.com'),
             ('phone', '555-5555'), ('fax', '554-5555')])
          }

    def create_user_and_auth(self):
        response = self.client.post('/api/v1/users/',
            {'name':'abc', 'password':'123', 'email':'a@b.com', 'groups':[]})
        response = self.client.post('/auth/', {'email':'a@b.com', 'password':'123'})
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


class WorkflowTests(APITestCase):

    fixtures = ['workflowtest.json']

    # Check that the workflow index loads
    def test_workflow_view_set(self):
        response = self.client.get('/api/v1/workflows/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    # Check that fixture workflow included in GET result
    def test_workflow_included(self):
        response = self.client.get('/api/v1/workflows/')
        self.assertGreater(response.data["count"], 0)
        self.assertEqual(response.data["results"][0]['name'],
                         'dod_proposal_info')

    # Check that fixture result includes questions
    def test_questions_included_in_workflow(self):
        response = self.client.get('/api/v1/workflows/')
        self.assertGreater(response.data["count"], 0)
        self.assertEqual(response.data["results"][0]['name'],
                         'dod_proposal_info')

    def test_get_single_workflow(self):
        response = self.client.get('/api/v1/workflows/1/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["name"], 'dod_proposal_info')


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

    # Check that default value for `human` field working
    def test_workflow_included(self):
        response = self.client.get('/api/v1/elements/')
        all_humans = [n['human'] for n in response.data['results']]
        self.assertIn('Holy Grail Workflow', all_humans)



class PersonTests(APITestCase):

    fixtures = ['alldata.json']

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

    fixtures = ['alldata.json']

    # Check that the proposal index loads
    def test_address_view_set(self):
        response = self.client.get('/api/v1/addresses/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["count"], 2)


class ProposalTests(APITestCase):

    fixtures = ['alldata.json']

    def _deserialize_data(self, response):
        """An ugly hack for the fact that the 'data' field comes back
           serialized."""
        response.data['data'] = json.loads(response.data['data'])

    # Check that the proposal index loads
    def test_proposal_view_set(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["count"], 2)

    def test_get_one_proposal(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/2/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self._deserialize_data(response)
        self.assertEqual(response.data["data"]["quest_thy_name"],
            'Galahad')

    def test_good_update_proposal(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/2/')
        self._deserialize_data(response)
        self.assertEqual(response.data['data']['quest_thy_favorite_color'],
            'yellow')

        response.data['data']['quest_thy_favorite_color'] = 'green'
        response.data['data'] = json.dumps(response.data['data'])
        response = self.client.put('/api/v1/proposals/2/', response.data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

        response = self.client.get('/api/v1/proposals/2/')
        self._deserialize_data(response)
        self.assertEqual(response.data['data']['quest_thy_favorite_color'],
            'green')

    def test_bad_update_proposal(self):
        user = _fixture_user(self)

        response = self.client.get('/api/v1/proposals/2/')
        self._deserialize_data(response)
        response.data['data']['quest_thy_favorite_color'] = 'blue'
        response.data['data'] = json.dumps(response.data['data'])
        response = self.client.put('/api/v1/proposals/2/', response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn('quest_thy_favorite_color: Lancelot already said blue',
                      response.data['non_field_errors'])

    # omit a required field
    def test_incomplete_post_raises_error(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'owner': 2, 'firm': 1, 'workflow': 2,
             'title': 'Title', 'topic': 1, 'data': json.dumps(
                    {
                     "quest_thy_quest": "To seek the Grail",
                     "quest_thy_favorite_color": "#0000FF"})
            })
        self.assertIn('Required field quest_thy_name absent',
                      response.data['non_field_errors'])

    def test_post_full_proposal(self):
        user = _fixture_user(self)

        response = self.client.post('/api/v1/proposals/',
            {'owner': 2, 'firm': 1, 'workflow': 2,
             'title': 'Title!', 'topic': 1, 'data': json.dumps(
                    {"quest_thy_name": "Galahad",
                     "quest_thy_quest": "To seek the Grail",
                     "quest_thy_favorite_color": "#0000FF"})
            })
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

        response = self.client.get('/api/v1/proposals/%s/' % response.data['id'])
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self._deserialize_data(response)
        self.assertEqual(response.data['data']['quest_thy_favorite_color'],
            "#0000FF")

