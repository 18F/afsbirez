# -*- coding: utf-8 -*-
"""
    sbirez.frontend.assets
    ~~~~~~~~~~~~~~~~~~~~~~

    :author: 18F
    :copyright: © 2014-2015, 18F
    :license: CC0 Public Domain License, see LICENSE for more details.

    templated from https://github.com/ryanolson/cookiecutter-webapp
"""
import os
from flask.ext.assets import Bundle, Environment

root_directory = os.path.dirname(os.path.abspath(__file__))
assets_directory = os.path.join(root_directory, 'static')

bower_js = Bundle(
    "lib/jquery/dist/jquery.js",
    "lib/angular/angular.js",
    "lib/angular-resource/angular-resource.js",
    "lib/angular-cookies/angular-cookies.js",
    "lib/angular-sanitize/angular-sanitize.js",
    "lib/angular-route/angular-route.js",
    "lib/ng-file-upload/angular-file-upload.js",
    "lib/ngDialog/js/ngDialog.min.js",
    "lib/angular-ui-router/release/angular-ui-router.js",
    filters="jsmin",
    output="js/bower.min.js"
)

angular_js = Bundle(
    "js/app.js",
    "js/filters/truncate.js",
    "js/directives/workflow.js",
    "js/directives/pagination.js",
    "js/directives/header.js",
    "js/directives/footer.js",
    "js/controllers/main.js",
    "js/controllers/appmain.js",
    "js/controllers/search.js",
    "js/controllers/form.js",
    "js/controllers/contact.js",
    "js/controllers/activity.js",
    "js/controllers/account.js",
    "js/controllers/accountUser.js",
    "js/controllers/accountOrganization.js",
    "js/controllers/savedOpps.js",
    "js/controllers/savedSearches.js",
    "js/controllers/history.js",
    "js/controllers/notification.js",
    "js/controllers/documentList.js",
    "js/controllers/document.js",
    "js/controllers/documentUpload.js",
    "js/controllers/documentUploadEdit.js",
    "js/controllers/proposalList.js",
    "js/controllers/proposal.js",
    "js/controllers/adminuser.js",
    "js/controllers/topic.js",
    "js/services/authsvc.js",
    "js/services/dialogsvc.js",
    "js/services/usersvc.js",
    "js/services/oppsvc.js",
    "js/services/searchsvc.js",
    "js/services/tokensvc.js",
    filters="jsmin",
    output="js/angular.min.js"
)

combined_sass = Bundle(
    "sass/main.scss",
    filters="scss",
    output="css/main.min.css"
)

combined_css = Bundle(
    "lib/ngDialog/css/ngDialog.css",
    "lib/ngDialog/css/ngDialog-theme-default.css",
    "css/ngdialog-theme-login.css",
    "css/ngdialog-theme-logout.css",
    combined_sass,
    filters="cssmin",
    output="css/sbirez.min.css"
)

def init_app(app):
    assets = Environment(app)
    assets.debug = app.config.get('DEBUG', False)
    assets.directory = app.static_folder
    assets.url = app.static_url_path

    assets.append_path(assets_directory)
    assets.append_path(app.static_folder)
    assets.register("bower_js", bower_js)
    assets.register("angular_js", angular_js)
    assets.register("combined_css", combined_css)
