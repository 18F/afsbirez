# -*- coding: utf-8 -*-
"""
    sbirez.models.todos
    ~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.
"""
from ..framework.sql import (
    db,
    Model,
    ReferenceColumn,
)


class Todo(Model):

    __tablename__ = "todos"

    title = db.Column(db.String(128), nullable=False)
    completed = db.Column(db.Boolean, default=False)

