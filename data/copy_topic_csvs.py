from sbirez.model import Topic, Solicitation
from django.core.management.base import BaseCommand
from django.core.management import call_command, CommandError
from django.conf import settings
import subprocess
import os

def load(solicitation_name):
    import ipdb; ipdb.set_trace()
    raw_agency = csv.DictReader(open('data/agency.csv'))
    raw_command = csv.DictReader(open('data/command.csv'))
    raw_topic = csv.DictReader(open('data/topic.csv'))
    solicitation =
    Topic.objects.filter(solicitation__name=solicitation_name).delete()
