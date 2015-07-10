import json
import logging

from django.core.management.base import BaseCommand, CommandError
from sbirez.models import *

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Creates workflow definitions for any workflows that lack them'

    def handle(self, *args, **options):
        for element in Element.objects.filter(element_type='workflow') \
            .filter(workflowdefinition=None):
            data = element.dict()
            wf = WorkflowDefinition(workflow=element, source=data)
            #wf = WorkflowDefinition(workflow=element, source=json.dumps(data))
            wf.save(reassign_workflow=False)
