# -*- coding: utf-8 -*-
"""
    frontend.views.todo
    ~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from flask import flash, render_template
from flask.ext.classy import FlaskView
from flask.ext.security import current_user, login_required
from werkzeug.local import LocalProxy
# from werkzeug.datastructures import MultiDict

# Extensions
_security = LocalProxy(lambda: current_app.extensions['security'])
# _social = LocalProxy(lambda: current_app.extensions['social'])

class TodosView(FlaskView):
    route_base = '/'

    def index(self):
        if not current_user.is_authenticated():
            flash("You must login to modify the Todos.", category="warning")
        return render_template("views/todos/index.html")

    @login_required
    def secret(self):
        if not current_user.is_authenticated():
            flash("You must login to modify the Todos.", category="warning")
        flash("super secret message", category='info')
        return render_template("views/todos/index.html")
