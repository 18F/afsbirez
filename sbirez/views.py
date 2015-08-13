from django.shortcuts import render
from django.template import Context, loader
from django.http.response import HttpResponse
from .models import Proposal

# Create your views here.
def home(request):
    return render(request, 'index.html')

def submission_report(request, pk):
    prop = Proposal.objects.get(pk=pk)
    # Form tuples with (workflow's question, proposal's response)
    data = [(el.reportable_question,
             el.reportable_answer(data))
            for (el, data, path) in
            prop.workflow.with_data(prop.data[prop.workflow.name], [])]
    template = loader.get_template('sbirez/submission_report.html')
    context = Context({'data': data})
    output = template.render(context)
    return HttpResponse(output)
