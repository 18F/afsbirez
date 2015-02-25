from django.contrib.auth.models import User, Group
from sbirez.models import Topic, Reference, Phase, Keyword, Area
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('password', 'url', 'username', 'email', 'groups')
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data.get('password'))
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')



class AreaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Area
        fields = ('area', )


class KeywordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Keyword
        fields = ('keyword', )


class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = ('phase', )


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = ('reference', )


class TopicSerializer(serializers.ModelSerializer):
    references = ReferenceSerializer(many=True)
    phases = PhaseSerializer(many=True)
    keywords = KeywordSerializer(many=True)
    areas = AreaSerializer(many=True)
    class Meta:
        model = Topic
        fields = ('id', 'topic_number', 'solicitation_id', 'url', 'title', 'agency',
                    'program', 'description', 'objective', 'pre_release_date',
                    'proposals_begin_date', 'proposals_end_date', 'days_to_close',
                    'status'
                    , 'references', 'phases', 'keywords', 'areas'
                    )




