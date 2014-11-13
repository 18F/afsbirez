from flask_jwt import JWT, jwt_required, _get_serializer
from flask import jsonify
from app.model import User

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
