
if [ ! -f aftopics.json ]; then
    echo "Topic scrape results needed at aftopics.json"
    exit -1 
fi
python make_unique.py  # produces topics.json, with no duplicate entries, from aftopics.json
ddlgenerator --inserts postgresql topics.json > topics.sql
psql -f import_topics.sql sbirezdev
