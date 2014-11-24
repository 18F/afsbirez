from flask.ext.restful import Api, Resource, abort
from flask import Blueprint

mod_rel = Blueprint('rel', __name__, url_prefix='/rels')
api = Api(mod_rel)

__author__ = 'DavidWCaraway'

RELS = {
"event":
    {
        "$schema": "http://json-schema.org/schema#",

        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"}
        },
        "required": ["email"]
    },

"source":
    {
        "$schema": "http://json-schema.org/schema#",

        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"}
        },
        "required": ["email"]
    },
"events":
    {
    "to": "do"
    },
"sources":
    {
    "to": "do"
    },
"businesses":
    {
    "to": "do"
    },
"business":
    {
    "to": "do"
    }
}

class LinkRelationsList(Resource):
    """Link relations for resources of the API"""

    def get(self):
        """Gets all link relations"""
        return RELS


class LinkRelations(Resource):
    """Individual link relations"""

    def get(self, rel_id):
        schema = RELS.get(rel_id)

        if schema is None:
            abort(404, message="Rel {} doesn't exist".format(rel_id))
        else:
            return RELS[rel_id]

api.add_resource(LinkRelationsList, '/', endpoint='relationships')
api.add_resource(LinkRelations, '/<string:rel_id>', endpoint="relationship")