from django.contrib.auth.models import User, Group
from sbirez.models import Topic
from rest_framework import viewsets
from sbirez.serializers import UserSerializer, GroupSerializer, TopicSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TopicViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows topics to be viewed or edited.
    """
    serializer_class = TopicSerializer

    def get_queryset(self):
        """
        Find records for /topics query; apply any filters called
        """

        params = dict(self.request.QUERY_PARAMS)
        q = params.pop('q', None)
        if q is None:
            queryset = Topic.objects.all()
        else:
            queryset = Topic.objects.search(q)

        return queryset
