from .dev import *

# INTERNAL_IPS = ('127.0.0.1',)  TODO: ?

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": 'postgres',
        "USER": 'postgres',
        "HOST": 'db',
        "PORT": 5432,
    },
}
