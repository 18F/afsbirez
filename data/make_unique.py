import json

with open('aftopics.json') as infile:
    content = json.load(infile)

uniques = set(str(c) for c in content)
uniques = [eval(u) for u in uniques]

with open('topics.json', 'w') as outfile:
    json.dump(uniques, outfile)
    

