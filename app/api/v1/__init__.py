# -*- coding: utf-8 -*-
"""
    sbirez.api.v1
    ~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
# from .todos import TodosView
# from .applications import ApplicationsView
# from .awards import AwardsView
# from .documents import DocumentsView
# from .forms import FormsView
# from .organizations import OrganizationsView
# from .processes import ProcessesView
# from .proposals import ProposalsView
# from .topics import TopicsView
# from .users import UsersView
# from .rel import LinkRelationsView
# from .root import RootView
import importlib
import inspect
import pkgutil
import os

def get_views():
    """
    Get all view classes within a given module
    params

    :returns an array of class
    """
    rv = []
    for _, m, _ in pkgutil.iter_modules(path=__path__):
        i = importlib.import_module(name="{0}.{1}".format(__name__, m))
        for name, obj in inspect.getmembers(i, predicate=inspect.isclass):
            if u'View' in name and obj.__module__ == i.__name__:
                rv.append(obj)

    return rv

def create_blueprint(name=None, url_prefix=None, subdomain=None):
    """Register API endpoints on a Flask :class:`Blueprint`."""

    from flask import Blueprint

    # Determine blueprint name
    name = name or __name__.split('.')[-1]
    url_prefix = url_prefix or "/{0}".format(name)
    if subdomain:
        name = "{0}_{1}".format(subdomain, name)

    # Create blueprint
    bp = Blueprint(name, __name__, url_prefix=url_prefix, subdomain=subdomain)

    # Register API endpoints
    for v in get_views():
        v.register(bp)

    return bp


