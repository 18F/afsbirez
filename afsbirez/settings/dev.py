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

DJMAIL_REAL_BACKEND="django.core.mail.backends.console.EmailBackend"
INSTALLED_APPS.append('django_extensions')

REST_PROXY['API_KEY'] = 'DEMO_KEY'

SSLIFY_DISABLE = True
