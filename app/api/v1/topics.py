# -*- coding: utf-8 -*-

__author__ = 'DavidWCaraway'

import datetime
from flask.ext.restful import abort
from flask import request
from app.api.base import BaseView, secure_endpoint, limited_value_class, Paginated, MAX_RESULTSET_SIZE
from app.models import model
from flask.ext.restful import reqparse
import sqlalchemy as sa
from sqlalchemy_searchable import search
from werkzeug.routing import ValidationError


class TopicsView(BaseView, Paginated):

    parser = Paginated.parser.copy()
    parser.add_argument('q', type=str, help='Full-text search')
    parser.add_argument('closed', type=bool, default=False,
                        help='Include topics already closed')

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
            "objective": datum.objective,
            "description": datum.description,
            "agency": datum.agency,
            "topic_number": datum.topic_number,
            "solicitation_id": datum.solicitation_id,
            "url": datum.url,
            "program": datum.program.program,
            "pre_release_date": datum.pre_release_date.strftime(self.date_format),
            "proposals_begin_date": datum.proposals_begin_date.strftime(self.date_format),
            "proposals_end_date": datum.proposals_end_date.strftime(self.date_format),
            "days_to_close": (datum.proposals_end_date - now).days,
            "status": self.status(datum),
            "areas": [ area.area for area in datum.areas ],
            "phases": [ phase.phase for phase in datum.phases],
            "references": [reference.reference for reference in datum.references],
            "keywords": [keyword.keyword for keyword in datum.keywords]
            }

    def index(self):
        args = self.parser.parse_args(strict=True)
        data = search(model.Topic.query, args.q, sort=True)
        if not args.closed:
            now = datetime.datetime.now()
            data = data.filter(model.Topic.proposals_end_date >= now)
        num_found = data.count()
        data = self.apply_pagination(data, args)
        data = data.all()
        result = {
                    "numFound": num_found,
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
                        "ea:find": {
                            "href": "/topics{?id}",
                            "templated": True
                        }
                        },
                    "_embedded": {
                        "ea:topic": [ self._single(datum) for datum in data ]
                   }
                }
        if num_found > (args.start + args.limit):
            result['_links']['_next'] = {'href': self.modified_path(args, start=args.start + args.limit)}
        if args.start > 1:
            result['_links']['_prev'] = {'href': self.modified_path(args, start=max(1, args.start - args.limit))}
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
