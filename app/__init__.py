from app.config import DevelopmentConfig
import logging

logger = logging.getLogger(__name__)
    
def create_application(config_object=DevelopmentConfig):
    from flask import Flask
    application = Flask(__name__)
    application.config.from_object(config_object)
    application.config.from_envvar('sbirez_settings', True)

    from app.model import db
    db.init_app(application)

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

    from flask_jwt import JWT, jwt_required, _get_serializer
    from flask import jsonify

    application.config['SECRET_KEY'] = '123'
    application.config['JWT_EXPIRATION_DELTA'] = 300 

    jwt = JWT(application)

    class User(object):
      def __init__(self, **kwargs):
        for k, v in kwargs.items():
          setattr(self, k, v)

    @jwt.authentication_handler
    def authenticate(username, password):
      if username == 'test' and password == '123':
        return User(id=1, username='test')
      else:
        return None

    @jwt.user_handler
    def load_user(payload):
      #user = user_datastore.find_user(id=payload['user_id'])
      #return user
      return User(id=1, username='test') 

    @jwt.payload_handler
    def make_payload(user):
      return {
        'id': user.id,
        'username': user.username
      }

    @jwt.encode_handler
    def encode_payload(payload):
      return jsonify({'token': _get_serializer().dumps(payload).decode('utf-8'), 'username': payload['username'], 'id': payload['id']})

    @jwt.response_handler
    def make_response(payload):
      return payload 

    @jwt_required()
    def auth_func(**kw):
      return True

    @application.before_first_request
    def create_db():
        db.create_all()

    return application
