from flask import Blueprint, render_template
mod_hal = Blueprint('hal', __name__, url_prefix='/hal', template_folder='templates', static_folder='static')

@mod_hal.route('/')
def browse():
    return render_template('browser.html')