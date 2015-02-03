# -*- coding: utf-8 -*-

__author__ = 'DavidWCaraway'

from flask.ext.restful import abort
from flask import request
from app.api.base import BaseView, secure_endpoint
from flask.ext.restful import reqparse
import sqlalchemy as sa

class TopicsView(BaseView):

    parser = reqparse.RequestParser()

    def index(self):
        args = self.parser.parse_args(strict=True)

        parser.add_argument('rate', type=int, help='Rate to charge for this resource')
        args = parser.parse_args()

        qry = sa.sql.text(self.fulltext_qry)
        findme = ' & '.join(args['q'].split())
        data = db_conn().execute(qry, findme = findme).fetchall()


        data = db_conn().execute(qry, findme = findme).fetchall()

        return {"api_version": "0.2",
                "pagination": {'per_page': 20, 'page': 1, 'pages': 1, 'count': len(data)},
                "results": [dict(d) for d in data]}

        abort(501) #TODO implement

    @secure_endpoint()
    def post(self):
        abort(501) #TODO implement

    def get(self, id):
        abort(501) #TODO implement

    @secure_endpoint()
    def put(self, id):
        abort(501) #TODO implement

    @secure_endpoint()
    def delete(self, id):
        abort(501) #TODO implement
