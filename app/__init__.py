from app.config import DevelopmentConfig
import logging

logger = logging.getLogger(__name__)
    
def create_application(config_object=DevelopmentConfig):
    from flask import Flask
    application = Flask(__name__)
    application.config.from_object(config_object)
    application.config.from_envvar('sbirez_settings', True)

    from app.route import index
    application.add_url_rule('/', 'index', index)

    from app.error import not_found, internal_error
    application.error_handler_spec[None][404] = not_found
    application.error_handler_spec[None][500] = internal_error

    # Import a module / component using its blueprint handler variable (mod_api)
    from app.mod_api.resource import mod_api as api_module
    from app.mod_api.rel import mod_rel as rel_module
    from app.mod_hal import mod_hal

    # Register blueprint(s)
    application.register_blueprint(api_module)
    application.register_blueprint(rel_module)
    application.register_blueprint(mod_hal)

    @application.teardown_appcontext
    def shutdown_session(exception=None):
        from app.database import db_session
        db_session.remove()

    return application