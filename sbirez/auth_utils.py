from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
try:
    from django.utils.http import urlsafe_base64_decode as uid_decoder
except:
    # make compatible with django 1.5
    from django.utils.http import base36_to_int as uid_decoder
from django.contrib.auth.tokens import default_token_generator

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import rest_auth.serializers
from datetime import timedelta
from django.utils import timezone
from sbirez.models import PasswordHistory, SbirezUser

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
    try:
        prior_passwords = PasswordHistory.objects.filter(user_id=user.id).order_by('created_at').reverse()[:settings.AUTH_PASSWORD_HISTORY_COUNT]

        for p in prior_passwords:
            if user.password == p.password:
                raise serializers.ValidationError('Password can not have been one of the last %d passwords' % settings.AUTH_PASSWORD_HISTORY_COUNT)
    finally:
        return value

class ExpiringSetPasswordForm(SetPasswordForm):
    def save(self, commit=True):
        self.user.set_password(self.cleaned_data['new_password1'])
        self.user.password_expires = timezone.now() + timedelta(days = settings.AUTH_PASSWORD_EXPIRATION_DAYS)
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
        return password_check(value, self.user)
