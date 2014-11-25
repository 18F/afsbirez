# -*- coding: utf-8 -*-
"""
    sbirez.api
    ~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from . import v1
from .. import framework
from .base import (ClassyAPI, BaseView, BaseResource, secure_endpoint,
                   json_required, )

__all__ = ('create_app', 'register_blueprint', 'ClassyAPI', 'BaseAPI',
           'BaseResource', 'secure_endpoint', 'json_required', 'v1', )


def create_app(settings_override=None):
    """Returns an API application instance."""

    # Create and extend a minimal application
    app = framework.create_app(__name__, __path__, settings_override)

    # Initialize extensions
    app.extensions['classy_api'] = ClassyAPI(app, catch_all_404s=True)

    # Register API versions
    for version in [v1]:
        bp = version.create_blueprint()
        register_blueprint(app, bp)

    return app


def register_blueprint(app, blueprint):
    """Register an API blueprint."""
    if 'classy_api' not in app.extensions:
        raise RuntimeError('ClassyAPI not registered on this application')
    app.extensions['classy_api'].register_blueprint(blueprint)
    app.register_blueprint(blueprint)
