from django.contrib.auth.models import Group
from django.utils import timezone
from django.contrib.auth import get_user_model
from sbirez.models import Topic, Firm, Workflow, Proposal, Address, Person
from sbirez.models import Element, Document
from rest_framework import viewsets, mixins, generics, status, permissions, exceptions
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from rest_framework.reverse import reverse
from sbirez.serializers import UserSerializer, GroupSerializer, TopicSerializer

from sbirez.serializers import FirmSerializer, ProposalSerializer, PartialProposalSerializer
from sbirez.serializers import WorkflowSerializer, AddressSerializer, ElementSerializer
from sbirez.serializers import PersonSerializer, DocumentSerializer
import marshmallow as mm
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsStaffOrTargetUser, IsStaffOrFirmRelatedUser 
from .permissions import HasObjectEditPermissions, ReadOnlyUnlessStaff

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),


class FirmViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Firm.objects.all()
    serializer_class = FirmSerializer

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return IsStaffOrFirmRelatedUser(),


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TopicParameterSchema(mm.Schema):
    q = mm.fields.String(description='Search term for any text field')   # TODO: what if somebody passes multiple values?
    closed = mm.fields.Boolean(default=False, description='Include closed topics (those whose close date has passed)')
    saved = mm.fields.Boolean(default=False, description='Limit results to my `saved` topics')
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
            queryset = queryset.filter(solicitation__proposals_end_date__gte = timezone.now())

        if params.get('saved'):
            # TODO: if not logged in, raise error?
            queryset = queryset.filter(saved_by__id=self.request.user.id)

        return queryset


class ResourceDoesNotExist(exceptions.APIException):
    status_code = 404
    default_detail = 'The resource being sought does not exist'


class SaveTopicView(generics.GenericAPIView):
    queryset = Topic.objects.all()
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        topic = self.get_object()
        topic.saved_by.add(request.user.id)
        topic.save()
        return Response(status=status.HTTP_206_PARTIAL_CONTENT)

    def delete(self, request, *args, **kwargs):
        topic = self.get_object()
        if topic.saved_by.filter(id=request.user.id).exists():
            topic.saved_by.remove(request.user.id)
        # Returning 204 even if the item never was saved in the first place (is this correct?)
        return Response(status=status.HTTP_204_NO_CONTENT)


class WorkflowViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer


class ElementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer

    def get_permissions(self):
        return [ReadOnlyUnlessStaff(), ]


class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    queryset = Proposal.objects.all()

    def get_queryset(self):
        queryset = Proposal.objects.all()
        if not self.request.user.is_staff:
            queryset = Proposal.objects.filter(firm=self.request.user.firm)
        return queryset

    def get_permissions(self):
        return [HasObjectEditPermissions(),]


class PartialProposalViewSet(ProposalViewSet):
    serializer_class = PartialProposalSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Document.objects.all()
        if not self.request.user.is_staff:
            queryset = Document.objects.filter(firm=self.request.user.firm)
        return queryset

    def get_permissions(self):
        return [HasObjectEditPermissions(),]
