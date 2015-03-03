from django.contrib.auth.models import Group
from django.utils import timezone
from django.contrib.auth import get_user_model
from sbirez.models import Topic, SavedTopic
from rest_framework import viewsets
from sbirez.serializers import UserSerializer, GroupSerializer, TopicSerializer, SavedTopicSerializer
import marshmallow as mm

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TopicParameterSchema(mm.Schema):
    q = mm.fields.String(description='Search term for any text field')   # TODO: what if somebody passes multiple values?
    closed = mm.fields.Boolean(default=False)
    order = mm.fields.String(default='desc', validate=lambda x: x.lower() in ('asc', 'desc'))

topic_parameter_schema = TopicParameterSchema()


class TopicViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows topics to be viewed or edited.

    closed -- Include closed topics in results (those whose proposals_end_date has passed)  bool
    """
    serializer_class = TopicSerializer

    def get_queryset(self):
        """
        Find records for /topics query; apply any filters called
        """

        if self.lookup_field in self.kwargs:
            # getting a single item by pk, ignore all filters
            return Topic.objects.all()

        topic_parameter_schema.validate(self.request.query_params)
        (params, err) = topic_parameter_schema.load(self.request.query_params)

        fulltext_query = params.get('q')
        if fulltext_query:
            queryset = Topic.objects.search(fulltext_query)
        else:
            queryset = Topic.objects.all()

        if not params.get('closed'):
            queryset = queryset.filter(proposals_end_date__gte = timezone.now())

        return queryset

class SavedTopicViewSet(viewsets.ModelViewSet):
    queryset = SavedTopic.objects.all()
    serializer_class = SavedTopicSerializer
