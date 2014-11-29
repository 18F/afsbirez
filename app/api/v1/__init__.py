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

file_path = os.path.realpath(__file__)

def get_views(package):
    """
    Get all view classes within a given module
    params

    :param package: a string containing the module e.g. 'my.package.foo'
    :param re: regular expression string to match, example '.*some[~!]one'
    :returns an array of class view names
    """
    modules = [name for _, name, _ in pkgutil.iter_modules(path=package)]

    rv = []
    for m in modules:
        i = importlib.import_module(m)
        for name, obj in inspect.getmembers(i):
            if inspect.isclass(obj) and 'View' in name:
                rv.append(name)

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
    for v in get_views('app.api.v1'):
        v.register(bp)

    return bp


