from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
try:
    from django.utils.http import urlsafe_base64_decode as uid_decoder
except:
    # make compatible with django 1.5
    from django.utils.http import base36_to_int as uid_decoder
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import identify_hasher
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import rest_auth.serializers
from datetime import timedelta
from django.utils import timezone
from sbirez.models import PasswordHistory, SbirezUser
from Levenshtein import distance

def password_check(value, user):
    """
    Check that the password passes the following validation:

    Password is long enough (based on configuration setting)
    Password contains at least one digit
    Password contains at least one letter
    Password contains at least one uppercase character
    Password contains at least one special character
    Password has not been reused in a configurable number of password cycles
    """
    if len(value) < settings.AUTH_PASSWORD_LENGTH:
        raise serializers.ValidationError('Password is too short')
    # check for digit
    if not any(char.isdigit() for char in value):
        raise serializers.ValidationError('Password must contain at least 1 digit.')
    # check for letter
    if not any(char.isalpha() for char in value):
        raise serializers.ValidationError('Password must contain at least 1 letter.')
    # check for upper case letter
    if not any(char.isupper() for char in value):
        raise serializers.ValidationError('Password must contain at least 1 uppercase letter.')
    # check for symbol
    predef = set('!@#$%&*()')
    if not any(char in predef for char in value):
        raise serializers.ValidationError('Password must contain at least 1 special character.')

    # new users won't have a password history at this point
    if user is not None:
        prior_passwords = PasswordHistory.objects.filter(user_id=user.id).order_by('created_at').reverse()[:settings.AUTH_PASSWORD_HISTORY_COUNT]

        for p in prior_passwords:
            hasher = identify_hasher(p.password)
            print(value, p.password)
            if hasher.verify(value, p.password):
                raise serializers.ValidationError('Password can not have been one of the last %d passwords' % settings.AUTH_PASSWORD_HISTORY_COUNT)

    return value

class ExpiringSetPasswordForm(SetPasswordForm):
    def save(self, commit=True):
        self.user.set_password(self.cleaned_data['new_password1'])
        self.user.password_expires = timezone.now() + timedelta(days = settings.AUTH_PASSWORD_EXPIRATION_DAYS)
        PasswordHistory.objects.create(password=self.user.password, user=self.user)
        if commit:
            self.user.save()
        return self.user


class PasswordResetConfirmSerializer(rest_auth.serializers.PasswordResetConfirmSerializer):

    set_password_form_class = ExpiringSetPasswordForm

    def custom_validation(self, attrs):
        return password_check(attrs['new_password1'], self.user)


class PasswordChangeSerializer(rest_auth.serializers.PasswordChangeSerializer):

    set_password_form_class = ExpiringSetPasswordForm

    def validate_new_password1(self, value):
        if distance(value, self.initial_data['old_password']) < settings.AUTH_PASSWORD_DIFFERENCE:
            raise serializers.ValidationError('Password must differ from the prior password by at least %d characters' % settings.AUTH_PASSWORD_DIFFERENCE)
        return password_check(value, self.user)


class ExpiringModelBackend(object):
    """
    Authenticates against settings.AUTH_USER_MODEL.
    """

    def authenticate(self, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            user = UserModel._default_manager.get_by_natural_key(username)
            if user.password_expires > timezone.now() and user.check_password(password):
                return user
            elif user.password_expires <= timezone.now() and user.check_password(password):
                raise serializers.ValidationError('Password has expired.')

        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            UserModel().set_password(password)
