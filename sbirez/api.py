from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model 
from sbirez.models import Topic
from rest_framework import viewsets
from sbirez.serializers import UserSerializer, GroupSerializer, TopicSerializer


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

class TopicViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows topics to be viewed or edited.
    """
    serializer_class = TopicSerializer

    def get_queryset(self):
        queryset = Topic.objects.all()
        title = self.request.QUERY_PARAMS.get('title', None)
        if title is not None:
            queryset = queryset.filter(title__contains=title)
        return queryset
