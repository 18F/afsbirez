# -*- coding: utf-8 -*-
"""
    sbirez.api.v1.todos
    ~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
from flask.ext.restful import abort, reqparse

from app.api.base import BaseView, secure_endpoint
from app.models.todos import Todo
import json

todo_parser = reqparse.RequestParser()
todo_parser.add_argument('title', type=str)
todo_parser.add_argument('completed', type=bool, default=False)


class TodosView(BaseView):
    """A complete Flask-Classy-based Todo API resource."""

    def index(self):
        """Returns a Collection of Todos."""
        return dict(todos=[todo.to_dict() for todo in Todo.all()])

    @secure_endpoint()
    def post(self):
        """Creates a new Todo."""
        data = todo_parser.parse_args()
        todo = Todo.create(**data)
        return todo.to_dict(), 201

    def get(self, id):
        """Returns a specific of Todo."""
        return Todo.get_or_404(id).to_dict()

    @secure_endpoint()
    def put(self, id):
        """Updates an existing Todo."""
        data = todo_parser.parse_args()
        todo = Todo.get(id)
        todo.patch(**data)
        return todo.to_dict(), 200

    @secure_endpoint()
    def delete(self, id):
        """Deletes an existing Todo."""
        todo = Todo.get(id)
        if todo is None:
            return '', 204
        if todo.delete():
            return '', 204
        abort(409)

