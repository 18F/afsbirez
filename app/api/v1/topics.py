# -*- coding: utf-8 -*-

__author__ = 'DavidWCaraway'

import datetime
from flask.ext.restful import abort
from flask import request
from app.api.base import BaseView, secure_endpoint
from app.models import model
from flask.ext.restful import reqparse
import sqlalchemy as sa
from sqlalchemy_searchable import search
from werkzeug.routing import ValidationError

MAX_RESULTSET_SIZE = 200

def limited_value_class(base_class, min_val = None, max_val = None):
    class Limited(base_class):
        min_ = min_val
        max_ = max_val
        def __init__(self, val, *arg, **kwarg):
            val = base_class(val)
            if (min_val is not None) and (val < self.min_):
                raise ValidationError("Value should be at least %s" % self.min_)
            elif (max_val is not None) and (val > self.max_):
                raise ValidationError("Value should be no more than %s" % self.max_)
            base_class.__init__(val, *arg, **kwarg)
    return Limited

NaturalNumber = limited_value_class(int, 1)
LimitedInt = limited_value_class(int, 1, MAX_RESULTSET_SIZE)

class TopicsView(BaseView):

    parser = reqparse.RequestParser()
    parser.add_argument('q', type=str, help='Full-text search')
    parser.add_argument('closed', type=bool, default=False,
                        help='Include topics already closed')
    parser.add_argument('start', type=NaturalNumber, default=1,
                        help='Get results staring at')
    parser.add_argument('limit', type=LimitedInt, default=20,
                        help='Number of topics to return (max %s)' % MAX_RESULTSET_SIZE)

    date_format = '%Y%m%d'

    def status(self, topic):
        now = datetime.datetime.now()
        if now > topic.proposals_end_date:
            return 'Closed'
        elif now >= topic.proposals_begin_date:
            return 'Open'
        else:
            return 'Future'

    def _single(self, datum):
        now = datetime.datetime.now()
        return {
            "_links": {
                "self": {
                    "href": "/topics/%s" % datum.id
                }
            },
            "id": datum.id,
            "title": datum.title,
            "description": datum.description,
            "agency": datum.agency,
            "release_date": datum.pre_release_date.strftime(self.date_format),
            "open_date": datum.proposals_begin_date.strftime(self.date_format),
            "close_date": datum.proposals_end_date.strftime(self.date_format),
            "days_to_close": (datum.proposals_end_date - now).days,
            "status": self.status(datum)
            }

    def index(self):
        args = self.parser.parse_args(strict=True)
        data = search(model.Topic.query, args.q, sort=True)
        if not args.closed:
            now = datetime.datetime.now()
            data = data.filter(model.Topic.proposals_end_date >= now)
        data = data.offset(args.start)
        data = data.limit(args.limit)
        data = data.all()
        result = {
                    "_links": {
                        "self": {
                            "href": request.url  # but should it be relative?
                            },
                        "curies": [
                            {
                                "name": "ea",
                                "href": "http://sbirez.gsa.gov/rels/{rel}", # TODO: WAT
                                "templated": True
                            }
                            ],
                        "next": {
                            "href": "/topics?start=21" # TODO: support start
                            },
                        "ea:find": {
                            "href": "/topics{?id}",
                            "templated": True
                        }
                        },
                    "_embedded": {
                        "ea:topic": [ self._single(datum) for datum in data ]
                   }
                }
        return result

    @secure_endpoint()
    def post(self):
        abort(501) #TODO implement

    def get(self, id):
        datum = model.Topic.get(id)
        return self._single(datum)

    @secure_endpoint()
    def put(self, id):
        abort(501) #TODO implement

    @secure_endpoint()
    def delete(self, id):
        abort(501) #TODO implement
