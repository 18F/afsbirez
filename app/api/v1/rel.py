from flask.ext.restful import Api, Resource, abort
from flask import Blueprint

from app.api.base import BaseView
from dougrain import Builder

__author__ = 'DavidWCaraway'

RELS = {
    "user":
        {
            "$schema": "http://json-schema.org/schema#",

            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"}
            },
            "required": ["email"]
        },

    "foo":
        {
            "$schema": "http://json-schema.org/schema#",

            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"}
            },
            "required": ["email"]
        }

    
}

class LinkRelationsView(BaseView):
    """Link relations for resources of the API"""

    route_base = '/rels/'

    def index(self):
        """Gets all link relations"""
        return RELS

    def get(self, id):
        schema = RELS.get(id)

        if schema is None:
            abort(404, message="Rel {} doesn't exist".format(id))
        else:
            return RELS[id]
