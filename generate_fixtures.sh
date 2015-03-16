# Generating a dumpfile without this leads to KeyErrors
python manage.py dumpdata --exclude=contenttypes --exclude=auth.Permission > sbirez/fixtures/topictest.json
