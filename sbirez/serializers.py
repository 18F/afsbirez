from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from sbirez.models import Topic
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model() 
        fields = ('password', 'url', 'email', 'groups')
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data.get('password'))
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class TopicSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Topic
        fields = ('topic_number', 'solicitation_id', 'url', 'title', 'agency',
                    'program', 'description', 'objective', 'pre_release_date',
                    'proposals_begin_date', 'proposals_end_date')