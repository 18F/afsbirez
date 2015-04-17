import jwt
from django.utils.encoding import smart_text
from django.utils.translation import ugettext as _
from rest_framework import exceptions
from rest_framework.authentication import (BaseAuthentication,
                                           get_authorization_header)
from rest_framework_jwt import utils
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.authentication import BaseJSONWebTokenAuthentication 

# Utility methods for the sbirez application
class JSONWebTokenAuthenticationFlex(BaseJSONWebTokenAuthentication):

    www_authenticate_realm = 'api'

    def get_jwt_value(self, request):
        auth = get_authorization_header(request).split()
        auth_header_prefix = api_settings.JWT_AUTH_HEADER_PREFIX.lower()

        if not auth or smart_text(auth[0].lower()) != auth_header_prefix:
            return request.QUERY_PARAMS.get('jwt')

        if len(auth) == 1:
            msg = _('Invalid Authorization header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid Authorization header. Credentials string '
                    'should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        return auth[1]

    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response, or `None` if the
        authentication scheme should return `403 Permission Denied` responses.
        """
        return 'JWT realm="{0}"'.format(self.www_authenticate_realm)



# custom payload handler to add the user name and id to the jwt token.
def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'id': user.id,
        'username': user.get_username(),
    }
