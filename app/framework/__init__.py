# -*- coding: utf-8 -*-
"""
    sbirez.framework
    ~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from .factory import create_app
from .utils import flash_errors, generate_salt
