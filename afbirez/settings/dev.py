import os

from .base import *
from django.utils.crypto import get_random_string

DEBUG = True
TEMPLATE_DEBUG = True

INTERNAL_IPS = ('127.0.0.1',)
SECRET_KEY = get_random_string(50)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": 'afsbirez',
        "USER": 'afsbirez',
        "PASSWORD": 'afsbirez',
        "HOST": '127.0.0.1',
    },
}

MEDIA_ROOT = './media/'
MEDIA_URL = '/media/'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny',),
    'PAGINATE_BY': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
}

STATIC_ROOT = 'sbirez/static/'
STATIC_URL = '/static/'

INSTALLED_APPS.append('django_extensions')

