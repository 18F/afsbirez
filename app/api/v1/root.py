# -*- coding: utf-8 -*-

__author__ = 'DavidWCaraway'

from app.api.v1 import get_views
from app.api import BaseView
from flask import url_for
from flask.ext.classy import route
from dougrain import Builder


class RootView(BaseView):
    """Index of all endpoints"""

    route_base='/'

    @route('/')
    def index(self):
        """Starting endpoint for all available endpoints"""
        b = Builder('/').add_curie('r', url_for('v1.LinkRelationsView:get')+"/{rel}").set_property('welcome', 'Welcome to the Vitals API!')

        for cls in get_views():
            if cls.__name__ == 'RootView':
                continue

            prefix = cls.__name__[:-len('View')].lower()
            rel = 'r:{0}'.format(prefix)
            href = url_for('v1.{0}:index'.format(cls.__name__))
            b.add_link(rel, href)

        return b.as_object()
