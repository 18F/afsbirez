import json
import hashlib

from django.contrib.auth.models import Group
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from sbirez.models import Topic, Firm, Proposal, Address, Person, Naics
from sbirez.models import Element, Document, DocumentVersion, Jargon
from rest_framework import viewsets, mixins, generics, status, permissions, exceptions
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from rest_framework.reverse import reverse
from sbirez.serializers import UserSerializer, GroupSerializer, TopicSerializer
from django_downloadview import ObjectDownloadView
from djmail import template_mail

from sbirez.serializers import FirmSerializer, ProposalSerializer, PartialProposalSerializer
from sbirez.serializers import AddressSerializer, ElementSerializer
from sbirez.serializers import JargonSerializer, NaicsSerializer
from sbirez.serializers import PersonSerializer, DocumentSerializer, DocumentVersionSerializer
import marshmallow as mm
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsStaffOrTargetUser, IsStaffOrFirmRelatedUser
from .permissions import HasObjectEditPermissions, ReadOnlyUnlessStaff
from .utils import nested_update
from .pdf import proposal_pdf
from PyPDF2 import PdfFileMerger
from django.template import Context, loader

mails = template_mail.MagicMailBuilder()
# To send new types of emails from views, simply call
# `mails.my_new_email_name(target_email_address, {dict for template substitution})
# and write files `sbirez/templates/emails/my_new_email_name-body-text.html`
# (or `sbirez/templates/emails/my_new_email_name-body-html.html`)
# and `sbirez/templates/emails/my_new_email_name-subject.html`

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


class NaicsViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Naics.objects.all()
    serializer_class = NaicsSerializer


class FirmViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Firm.objects.all()
    serializer_class = FirmSerializer

    def get_permissions(self):
        return (IsStaffOrFirmRelatedUser(), )
        # allow non-authenticated user to create via POST
        # return (AllowAny() if self.request.method == 'POST'
        #     else IsStaffOrFirmRelatedUser()),


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


class ElementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer

    def get_permissions(self):
        return [ReadOnlyUnlessStaff(), ]


class JargonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Jargon.objects.all()
    serializer_class = JargonSerializer

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

    @detail_route(methods=['get,'])
    def hardcopy(self, request, pk):
        proposal = self.get_object()

        return Response({})


    @detail_route(methods=['get',])
    def pdf(self, request, pk):
        proposal = self.get_object()

        # `merger` assembles a PDF in memory
        merger = PdfFileMerger()
        coverfile = open('sbirez/static/coverpage.pdf', 'rb')
        merger.append(coverfile)

        # fill buffer with wkhtmltopdf
        response = PDFTemplateView.get(pk=pk)
        import ipdb; ipdb.set_trace()
        merger.append(buffer)

        # Write from the PDF into a file-like response object
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = \
            'attachment; filename="somefilename.pdf"'
        merger.write(response)

        coverfile.close()

        proposal_pdf(proposal=self.get_object(),
                     output_file=response)
        return response

    @detail_route(methods=['post',])
    def submit(self, request, pk):
        prop = self.get_object()
        prop.submitted_at = timezone.now()
        prop.save()
        email = mails.submit_notification(prop.owner.email,
                                          {'proposal': prop})
        email.send()
        email = mails.mock_submission(prop.owner.email,
            {'proposal': prop, 'data':
              json.dumps(prop.data, indent=2, sort_keys=True)
            })

        for doc in prop.document_set.all():
            content = doc.file.read()
            # decoding necessary due to an unfixed Django bug
            # see https://code.djangoproject.com/ticket/24623
            try:
                content = content.decode('utf-8')
            except (AttributeError, UnicodeDecodeError):
                pass   # apparently it was not a 'bytes' type
            email.attach(doc.file.name, content)
        email.send()
        return Response({'status': 'Submission completed'})


class PartialProposalViewSet(ProposalViewSet):
    serializer_class = PartialProposalSerializer

    def partial_update(self, request, *args, **kwargs):
        if 'data' in request.data:
            try:
                instance = self.get_object()
                data = nested_update(instance.data, json.loads(request.data['data']))
                instance.verified_at = None
                request.data['data'] = json.dumps(data)
            except AttributeError:
                pass
        return super(PartialProposalViewSet, self).partial_update(request, *args, **kwargs)


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = (IsAuthenticated, HasObjectEditPermissions, )

    def get_queryset(self):
        queryset = Document.objects.all()
        if not self.request.user.is_staff:
            queryset = Document.objects.filter(firm=self.request.user.firm)
        return queryset

    def create(self, request, *args, **kwargs):
        data = dict(request.data.items())
        data['firm'] = request.user.firm_id

        # cut-and-pasted from rest_framework.mixins.CreateModelMixin, because I can't
        # find a way to make it accept an edit to request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        result = Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        ver = DocumentVersion(file=request.data['file'],
                              document_id=result.data['id'])
        ver.save()
        return result

    def update(self, request, *posargs, **kwargs):
        # TODO: What if you try to update the `firm`?

        result = super(DocumentViewSet, self).update(request, *posargs, **kwargs)
        if 'file' in request.data:
            ver = DocumentVersion(file=request.data['file'], document_id = result.data['id'])
            ver.save()

        # re-querying seems awful, but otherwise the result contains obsolete data
        # from before the new version was attached
        result = self.retrieve(request, pk=result.data['id'])
        return result


class FileDownloadView(ObjectDownloadView, generics.GenericAPIView):

    permission_classes = (IsStaffOrFirmRelatedUser, )


class DocumentVersionViewSet(viewsets.ModelViewSet):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = (IsAuthenticated,)
