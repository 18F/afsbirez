import os

class Config(object):
    """
    Configuration base, for all environments.
    """
    DEBUG = False
    TESTING = False
    SECRET_KEY = "secret"
    CSRF_ENABLED = True

class ProductionConfig(Config):
    #TODO
    pass

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://afsbirez:afsbirez@localhost:5432/afsbirez_dev'
    DEBUG = True

class TestingConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://afsbirez:afsbirez@localhost:5432/afsbirez_test'
    TESTING = True