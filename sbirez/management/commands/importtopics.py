from .modules.copy_topic_csvs import load
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

    def handle(self, mdb_filename, solicitation_name, **options):

        if not os.path.isfile(mdb_filename):
            raise OSError("MS Access database %s not found" % mdb_filename)

        # Confirm that solicitation_name is for solicitation in the database
        proc = subprocess.Popen(#'ls',
                                '/usr/bin/psql -t -c "SELECT name FROM sbirez_solicitation" %s' %
                                settings.DATABASES['default']['NAME'],
                                stdout=subprocess.PIPE, shell=True)
        solicitation_names = [s.decode("utf-8").strip()
                              for s in proc.stdout.read().splitlines()
                              if s.strip()]
        if solicitation_name not in solicitation_names:
            raise CommandError("Available solicitation_names are: " + ", ".join(solicitation_names))

        confirm = input("Replace all existing data for solicitation %s (Y/n)?" % solicitation_name)
        if confirm.lower().startswith("n"):
            return

        # Use MDB tools to dump CSVs from MS Access .mdb file
        os.system("mdb-export %s commands > data/command.csv" % mdb_filename)
        os.system("mdb-export %s agency > data/agency.csv" % mdb_filename)
        os.system("mdb-export %s topics > data/topic.csv" % mdb_filename)

        load(solicitation_name)
        '''
        os.system("""psql -v ON_ERROR_STOP=1 -v solicitation="'%s'" -f data/copy_topic_csvs.sql %s""" %
                  (solicitation_name, settings.DATABASES['default']['NAME']))
                  '''


        call_command('indextopics')
