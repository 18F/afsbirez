# -*- coding: utf-8 -*-
"""
    sbirez.framework.sql
    ~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from . import base
from .extensions import db
from flask.ext.restless.helpers import to_dict as restless_to_dict


class JSONMixin(base.JSONMixin):

    def to_dict(self, deep=None, exclude=None, include=None,
                include_methods=None, **kwargs):
        """
        Call flask.ext.restless.helper.to_dict method on self.

        Returns a dictionary representing the fields of the specified `instance`
        of a SQLAlchemy model.

        The returned dictionary is suitable as an argument to
        :func:`flask.jsonify`; :class:`datetime.date` and :class:`uuid.UUID`
        objects are converted to string representations, so no special JSON
        encoder behavior is required.

        `deep` is a dictionary containing a mapping from a relation name (for a
        relation of `instance`) to either a list or a dictionary. This is a
        recursive structure which represents the `deep` argument when calling
        :func:`!_to_dict` on related instances. When an empty list isencountered,
        :func:`!_to_dict` returns a list of the string representations of the
        related instances.

        If either `include` or `exclude` is not ``None``, exactly one of them must
        be specified. If both are not ``None``, then this function will raise a
        :exc:`ValueError`. `exclude` must be a list of strings specifying the
        columns which will *not* be present in the returned dictionary
        representation of the object (in other words, it is a
        blacklist). Similarly, `include` specifies the only columns which will be
        present in the returned dictionary (in other words, it is a whitelist).

        .. note::

           If `include` is an iterable of length zero (like the empty tuple or the
           empty list), then the returned dictionary will be empty. If `include`
           is ``None``, then the returned dictionary will include all columns not
           excluded by `exclude`.

        `include_relations` is a dictionary mapping strings representing relation
        fields on the specified `instance` to a list of strings representing the
        names of fields on the related model which should be included in the
        returned dictionary; `exclude_relations` is similar.

        `include_methods` is a list mapping strings to method names which will
        be called and their return values added to the returned dictionary.
        """
        # todo: incorporate the following, by calculating the value of deep
        #       based off of includes and excludes
        # https://github.com/jfinkels/flask-restless/blob/5edd8caf7adc7eae6277a578a5386a0461b2d115/flask_restless/views.py#L872
        return restless_to_dict(self, deep=deep, exclude=exclude,
                                include=include,
                                include_methods=include_methods, **kwargs)


class CRUDMixin(base.CRUDMixin):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete)
    operations.
    """

    @classmethod
    def new(cls, **kwargs):
        """Create a new record without saving it in the database."""
        return cls(**cls._preprocess_params(kwargs))

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        for attr, value in self._preprocess_params(kwargs).iteritems():
            setattr(self, attr, value)
        return commit and self.save() or self

    def save(self, commit=True):
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=True):
        """Remove the record from the database."""
        db.session.delete(self)
        if commit:
            db.session.commit()
        return commit


class ServiceMixin(base.ServiceMixin):

    @classmethod
    def all(cls):
        """Returns a generator containing all instances of the service's model.
        """
        return cls.query.all()

    @classmethod
    def get(cls, id):
        """Returns an instance of the service's model with the specified id.
        Returns `None` if an instance with the specified id does not exist.

        :param id: the instance id
        """
        return cls.query.get(id)

    @classmethod
    def get_all(cls, *ids):
        """Returns a list of instances of the service's model with the specified
        ids.

        :param *ids: instance ids
        """
        return cls.query.filter(cls.id.in_(ids)).all()

    @classmethod
    def get_or_404(cls, id):
        """Returns an instance of the service's model with the specified id or
        raises an 404 error if an instance with the specified id does not exist.

        :param id: the instance id
        """
        return cls.query.get_or_404(id)

    @classmethod
    def find(cls, **kwargs):
        """Returns a list of instances of the service's model filtered by the
        specified key word arguments.

        :param **kwargs: filter parameters
        """
        return cls.query.filter_by(**kwargs)

    @classmethod
    def first(cls, **kwargs):
        """Returns the first instance found of the service's model filtered by
        the specified key word arguments.

        :param **kwargs: filter parameters
        """
        return cls.find(**kwargs).first()

    @classmethod
    def first_or_404(cls, **kwargs):
        """Returns the first instance found of the service's model filtered by
        the specified key word arguments.

        :param **kwargs: filter parameters
        """
        raise cls.find(**kwargs).first_or_404()


# From Mike Bayer's "Building the app" talk
# https://speakerdeck.com/zzzeek/building-the-app
# modified to remove the get_by_id class method
# renamed to PrimaryKeyMixin
class PrimaryKeyMixin(object):
    """A mixin that adds a surrogate integer 'primary key' column named
    ``id`` to any declarative-mapped class.
    """
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)


class Model(PrimaryKeyMixin, CRUDMixin, ServiceMixin, JSONMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""
    __abstract__ = True


def ReferenceColumn(tablename, nullable=False, pk_name='id', **kwargs):
    """Column that adds primary key foreign key reference.

    Usage: ::

        category_id = ReferenceColumn('category')
        category = relationship('Category', backref='categories')
    """
    return db.Column(db.ForeignKey("{0}.{1}".format(tablename, pk_name)),
                     nullable=nullable, **kwargs)
