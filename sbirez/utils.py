import collections
import jwt
from django.utils.encoding import smart_text
from django.utils.translation import ugettext as _
from rest_framework import exceptions
from rest_framework.authentication import (BaseAuthentication,
                                           get_authorization_header)
from rest_framework_jwt import utils
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.authentication import BaseJSONWebTokenAuthentication

from django.utils import timezone

from django.conf import settings

jwt_get_user_id_from_payload = api_settings.JWT_PAYLOAD_GET_USER_ID_HANDLER

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

    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        User = utils.get_user_model()

        user_id = jwt_get_user_id_from_payload(payload)
        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id, is_active=True)
                if user.password_expires < timezone.now():
                    msg = _('Password expired.')
                    raise exceptions.AuthenticationFailed(msg)
            except User.DoesNotExist:
                msg = _('Invalid signature.')
                raise exceptions.AuthenticationFailed(msg)
        else:
            msg = _('Invalid payload.')
            raise exceptions.AuthenticationFailed(msg)

        return user


# custom payload handler to add the user name and id to the jwt token.
def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'id': user.id,
        'username': user.get_username(),
    }



def nested_update(orig_dict, new_dict):
    """
    update ``orig_dict`` with ``new_dict``, and recurse
    into nested dicts
    Thanks to
    http://stackoverflow.com/a/18394648/86209
    """

    for (key, val) in new_dict.items():
        if isinstance(val, collections.Mapping):
            tmp = nested_update(orig_dict.get(key, { }), val)
            orig_dict[key] = tmp
        elif isinstance(val, list):
            orig_dict[key] = (orig_dict[key] + val)
        else:
            orig_dict[key] = new_dict[key]
    return orig_dict

