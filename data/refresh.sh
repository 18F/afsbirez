
if [ ! -f aftopics.json ]; then
    echo "Topic scrape results needed at aftopics.json"
    exit -1 
fi
#dropdb sbirezdev; createdb sbirezdev
#python ../manage.py db upgrade
python make_unique.py  # produces topics.json, with no duplicate entries, from aftopics.json
ddlgenerator --inserts postgresql topics.json > topics.sql
psql -f import_topics.sql sbirezdev
