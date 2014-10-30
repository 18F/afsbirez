#!/usr/bin/python
import os
from app import create_application
from app.config import ProductionConfig

application = create_application(config_object=ProductionConfig)

# virtenv = os.environ['OPENSHIFT_PYTHON_DIR'] + '/virtenv/'
# virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
# try:
#     execfile(virtualenv, dict(__file__=virtualenv))
# except IOError:
#     pass
#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#

#
# Below for testing only
#
if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    httpd = make_server('localhost', 8051, application)
    # Wait for a single request, serve it and quit.
    httpd.handle_request()
