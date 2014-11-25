# -*- coding: utf-8 -*-
"""
    sbirez.framework.base
    ~~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""


class SBIREZError(Exception):
    """Base application error class."""

    def __init__(self, msg):
        self.msg = msg


class SBIREZFormError(Exception):
    """Raise when an error processing a form occurs."""

    def __init__(self, errors=None):
        self.errors = errors


class JSONMixin(object):

    def to_dict(self, deep=None, exclude=None, include=None, **kwargs):
        raise NotImplementedError


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete)
    operations.  Also new and patch.
    """

    @classmethod
    def _preprocess_params(cls, kwargs):
        """Returns a preprocessed dictionary of parameters. Used by default
        before creating a new instance or updating an existing instance.

        :param kwargs: a dictionary of parameters
        """
        kwargs.pop('csrf_token', None)
        return kwargs

    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        return cls.new(**kwargs).save()

    @classmethod
    def new(cls, **kwargs):
        """Create a new record without saving it in the database."""
        return cls(**cls._preprocess_params(kwargs))

    def delete(self, commit=True):
        """Remove the record from the database."""
        raise NotImplementedError

    def patch(self, commit=True, **kwargs):
        return self.update(commit=commit, **kwargs)

    def save(self, commit=True):
        """Save the record."""
        raise NotImplementedError

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        raise NotImplementedError


class ServiceMixin(object):
    """Mixin that adds convenience methods for accessing (all, get, get_all,
    get_or_404, find, first, first_or)
    saved members of a given class."""

    @classmethod
    def all(cls):
        """Returns a generator containing all instances of the service's model.
        """
        raise NotImplementedError

    @classmethod
    def get(cls, id):
        """Returns an instance of the service's model with the specified id.
        Returns `None` if an instance with the specified id does not exist.

        :param id: the instance id
        """
        raise NotImplementedError

    @classmethod
    def get_all(cls, *ids):
        """Returns a list of instances of the service's model with the specified
        ids.

        :param *ids: instance ids
        """
        raise NotImplementedError

    @classmethod
    def get_or_404(self, id):
        """Returns an instance of the service's model with the specified id or
        raises an 404 error if an instance with the specified id does not exist.

        :param id: the instance id
        """
        raise NotImplementedError

    @classmethod
    def find(cls, **kwargs):
        """Returns a list of instances of the service's model filtered by the
        specified key word arguments.

        :param **kwargs: filter parameters
        """
        raise NotImplementedError

    @classmethod
    def first(cls, **kwargs):
        """Returns the first instance found of the service's model filtered by
        the specified key word arguments.

        :param **kwargs: filter parameters
        """
        raise NotImplementedError

    @classmethod
    def first_or_404(cls, **kwargs):
        """Returns the first instance found of the service's model filtered by
        the specified key word arguments.

        :param **kwargs: filter parameters
        """
        raise NotImplementedError
