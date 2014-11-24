# -*- coding: utf-8 -*-
"""
    sbirez.api.base
    ~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
import logging

from flask import request
from flask.ext.classy import FlaskView
from flask.ext.jwt import verify_jwt, JWTError
from flask.ext.restful import Api as RestfulAPI, Resource
from flask.ext.restful import abort, representations, types
from flask.ext.restful.representations.json import output_json
from flask.ext.restful.reqparse import RequestParser
from flask.ext.restful.utils import unpack
from functools import wraps
from werkzeug.http import parse_options_header

# Monkey-patch flask.ext.restful.representations.json.settings to always
# return indented and sorted JSONs.
representations.json.settings = {
    'indent': 4,
    'sort_keys': True,
}

request_options = RequestParser()
request_options.add_argument('Content-Type', type=str, location='headers')
request_options.add_argument('fields', type=str, location='args')
request_options.add_argument('page', type=int, location='args')
request_options.add_argument('per_page', type=int, location='args')

response_options = RequestParser()
response_options.add_argument('envelope', type=types.boolean, location='args')
response_options.add_argument('callback', type=str, location='args')
response_options.add_argument('X-Conditional', type=types.boolean,
                             location='headers')

_log = logging.getLogger(__name__)

__all__ = ('ClassyAPI', 'BaseAPI', 'BaseResource', 'secure_endpoint')


class ClassyAPI(RestfulAPI):
    """
    Extend Flask-RESTful to play nicely with Flask-Classy view,
    conditional requests, and many other cool API features.
    """
    def __init__(self, *args, **kwargs):
        super(ClassyAPI, self).__init__(*args, **kwargs)
        self.classy_blueprints = {}

    def register_blueprint(self, blueprint):
        """Register a ClassyAPI blueprint with the extensions."""
        if blueprint.name in self.classy_blueprints:
            raise ValueError("A blueprint with the name {0} " \
                             "is already registered to the API." \
                             .format(blueprint.name))
        self.classy_blueprints[blueprint.name] = blueprint

    def owns_endpoint(self, endpoint):
        """
        Extend owns_endpoint to check for a Flask-Classy endpoint that
        inherits from BaseAPI.
        """
        # Check Flask-Restful ownership
        if super(ClassyAPI, self).owns_endpoint(endpoint):
            return True
        # Check ClassyAPI ownership 
        for bp_name in self.classy_blueprints.keys():
            if endpoint.startswith(bp_name) and 'API:' in endpoint:
                return True

    def error_router(self, original_handler, e):
        if isinstance(e, JWTError):
            return original_handler(e)
        return super(ClassyAPI, self).error_router(original_handler, e)

    def make_response(self, data, *args, **kwargs):
        """
        Extending Flask-RESTful's make_response to add functionality.

        :param data: the raw data emitted from the Resource's view function.

        Envelopify:
        If envelope=true or callback is found in the request's arguments, then
        we return an enveloped response.  Envelopify must act on raw/untransformed
        data.

        Conditionalify:
        If the X-Conditional header evaluates to True, then return a
        conditional GET response, which will return a 304 - Not Modified if the
        ETag in the response matches any of the values in the If-None-Match
        request header, otherwise return the default response.
        """
        response = responsify(data, *args, **kwargs)
        response = envelopify_response(response)
        response = jsonify_response(response)
        return conditionalify_response(response)


class BaseAPI(FlaskView):
    """Flask-Classy base class for ClassyAPI views."""

    trailing_slash = None

    def before_request(self, name, *args, **kwargs):
        """Enforce Content-Type == application/json"""
        enforce_json_post_put_patch_requests()

    def after_request(self, name, response):
        """Conditionalify responses"""
        return conditionalify_response(response)

    @classmethod
    def make_response(cls, response):
        """JSONify responses"""
        return jsonify_response(envelopify_response(response))

    @classmethod
    def get_class_suffix(cls):
        """API views will use the -API suffix rather than the -View suffix."""
        return "API"


class BaseResource(Resource):
    """Flask-RESTful base class Resource API views."""

    def dispatch_request(self, *args, **kwargs):
        """Extend dispatch_request to enforce Content-Type == application/json"""
        enforce_json_post_put_patch_requests()
        return super(BaseResource, self).dispatch_request(*args, **kwargs)


def secure_endpoint(jwt=True, oauth2=True, jwt_realm=None):
    """View decorator to protect API endpoints."""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt(jwt_realm)
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def enforce_json_post_put_patch_requests():
    """
    Incoming POST, PUT and PATCH requests should have Content-Type set to
    'application/json' or else a 415 - Unsupported Media Type is returned.
    """
    options = request_options.parse_args()
    content_type, options = parse_options_header(options.get("Content-Type"))
    content_json = content_type == 'application/json'
    post_put_or_patch = request.method.lower() in ['post', 'put', 'patch']
    if post_put_or_patch and not content_json:
        abort(415)


def responsify(data, code, headers=None):
    """Returns a response tuple."""
    if code == 204:
        data = ''
    return (data, code, headers or {})


def envelopify_response(response):
    """
    Wrap the response in an envelope for JSONP calls or if envelope=true is
    specifically passed as an argument. Envelope-wrapped responses all return a
    200 HTTP status code with the actual response code embedded in the envelope.

    Returns a response tuple.
    """
    options = response_options.parse_args()
    if options.get('envelope') or options.get('callback'):
        data, code, headers = unpack(response)
        data = dict(status=code, data=data)
        if headers:
            data['headers'] = headers
        return data, 200, headers
    return response


def jsonify_response(response):
    """
    JSONifies the response with Flask-RESTful's output_json.

    Returns a Flask Response
    """
    data, code, headers = unpack(response)
    response = output_json(data, code, headers)
    response.headers['Content-Type'] = 'application/json'
    if code == 204:
        del response.headers['Content-Type']
    return response


def conditionalify_response(response):
    """
    If the X-Conditional header evaluates to True, then return a
    conditional GET response, which will return a 304 - Not Modified if the
    ETag in the response matches any of the values in the If-None-Match
    request header, otherwise return the default response.

    Returns a Flask Response
    """
    args = response_options.parse_args()
    if request.method == 'GET':
        response.add_etag()
    if args.get('X-Conditional'):
        return response.make_conditional(request)
    return response


def json_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        enforce_json_post_put_patch_requests()
        return func(*args, **kwargs)
    return decorated_view
