from sbirez.models import Topic, Solicitation, Phase, Keyword, Reference, Area
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

def load(solicitation_name):
    solicitation = Solicitation.objects.filter(
        name=solicitation_name).first()
    raw_agencies = csv.DictReader(open('data/agency.csv'))
    raw_commands = csv.DictReader(open('data/command.csv'))
    raw_topics = csv.DictReader(open('data/topic.csv'))
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
