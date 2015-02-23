from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework import routers
from sbirez import api

router = routers.DefaultRouter()
router.register(r'users', api.UserViewSet)
router.register(r'groups', api.GroupViewSet)

urlpatterns = patterns('',
    # api navigation
    url(r'^api/v1/', include(router.urls)),

    #django default admin
    url(r'^admin/', include(admin.site.urls)),

    # endpoints for password reset workflow.
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^password-reset/$',
        TemplateView.as_view(template_name="password_reset.html"),
        name='password-reset'),
    url(r'^password-reset/confirm/$',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password-reset-confirm'),
    url(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password_reset_confirm'),

    # jwt authentication endpoint
    url(r'^auth/', 'rest_framework_jwt.views.obtain_jwt_token'),

    # angular app endpoint
    url(r'^$', 'sbirez.views.home', name='home'),
    url(r'^app/', 'sbirez.views.home', name='home'),
)
