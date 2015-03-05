from django.contrib.auth.models import User, Group
from sbirez.models import Topic, Reference, Phase, Keyword, Area
from django.contrib.auth import get_user_model
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):

    saved_topics = serializers.HyperlinkedRelatedField(many=True,
                                                       view_name='topic-detail',
                                                       read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('password', 'url', 'email', 'groups', 'saved_topics',)
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
    is_saved_by_me = serializers.SerializerMethodField()

    def get_is_saved_by_me(self, obj):
        current_user = self.context.get('request').user
        if current_user.is_anonymous():
            return None
        else:
            return obj.saved_by.filter(id=current_user.id).exists()

    class Meta:
        model = Topic
        fields = ('id', 'topic_number', 'solicitation_id', 'url', 'title', 'agency',
                    'program', 'description', 'objective', 'pre_release_date',
                    'proposals_begin_date', 'proposals_end_date', 'days_to_close',
                    'status'
                    , 'references', 'phases', 'keywords', 'areas',
                    'is_saved_by_me',
                    )

