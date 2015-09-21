from .modules.copy_topic_csvs import load
from sbirez.models import Solicitation
from django.core.management.base import BaseCommand
from django.core.management import call_command, CommandError
from django.conf import settings
import subprocess
import os

class Command(BaseCommand):
    help = """Populates Topics with an .mdb dump.

    Usage: python manage.py importtopics <path to .mdb file> "<name of solicitation>"
    (solicitation name e.g. "DoD SBIR 2015.1"; use quotation marks)
    """

    def add_arguments(self, parser):

        parser.add_argument('mdb_filename')
        parser.add_argument('solicitation_name')
        # example: DoD SBIR 2015.1
        parser.add_argument('--clear', action='store_true',
                            default=False,
                            help='First, delete all records with this solicitation')

    def handle(self, mdb_filename, solicitation_name, clear=False, **options):

        if not os.path.isfile(mdb_filename):
            raise OSError("MS Access database %s not found" % mdb_filename)

        # Use MDB tools to dump CSVs from MS Access .mdb file
        os.system("mdb-export %s commands > data/command.csv" % mdb_filename)
        os.system("mdb-export %s agency > data/agency.csv" % mdb_filename)
        os.system("mdb-export %s topics > data/topic.csv" % mdb_filename)

        load(solicitation_name, clear=clear)

        call_command('indextopics')
