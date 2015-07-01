from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework import routers
from rest_framework_proxy.views import ProxyView
from sbirez import api, models

router = routers.DefaultRouter()
router.register(r'users', api.UserViewSet)
router.register(r'firms', api.FirmViewSet)
router.register(r'groups', api.GroupViewSet)
router.register(r'topics', api.TopicViewSet, 'topics')
router.register(r'proposals/partial', api.PartialProposalViewSet)
router.register(r'proposals', api.ProposalViewSet)
router.register(r'addresses', api.AddressViewSet)
router.register(r'persons', api.PersonViewSet)
router.register(r'documents', api.DocumentViewSet)
router.register(r'documentversions', api.DocumentVersionViewSet)
router.register(r'elements', api.ElementViewSet)
router.register(r'jargons', api.JargonViewSet)

urlpatterns = patterns('',
    url(r'^api/v1/topics/(?P<pk>[0-9]+)/saved/$', api.SaveTopicView.as_view()),
    url(r'^api/v1/proposals/(?P<pk>[0-9]+)/partial/$', api.PartialProposalViewSet.as_view(
        actions={'patch': 'partial_update', 'put': 'update', 'delete': 'destroy', }
        )),

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

    # permit downloads of uploaded files
    url(r'^api/v1/documents/(?P<pk>[0-9]+)/file/$',
        api.FileDownloadView.as_view(model=models.Document, file_field='file')),
    url(r'^api/v1/documentversions/(?P<pk>[0-9]+)/file/$',
        api.FileDownloadView.as_view(model=models.DocumentVersion, file_field='file')),

    # jwt authentication endpoint
    url(r'^auth/', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^auth-refresh/', 'rest_framework_jwt.views.refresh_jwt_token'),

    # angular app endpoint
    url(r'^$', 'sbirez.views.home', name='home'),
    url(r'^search/', 'sbirez.views.home', name='home'),
    url(r'^topic/', 'sbirez.views.home', name='home'),
    url(r'^app/', 'sbirez.views.home', name='home'),
    url(r'^signin/', 'sbirez.views.home', name='home'),
    url(r'^signup/', 'sbirez.views.home', name='home'),
    url(r'^reset/', 'sbirez.views.home', name='home'),

    # proxy company info searches to SAM API
    url(r'^api/v1/firms/search/(?P<searchterms>.*)$',
        ProxyView.as_view(source='registrations?qterms=%(searchterms)s&api_key='
                          + settings.REST_PROXY['API_KEY']),
        name='firm-search'),
)
