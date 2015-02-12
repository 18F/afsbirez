import os
import os.path
import sys
import subprocess

from flask.ext.script import Command, Manager, Option, Shell, Server
from flask.ext.migrate import MigrateCommand
from werkzeug.serving import run_simple
import ddlgenerator

from app import create_app
from app.framework.sql import db
from app.models.users import User

from data.make_unique import filter_json_for_unique

from app.settings import DevelopmentConfig
application = create_app(override_settings=DevelopmentConfig)

manager = Manager(application.app)
TEST_CMD = "py.test tests"

from app.framework.extensions import celery
celery.init_app(application.mounts['/api'])

class Worker(Command):

    option_list = (
        Option('-c', '--concurrency', dest='concurrency', default='1'),
        Option('-l', '--loglevel', dest='loglevel', default='debug'),
    )

    def run(self, concurrency, loglevel):
        celery.start(argv=['worker.py', 'worker',
                           '--concurrency', concurrency,
                           '--loglevel', loglevel,
                           ])

class WSGI(Server):

    def __call__(self, app, host, port, use_debugger, use_reloader,
                 threaded, processes, passthrough_errors):

        if use_debugger is None:
            use_debugger = app.debug

        if use_debugger is None:
            use_debugger = True

        if use_reloader is None:
            use_reloader = use_debugger

        extra_files = []
        if use_debugger is not None:
            extra_dirs = ['app/frontend/static', 'tests']
            extra_files = extra_dirs[:]
            ignore_exts = ['.swp']
            for extra_dir in extra_dirs:
                for dirname, dirs, files in os.walk(extra_dir):
                    for filename in files:
                        filename = os.path.join(dirname, filename)
                        file, ext = os.path.splitext(filename)
                        if os.path.isfile(filename) and ext not in ignore_exts:
                            extra_files.append(filename)

        run_simple(host, port, application,
                   use_debugger=use_debugger,
                   use_reloader=use_reloader,
                   extra_files=extra_files,
                   threaded=threaded,
                   processes=processes,
                   passthrough_errors=passthrough_errors,
                   **self.server_options)

def _make_context():
    """Return context dict for a shell session so you can access
    app, db, and the User model by default.
    """
    return {
        'app': application,
        'api': application.mounts['/api'],
        'frontend': application.app,
        'db': db,
        'User': User
    }

def server_test():
    """Run the server side tests"""
    import pytest
    exit_code = pytest.main(['tests', '--verbose'])
    return exit_code

def client_test():
    """Run the frontend tests."""
    import subprocess
    return subprocess.call(["node_modules/karma/bin/karma", "start"])

@manager.option('-t', '--type', dest='type', default='all')
def test(type):
    """Run the tests."""
    print(type)
    if type == "server":
        return server_test()
    elif type == "client":
        return client_test()
    else:
        server_exit_code = server_test()
        client_exit_code = client_test()
        return server_exit_code or client_exit_code


class ExtractCommand(Command):
    "Populates topics data from .json dump of scraped topics"

    option_list = (
        Option('-f', '--file-loc', dest='file_loc', default='data/aftopics.json'),
    )

    def run(self, file_loc):
        def path_to(filename):
            return os.path.join('data', filename)
        def insert_file(filename, outfile):
            with open(path_to(filename)) as addfile:
                outfile.write(addfile.read())
        json_filename = path_to('topics.json')
        sql_filename = path_to('topics.sql')
        filter_json_for_unique(file_loc, json_filename)
        with open(sql_filename, 'w') as outfile:
            insert_file('empty_topic_data.sql', outfile)
            print('\n\ncreate schema import;\nset search_path=import;\n\n', file=outfile)
            ddlgenerator.generate(['--inserts', 'postgresql', json_filename], file=outfile)
            insert_file('transfer_schemas.sql', outfile)
            insert_file('fulltext.sql', outfile)
        db_name = application.app.config['SQLALCHEMY_DATABASE_URI'].split('/')[-1]
        os.system('psql -f %s %s' % (sql_filename, db_name))


manager.add_command('runserver', WSGI(host='0.0.0.0'), )
manager.add_command('worker', Worker())
manager.add_command('shell', Shell(make_context=_make_context))
MigrateCommand.add_command('extract', ExtractCommand)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
