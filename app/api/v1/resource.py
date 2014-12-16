# Import flask dependencies
from datetime import datetime
from datetime import date
import logging

from flask import Blueprint, request 
from dougrain import Builder
from flask.ext.restful import reqparse, Api, Resource, abort
from flask_jwt import verify_jwt

logger = logging.getLogger(__name__)

mod_api = Blueprint('api', __name__, url_prefix='/api')
api = Api(mod_api)

def log_exception(sender, exception, **extra):
    """ Log an exception to our logging framework """
    sender.logger.debug('Got exception during processing: %s', exception)

from flask import got_request_exception
got_request_exception.connect(log_exception, mod_api)


class Endpoints(Resource):
    """Index of all endpoints"""

    def get(self):
        """Starting endpoint for all available endpoints"""
        return Builder('/').add_curie('r', '/rels/{rel}') \
            .add_link('r:topics', '/api/topics') \
            .add_link('r:awards', '/api/awards') \
            .add_link('r:users', '/api/users')\
            .add_link('r:organizations', '/api/organizations')\
            .add_link('r:applications', '/api/applications')\
            .add_link('r:forms', '/api/forms')\
            .add_link('r:documents', '/api/documents')\
            .add_link('r:processes', '/api/processes')\
            .set_property('welcome', 'Welcome to the SBIR-EZ API!')\
            .set_property('hint', 'Select an link to proceed')\
            .as_object() 


class TopicsList(Resource):
    """Requests put out by agencies to which small businesses reply"""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()
        self.get_req_parse.add_argument('page', type=int, help='Page number starting at 1', default=1)
        self.get_req_parse.add_argument('per_page', type=int, help='Max number (up to 200) per page',
                                        default=20)
        self.post_req_parse = reqparse.RequestParser()

        super(TopicsList, self).__init__()

    def get(self):
        """ Returns a collection of topics matching specified criteria """

        args = self.get_req_parse.parse_args()

        return {}

    def post(self):
        verify_jwt
        """ Creates a new topic """
        return {}, 201

class Topics(Resource):

    def get(self, id):
        """Get topic by id"""
        return {}

class AwardsList(Resource):
    """Several financial awards may be provided per topic but a company may receive only
     one award per topic. A company may be awarded many topics."""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()
        self.get_req_parse.add_argument('page', type=int, help='Page number of results', default=1)
        self.get_req_parse.add_argument('per_page', type=int, help='Max number of results (up to 200) per page',
                                        default=20)

        self.post_req_parse = reqparse.RequestParser()

        super(AwardsList, self).__init__()

    def get(self):
        verify_jwt
        """ Returns a collection of sources matching specified criteria """
        args = self.get_req_parse.parse_args()

        return {}

class Awards(Resource):

    def get(self, id):
        verify_jwt
        """Get award by id"""
        return {}

class UsersList(Resource):
    """A system user; may be a small business or government user"""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()
        self.get_req_parse.add_argument('page', type=int, help='Page number of results', default=1)
        self.get_req_parse.add_argument('per_page', type=int, help='Max number of items (up to 200) per page',
                                        default=20)
        self.post_req_parse = reqparse.RequestParser()

        super(UsersList, self).__init__()

    def get(self):
        """ Returns a collection of users matching specified criteria """

        args = self.get_req_parse.parse_args()

        return {}

class Users(Resource):

    def get(self, id):
        verify_jwt
        """Get user by id"""
        return {}

class OrganizationsList(Resource):
    """An organization is a small business that owns applications."""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()

    def get(self):
        """Get"""
        return {}

class Organizations(Resource):

    def get(self, id):
        verify_jwt
        return {}

class ApplicationsList(Resource):
    """Topic application packages submitted by small business"""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()

    def get(self):
        verify_jwt
        """Get"""
        return {}

class Applications(Resource):

    def get(self, id):
        verify_jwt
        return {}

class ProposalsList(Resource):
    """Topic proposal packages submitted by small business"""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()

    def get(self):
        verify_jwt
        """Get"""
        return {}

class Proposals(Resource):

    def get(self, id):
        verify_jwt
        return {}

class FormsList(Resource):
    """Interactive forms required for proposal submission"""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()

    def get(self):
        """Get"""
        return {}

class Forms(Resource):

    def get(self, id):
        return {}

class DocumentsList(Resource):
    """Storage for documents used as part of the proposal submission process."""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()

    def get(self):
        verify_jwt
        """Get"""
        return {}

class Documents(Resource):

    def get(self, id):
        verify_jwt
        return {}

class ProcessesList(Resource):
    """Collection of steps that outline a SBIR application process."""

    def __init__(self):
        self.get_req_parse = reqparse.RequestParser()

    def get(self):
        """Get"""
        return {}

class Processes(Resource):

    def get(self, id):
        return {}

api.add_resource(TopicsList, '/topics', endpoint='topics')
api.add_resource(Topics, '/topic', endpoint='topic')
api.add_resource(AwardsList, '/awards', endpoint='awards')
api.add_resource(Awards, '/awards/<int:id>', endpoint='award')

api.add_resource(UsersList, '/users', endpoint='users')
api.add_resource(Users, '/users/<int:id>', endpoint='user')

api.add_resource(OrganizationsList, '/organizations', endpoint='organizations')
api.add_resource(Organizations, '/organizations/<int:id>', endpoint='organization')

api.add_resource(ApplicationsList, '/applications', endpoint='applications')
api.add_resource(Applications, '/applications/<int:id>', endpoint='application')

api.add_resource(ProposalsList, '/proposals', endpoint='proposals')
api.add_resource(Proposals, '/proposals/<int:id>', endpoint='proposal')

api.add_resource(FormsList, '/forms', endpoint='forms')
api.add_resource(Forms, '/forms/<int:id>', endpoint='form')

api.add_resource(DocumentsList, '/documents', endpoint='documents')
api.add_resource(Documents, '/documents/<int:id>', endpoint='document')

api.add_resource(ProcessesList, '/processes', endpoint='processes')
api.add_resource(Processes, '/processes/<int:id>', endpoint='process')

api.add_resource(Endpoints, '/', endpoint="endpoints")


