from django_assets import Bundle, register

bower_js = Bundle(
    "jslib/parser/parser.js",
    "lib/jquery/dist/jquery.min.js",
    "lib/angular/angular.js",
    "lib/angular-resource/angular-resource.js",
    "lib/angular-cookies/angular-cookies.js",
    "lib/angular-sanitize/angular-sanitize.js",
    "lib/angular-aria/angular-aria.js",
    "lib/angular-route/angular-route.js",
    "lib/ng-file-upload/angular-file-upload.js",
    "lib/ngDialog/js/ngDialog.min.js",
    "lib/angular-ui-mask/dist/mask.min.js",
    "lib/angular-ui-router/release/angular-ui-router.js",
    "lib/angular-order-object-by/src/ng-order-object-by.js",
    "lib/base64/base64.min.js",
    "lib/bigfoot/dist/bigfoot.min.js",
    filters="jsmin",
    output="js/bower.min.js"
)

angular_js = Bundle(
    "js/app.js",
    "js/filters/truncate.js",
    "js/directives/workflow.js",
    "js/directives/topic.js",
    "js/directives/pagination.js",
    "js/directives/backbutton.js",
    "js/directives/jargon.js",
    "js/directives/header.js",
    "js/directives/footer.js",
    "js/directives/elements/str.js",
    "js/directives/elements/text.js",
    "js/directives/elements/bool.js",
    "js/directives/elements/checkbox.js",
    "js/directives/elements/group.js",
    "js/directives/elements/lineitem.js",
    "js/directives/elements/dynamiclineitem.js",
    "js/directives/elements/readonlytext.js",
    "js/directives/elements/upload.js",
    "js/directives/elements/calculated.js",
    "js/controllers/main.js",
    "js/controllers/search.js",
    "js/controllers/signin.js",
    "js/controllers/signup.js",
    "js/controllers/landing.js",
    "js/controllers/reset.js",
    "js/controllers/form.js",
    "js/controllers/contact.js",
    "js/controllers/accountUser.js",
    "js/controllers/accountOrganization.js",
    "js/controllers/savedOpps.js",
    "js/controllers/savedSearches.js",
    "js/controllers/history.js",
    "js/controllers/notification.js",
    "js/controllers/documentList.js",
    "js/controllers/document.js",
    "js/controllers/proposalList.js",
    "js/controllers/proposal.js",
    "js/controllers/proposalReport.js",
    "js/controllers/adminuser.js",
    "js/controllers/topic.js",
    "js/services/authsvc.js",
    "js/services/dialogsvc.js",
    "js/services/usersvc.js",
    "js/services/oppsvc.js",
    "js/services/searchsvc.js",
    "js/services/savedSearchsvc.js",
    "js/services/tokensvc.js",
    "js/services/proposalsvc.js",
    "js/services/documentsvc.js",
    "js/services/validationsvc.js",
    filters="jsmin",
    output="js/angular.min.js"
)

combined_sass = Bundle(
    "sass/main.scss",
    filters="scss",
    output="css/main.min.css"
)

combined_css = Bundle(
    "css/reset.css",
    "lib/ngDialog/css/ngDialog.css",
    "lib/ngDialog/css/ngDialog-theme-default.css",
    "css/ngdialog-theme-login.css",
    "css/ngdialog-theme-intromessage.css",
    "css/ngdialog-theme-logout.css",
    "lib/bigfoot/dist/bigfoot-default.css",
    combined_sass,
    filters="cssmin",
    output="css/sbirez.min.css"
)

register("bower_js", bower_js)
register("angular_js", angular_js)
register("combined_css", combined_css)
