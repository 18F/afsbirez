import os

class Config(object):
    """
    Configuration base, for all environments.
    """
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/test.db'
    SECRET_KEY = "secret"
    CSRF_ENABLED = True

class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://sbirez:sbirez@localhost:5432/sbirez'
    DEBUG = True

class TestingConfig(Config):
    TESTING = True