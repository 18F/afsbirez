from sbirez.models import Topic, Solicitation, Phase
from sbirez.models import Keyword, Reference, Area
from sbirez.models import Person, PointOfContactRelationship
from django.core.management.base import BaseCommand
from django.core.management import call_command, CommandError
from django.conf import settings
from .splitting import split_retaining_splitter
import csv
import subprocess
import os
import re

text_splitter = re.compile(r"""OBJECTIVE:(?P<objective>.*?)
                               DESCRIPTION:(?P<description>.*?)
                               (?P<phases>PHASE\sI:.*?)
                               REFERENCES:(?P<references>.*)""",
                               re.VERBOSE | re.DOTALL)
phase_splitter = re.compile(r"(PHASE [IV]+:)", re.DOTALL)
blank_line = re.compile(r'[\r\n]{2,}')

area_names = {
    'AIRPLATFORM': 'Air Platform',
    'CHEMBIODEFENSE': 'Chem/Bio Defense',
    'GROUNDSEAVEH': 'Ground/Sea Vehicles',
    'HUMANSYSTEMS': 'Human Systems',
    'INFOSYSTEMS': 'Information Systems',
    'ITAR': 'ITAR',
    'NUCLEARTECH': 'Nuclear Technology',
    'SPACEPLATFORM': 'Space Platform',
}

def get_area_name(raw):
    return area_names.get(raw, raw.title())

def _add_points_of_contact(raw_topic, topic):
    tpoc_order = 1
    while True:
        tpoc_label = '' if tpoc_order == 1 else str(tpoc_order)
        tpoc_name = raw_topic.get('TPoc%s' % tpoc_label, '').strip()
        if not tpoc_name:
            break    # no more TPOCs
        try:
            tpoc = Person.objects.get(name=tpoc_name,
                          email=raw_topic.get('TPoc%sEmail' % tpoc_label),
                          phone=raw_topic.get('TPoc%sPhone' % tpoc_label),
                          fax=raw_topic.get('TPoc%sFax' % tpoc_label),
                          office=raw_topic.get('Tpoc%sOffSym' % tpoc_label),
                )
        except Person.DoesNotExist:
            tpoc = Person(name=tpoc_name,
                          email=raw_topic.get('TPoc%sEmail' % tpoc_label),
                          phone=raw_topic.get('TPoc%sPhone' % tpoc_label),
                          fax=raw_topic.get('TPoc%sFax' % tpoc_label),
                          office=raw_topic.get('Tpoc%sOffSym' % tpoc_label),
                          )
            tpoc.save()
        relat = PointOfContactRelationship(poc=tpoc,
            topic=topic, priority=tpoc_order)
        tpoc_order += 1
        relat.save()

def load(solicitation_name, clear=False):
    solicitation = Solicitation.objects.filter(
        name=solicitation_name).first()
    raw_agencies = csv.DictReader(open('data/agency.csv'))
    raw_commands = csv.DictReader(open('data/command.csv'))
    raw_topics = csv.DictReader(open('data/topic.csv'))
    if clear:
        # TODO: clear out tpoc people from these topics?
        Topic.objects.filter(solicitation__name=solicitation_name).delete()
    agencies = {a['AgencyID']: a['AgencyName'] for a in raw_agencies}
    commands = {a['CommandID']: a['CommandName'] for a in raw_commands}
    for raw_topic in raw_topics:
        text = raw_topic['Text']
        matches = text_splitter.search(text)
        topic = Topic(topic_number=raw_topic['Topic'],
                      solicitation=solicitation,
                      url=None,
                      agency=agencies[raw_topic['Agency']],
                      program=raw_topic['Program'],
                      description=matches.group('description').strip(),
                      objective=matches.group('objective').strip(),
                      fts='',
                      )
        topic.save()
        _add_points_of_contact(raw_topic, topic)
        phases = split_retaining_splitter(phase_splitter, matches.group('phases'))
        for phase_text in phases:
            phase = Phase(phase=phase_text, topic=topic)
            phase.save()
        for keyword in raw_topic['Keywords'].split(','):
            keyword = keyword.strip().lower()
            try:
                kw = Keyword.objects.get(keyword=keyword)
            except Keyword.DoesNotExist:
                kw = Keyword(keyword=keyword)
                kw.save()
            topic.keywords.add(kw)
        references = matches.group('references').strip()
        for reference_text in blank_line.split(references):
            reference = Reference(reference=reference_text, topic=topic)
            reference.save()
        for raw_area_name in raw_topic.keys():
            if (    raw_area_name.isupper()
                and (not raw_area_name.startswith('ACQ'))
                and raw_topic[raw_area_name] == '1'
                ):
                area_name = get_area_name(raw_area_name)
                try:
                    area = Area.objects.get(area=area_name)
                except Area.DoesNotExist:
                    area = Area(area=area_name)
                    area.save()
                topic.areas.add(area)
        topic.save()
