# -*- coding: utf-8 -*-

__author__ = 'DavidWCaraway'

from flask.ext.restful import abort, reqparse
from flask import url_for
from app.api.base import BaseView, secure_endpoint
from app.models.model import Organization
from dougrain import Builder

collection_arg_parser = reqparse.RequestParser()
collection_arg_parser.add_argument('q', type=str, help='Free-text search string', default="")
collection_arg_parser.add_argument('page', type=int, help='Page number of results', default=1)
collection_arg_parser.add_argument('per_page', type=int, help='Max number of results per page',default=20)
collection_arg_parser.add_argument('order', type=str, help='Sort, ASC is ascending, DESC is descending', default='asc')

class OrganizationsView(BaseView):
    """A complete Flask-Classy-based Organizations API resource."""

    def __init__(self):
        self.collection_arg_parser = reqparse.RequestParser()
        self.collection_arg_parser.add_argument('q', type=str, help='Free-text search string', default="")
        self.collection_arg_parser.add_argument('page', type=int, help='Page number of results', default=1)
        self.collection_arg_parser.add_argument('per_page', type=int, help='Max number of results per page',default=20)
        self.collection_arg_parser.add_argument('order', type=str, help='Sort, ASC is ascending, DESC is descending', default='asc')

    def index(self):
        """Returns a Collection of Organizations."""
        args = collection_arg_parser.parse_args()

        pagination = Organization.query.paginate(page=args.page, per_page=args.per_page)
        response = Builder("{0}?page={1}".format(url_for("v1.OrganizationsView:index"), pagination.page))\
            .add_curie('r', "/api/rels/{rel}")\
            .set_property('total', pagination.total)

        if pagination.has_prev:
            response = response.add_link('prev', '{0}?page={1}'.format(url_for("v1.OrganizationsView:index"), pagination.prev_num))

        if pagination.has_next:
            response = response.add_link('next', '{0}?page={1}'.format(url_for("v1.OrganizationsView:index"), pagination.next_num))

        if pagination.total > 1 and pagination.has_prev:
            response = response.add_link('first', '{0}?page={1}'.format(url_for("v1.OrganizationsView:index", 1)))
        if pagination.total > 1 and pagination.has_next:
            response = response.add_link('last', '{0}?page={1}'.format(url_for("v1.OrganizationsView:index"), pagination.pages))

        for business in pagination.items:
            response = response.add_link('r:business', '{0}/%d'.format(url_for("v1.OrganizationsView:index"), business.id))

        return response.as_object()

    @secure_endpoint()
    def post(self):
        """Creates a new Organization."""
        data = collection_arg_parser.parse_args()
        org = Organization.create(**data)
        return org.to_dict(), 201

    def get(self, id):
        """Returns a specific of Organization."""
        return Organization.get_or_404(id).to_dict()

    @secure_endpoint()
    def put(self, id):
        """Updates an existing Organization."""
        data = collection_arg_parser.parse_args()
        org = Organization.get(id)
        org.patch(**data)
        return org.to_dict(), 200

    @secure_endpoint()
    def delete(self, id):
        """Deletes an existing Organization."""
        org = Organization.get(id)
        if org is None:
            return '', 204
        if org.delete():
            return '', 204
        abort(409)