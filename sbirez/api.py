import collections
import json
import hashlib
import os
import re

from django.contrib.auth.models import Group
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.template import Context, loader
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

from PyPDF2 import PdfFileMerger
from wkhtmltopdfwrapper import WKHtmlToPdf

to_pdf_generator = WKHtmlToPdf()

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

    def _readonly_report(self, request, pk, template_name, report_filter):
        """Web version of our PDF hardcopy report"""
        prop = self.get_object()
        template = loader.get_template(template_name)
        context = Context({'prop': prop,
                           'report': prop.report(report_filter)})
        rpt = list(prop.report(report_filter))
        output = template.render(context)
        return HttpResponse(output)

    @detail_route(methods=['get',])
    def coversheet(self, request, pk):
        return self._readonly_report(request, pk,
            'sbirez/coversheet.html', 'dod_workflow.dod_coversheet')

    def _general_admin_targets(self, cost_volume_data):
        ga_target_abbreviations = collections.OrderedDict(
            TDL='general_admin_rate_labor',
            TDM='general_admin_rate_materials',
            TODC='general_admin_rate_other')
        apply_ga_to = []
        for (abbrev, field_name) in ga_target_abbreviations.items():
            if cost_volume_data.get('cv_totals', {}).get(field_name):
                apply_ga_to.append(abbrev)
        if apply_ga_to:
            apply_ga_to = '+'.join(apply_ga_to)
        else:
            apply_ga_to = '0'
        return apply_ga_to

    @detail_route(methods=['get',])
    def cost_volume(self, request, pk):
        prop = self.get_object()
        template = loader.get_template('sbirez/cost_volume.html')
        cost_volume_data = prop.data['dod_workflow'].get('dod_cost_volume', {})
        ga_basis = self._general_admin_targets(cost_volume_data)
        context = Context({'prop': prop,
                           'data': cost_volume_data,
                           'ga_basis': ga_basis})
        output = template.render(context)
        return HttpResponse(output)

    # For reasons I don't understand, `request.auth`
    # is not filled out when `.pdf` is called from the
    # test suite; instead, the jwt must be painstakingly
    # extracted this way.
    # Irrelevant unless test_get_pdf is re-enabled.
    _jwt_extractor = re.compile(r"\?jwt\=(.*?)'")
    def _jwt_from_request(self, request):
        result = self._jwt_extractor.search(str(request._request))
        if result:
            return result.group(1)

    def _pdf_of_html_report(self, request, pk, report_name):
        # Use wkhtmltopdf to write PDF of HTML report to file on disk
        jwt = request.auth or self._jwt_from_request(request)
        proposal_filename = 'data/%s_%s.pdf' % (report_name, pk)
        url = request.build_absolute_uri('../%s/?jwt=%s'
            % (report_name, jwt))
        to_pdf_generator.render(url, proposal_filename)
        # Read from the PDF just dumped
        contentfile = open(proposal_filename, 'rb')
        return contentfile

        merger.append(contentfile)

    @detail_route(methods=['get',])
    def pdf(self, request, pk):
        """
        Generates PDF summary of a proposal.

        Gets content from `.readonly_report`;
        uses `PdfFileMerger` to prepend a stored cover page.
        """
        # A PdfFileMerger instance used to concat PDFs
        merger = PdfFileMerger()

        coverfile = open('sbirez/static/coverpage.pdf', 'rb')
        merger.append(coverfile)

        coversheet_file = self._pdf_of_html_report(request, pk, 'coversheet')
        merger.append(coversheet_file)

        # Add uploaded documents
        prop = self.get_object()
        for doc in prop.document_set.all():
            merger.append(doc.file)

        cost_volume_file = self._pdf_of_html_report(request, pk, 'cost_volume')
        merger.append(cost_volume_file)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = \
            'attachment; filename="sbirez_proposal.pdf"'
        merger.write(response)
        for f in (coversheet_file, cost_volume_file):
            os.unlink(f.name)
            f.close()

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
