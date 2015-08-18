from django.shortcuts import render
from io import BytesIO
from django.template import Context, loader
from django.http.response import HttpResponse
from .models import Proposal
from wkhtmltopdf.views import PDFTemplateView
from PyPDF2 import PdfFileMerger
from wkhtmltopdfwrapper import WKHtmlToPdf
import tempfile
import requests

to_pdf_generator = WKHtmlToPdf()

# Create your views here.
def home(request):
    return render(request, 'index.html')

class ProposalPdfView(PDFTemplateView):

    def get(self, request, pk):
        merger = PdfFileMerger()
        coverfile = open('sbirez/static/coverpage.pdf', 'rb')
        merger.append(coverfile)

        to_pdf_generator.render(
            'http://localhost:8000/submissions/raw/3/',
            'outfile.pdf')
        contentfile = open('outfile.pdf', 'rb')
        merger.append(contentfile)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = \
            'attachment; filename="sbirez_proposal.pdf"'
        merger.write(response)
        return response


def submission_report(request, pk):
    prop = Proposal.objects.get(pk=pk)
    template = loader.get_template('sbirez/submission_report.html')
    context = Context({'data': prop.report()})
    output = template.render(context)
    return HttpResponse(output)
