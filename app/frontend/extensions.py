# -*- coding: utf-8 -*-
"""
    sbirez.frontend.extensions
    ~~~~~~~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from ..framework.extensions import *

from flask.ext.debugtoolbar import DebugToolbarExtension
debug_toolbar = DebugToolbarExtension()
