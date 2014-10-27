# Run a test server.
from app import create_application
from app.config import DevelopmentConfig

if __name__ == '__main__':
	import logging
	import sys
	import os
	logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)
	port = int(os.environ.get("PORT", 5000))
	app = create_application(DevelopmentConfig)
	
	# This does nothing unless you run this module with --liveandletdie flag.
	import liveandletdie
	liveandletdie.Flask.wrap(app)

	app.run(host='0.0.0.0', port=port)
