# -*- coding: utf-8 -*-
"""
    frontend.views.main
    ~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""

from flask import render_template
from flask.ext.classy import FlaskView, route

class MainView(FlaskView):
    route_base = '/'

    @route('/')
    @route('/topic', endpoint='index')
    @route('/topic/<path>', endpoint='index')
    @route('/app', endpoint='index')
    @route('/app/<path>', endpoint='index')
    @route('/app/<path>/<path2>', endpoint='index')
    def index(self, path=None, path2=None):
        return render_template('index.html')
