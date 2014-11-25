from flask.ext.jwt import JWT, JWTError, _get_serializer, verify_jwt
from flask import jsonify
from app.model import User
from functools import wraps
from flask.ext.restful import abort

def jwt_auth():
  """
  Decorator to require JSON web tokens for a given
  resource created by the Flask-RESTful API
  """

  def wrapper(fn):
    @wraps(fn)
    def decorator(*args, **kwargs):
      try:
        verify_jwt() 
        return fn(*args, **kwargs)
      except JWTError as e:
        response = jsonify({"message": e.error + ": " + e.description})
        response.status_code = 401
        return response
        #return jsonify({"message": "Broke!"}), 401
        #abort(401)
    return decorator
  return wrapper

def create_jwt(application):

    jwt = JWT(application)

    @jwt.authentication_handler
    def authenticate(username, password):
      if username == 'test' and password == '123':
        return User(id=1, name='test')
      else:
        return None

    @jwt.user_handler
    def load_user(payload):
      return User(id=1, name='test')

    @jwt.payload_handler
    def make_payload(user):
      return {
        'id': user.id,
        'username': user.name
      }

    @jwt.encode_handler
    def encode_payload(payload):
      return jsonify({'token': _get_serializer().dumps(payload).decode('utf-8'), 'username': payload['username'], 'id': payload['id']})

    @jwt.response_handler
    def make_response(payload):
      return payload

