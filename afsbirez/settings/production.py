"""
TODO: CONFIGURE

Production settings for afsbirez project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

from .base import *
from .credentials import EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DJANGO_SECRET_KEY
from .credentials import SAM_API_KEY

import dj_database_url

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = DJANGO_SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['sbirez.cf.18f.us', 'sbirez.18f.gov']

DATABASES = {"default": dj_database_url.config()}

DJMAIL_REAL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
# store email credentials in `credentials.py` (outside version control)

REST_PROXY['API_KEY'] = SAM_API_KEY

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

AUTH_PASSWORD_HISTORY_COUNT = 10
AUTH_PASSWORD_LENGTH = 12
AUTH_PASSWORD_EXPIRATION_DAYS = 60
AUTH_PASSWORD_DIFFERENCE = 4

