# Generating a dumpfile without this leads to errors like
# django.db.utils.IntegrityError: Problem installing fixture '/home/catherine/werk/afsbirez/sbirez/fixtures/topictest.json': Could not load contenttypes.ContentType(pk=12): duplicate key value violates unique constraint "django_content_type_app_label_611081bc506e4133_uniq"
python manage.py dumpdata --exclude=contenttypes --exclude=auth.Permission > sbirez/fixtures/topictest.json
