import yaml
import logging

from django.core.management.base import BaseCommand, CommandError
from sbirez.models import *

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    args = 'file_name'
    help = 'Loads workflow elements from a yaml file'

    def _save_element(self, element_dict, parent=None):
        fields = dict(element_dict)
        if parent:
            fields['parent_id'] = parent.id
        children = fields.pop('children', [])
        jargons = fields.pop('jargons', [])
        instance = Element(**fields)
        instance.save()
        for jargon in jargons:
            try:
                jargon_instance = Jargon.objects.get(name=jargon['name'])
                if (('html' in jargon) and
                    (jargon['html'] != jargon_instance.html)):
                    logger.warn(
                        'HTML for jargon `%s` already specified, ignoring edit'
                        % jargon_instance.name)
            except Jargon.DoesNotExist:
                jargon_instance = Jargon(name=jargon['name'],
                                         html=jargon['html'])
                jargon_instance.save()
            instance.jargons.add(jargon_instance)

        order = 1
        for child in children:
            child['order'] = order
            self._save_element(child, parent=instance)
            order += 1

    def handle(self, *args, **options):
        with open(args[0]) as infile:
            allelements = yaml.load(infile)
        order = 1
        for el in allelements:
            el['order'] = order
            self._save_element(el)
            order += 1
