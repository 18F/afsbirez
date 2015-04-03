import yaml

from django.core.management.base import BaseCommand, CommandError
from sbirez.models import *

class Command(BaseCommand):
    args = 'file_name'
    help = 'Loads workflow elements from a yaml file'

    def _save_element(self, element_dict, parent=None):
        fields = dict(element_dict)
        if parent:
            fields['parent_id'] = parent.id
        children = fields.pop('children', [])
        instance = Element(**fields)
        instance.save()
        order = 1
        for child in children:
            child['order'] = order
            self._save_element(child, parent=instance)
            order += 1

    def handle(self, *args, **options):
        #import ipdb; ipdb.set_trace()
        with open(args[0]) as infile:
            allelements = yaml.load(infile)
        order = 1
        for el in allelements:
            el['order'] = order
            self._save_element(el)
            order += 1
