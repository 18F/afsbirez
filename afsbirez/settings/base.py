"""
Django settings for afsbirez project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

import datetime

DATABASES = { }
# ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'custom_user',
    'sbirez',
    'django_assets',
    'rest_framework',
    'rest_auth',
    'djmail',
]

MIDDLEWARE_CLASSES = (
    'sslify.middleware.SSLifyMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'sbirez.auth_utils.ExpiringModelBackend',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny',),
    'PAGINATE_BY': 20,
    'PAGINATE_BY_PARAM': 'page_size',
    'MAX_PAGINATE_BY': 200,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'sbirez.utils.JSONWebTokenAuthenticationFlex',
    ),
}

REST_AUTH_SERIALIZERS = {
    'PASSWORD_RESET_CONFIRM_SERIALIZER': 'sbirez.auth_utils.PasswordResetConfirmSerializer',
    'PASSWORD_CHANGE_SERIALIZER': 'sbirez.auth_utils.PasswordChangeSerializer'
}

OLD_PASSWORD_FIELD_ENABLED = True
REST_SESSION_LOGIN = False

AUTH_PASSWORD_HISTORY_COUNT = 2 
AUTH_PASSWORD_LENGTH = 8
AUTH_PASSWORD_EXPIRATION_DAYS = 60
AUTH_PASSWORD_DIFFERENCE = 4

JWT_AUTH = {
    'JWT_RESPONSE_PAYLOAD_HANDLER':'sbirez.utils.jwt_response_payload_handler',
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=3000),
    'JWT_ALLOW_REFRESH': True,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),
}

ROOT_URLCONF = 'afsbirez.urls'

WSGI_APPLICATION = 'afsbirez.wsgi.application'

AUTH_USER_MODEL = 'sbirez.SbirezUser'

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = 'sbirez/static/'
MEDIA_ROOT = 'sbirez/media/'

STATICFILES_FINDERS = (
   "django.contrib.staticfiles.finders.FileSystemFinder",
   "django.contrib.staticfiles.finders.AppDirectoriesFinder",
   "django_assets.finders.AssetsFinder"
)

DEFAULT_FROM_EMAIL='catherine.devlin@gsa.gov'

EMAIL_BACKEND="djmail.backends.default.EmailBackend"

REST_PROXY = {
    'HOST': 'https://api.data.gov/sam/v1',
    }
