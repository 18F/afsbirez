from django.db import connection, transaction
from django.core.management.base import BaseCommand, CommandError
from sbirez.models import Naics
import os
import requests
import xlrd

DEFAULT_XLS_PATH = os.path.join('data', '2-digit_2012_Codes.xls')
XLS_URL = 'http://www.census.gov/eos/www/naics/2012NAICS/2-digit_2012_Codes.xls'

class Command(BaseCommand):
    args = 'file_name'
    help = 'Populates the NAICS table from census.gov data'

    def handle(self, *args, **options):

        existing = Naics.objects.count()
        if existing:
            confirm = input("OK to replace %d existing NAICS codes? (Y/n) " %
                            existing)
            if confirm.lower().strip().startswith('n'):
                print("NAICS download cancelled.")
                return

        Naics.objects.all().delete()
        print("Working... (warning: inexplicably slow)")

        if args:
            workbook = xlrd.open_workbook(args[0])
        else:
            try:
                workbook = xlrd.open_workbook(DEFAULT_XLS_PATH)
            except IOError as err:
                resp = requests.get(XLS_URL)
                if resp.ok:
                    with open(DEFAULT_XLS_PATH, 'wb') as outfile:
                        outfile.write(resp.content)
                    workbook = xlrd.open_workbook(DEFAULT_XLS_PATH)
                else:
                    raise IOError('%s returned %s' %
                                  (XLS_URL, RESP.status_code))

        sheet = workbook.sheets()[0]
        for row_num in range(3, sheet.nrows):
            row = sheet.row(row_num)
            (code, defc) = (row[1].value, row[2].value)
            if isinstance(code, float):
                naics = Naics(code=str(int(code)), description=defc)
                naics.save()
            pass

        sheet = workbook.sheets()[0]
