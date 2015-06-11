from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings
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
        os.system("mdb-export %s commands > data/command.csv" % mdb_filename)
        os.system("mdb-export %s agency > data/agency.csv" % mdb_filename)
        os.system("mdb-export %s topics > data/topic.csv" % mdb_filename)

        os.system("""psql -v solicitation="%s" -f data/copy_topic_csvs.sql %s""" %
                  (solicitation_name, settings.DATABASES['default']['NAME']))

        call_command('indextopics')