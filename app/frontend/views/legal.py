# -*- coding: utf-8 -*-
"""
    frontend.views.legal
    ~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""

from flask import render_template
from flask.ext.classy import FlaskView

class LegalView(FlaskView):

    def privacy(self):
        return render_template("legal/privacy.html")

    def terms_of_use(self):
        return render_template("legal/terms_of_use.html")
