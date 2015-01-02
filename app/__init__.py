from app.settings import DevelopmentConfig

def create_app(override_settings=None):
    from werkzeug.wsgi import DispatcherMiddleware

    from . import api
    from . import frontend

    return DispatcherMiddleware(frontend.create_app(override_settings), {
        '/api': api.create_app(override_settings)
    })
