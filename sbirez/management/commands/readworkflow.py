import yaml
import logging

from django.core.management.base import BaseCommand, CommandError
from sbirez.models import *

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    args = 'file_name'
    help = 'Loads workflow elements from a yaml file'

    def handle(self, *args, **options):
        with open(args[0]) as infile:
            allelements = yaml.load(infile)
        order = 1
        for el in allelements:
            el['order'] = order
            Element.from_dict(el)
            order += 1
