"""
TODO: CONFIGURE

Production settings for afbirez project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

from .base import *
import dj_database_url

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'w^nc2bs303zk7&_!!-n@ip_+6tb+f8o5ln#kmxzh#=k9@1f2x#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False 

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['sbirez.cf.18f.us']

DATABASES = {"default": dj_database_url.config()}
