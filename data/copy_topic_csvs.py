from sbirez.models import Topic, Solicitation
from django.core.management.base import BaseCommand
from django.core.management import call_command, CommandError
from django.conf import settings
import csv
import subprocess
import os
import re

text_splitter = re.compile(r"""OBJECTIVE:(?P<objective>.*?)
                               DESCRIPTION:(?P<description>.*?)
                               PHASE\sI:(?P<phases>.*?)""",
                               re.VERBOSE | re.DOTALL)
phase_splitter = re.compile(r"PHASE [IV]+:", re.DOTALL)

def load(solicitation_name):
    solicitation = Solicitation.objects.filter(
        name=solicitation_name).first()
    raw_agencies = csv.DictReader(open('data/agency.csv'))
    raw_commands = csv.DictReader(open('data/command.csv'))
    raw_topics = csv.DictReader(open('data/topic.csv'))
    Topic.objects.filter(solicitation__name=solicitation_name).delete()
    agencies = {a['AgencyID']: a['AgencyName'] for a in raw_agencies}
    commands = {a['CommandID']: a['CommandName'] for a in raw_commands}
    import ipdb; ipdb.set_trace()
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
                      fts=None,
                      )
        topic.save()
        pass
