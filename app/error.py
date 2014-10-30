from flask import make_response, render_template

def not_found(error):
    return make_response(render_template('404.html'), 404)


def internal_error(error):
    return make_response(render_template('500.html'), 500)