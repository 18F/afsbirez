import json

def filter_json_for_unique(infile_name, outfile_name):
    with open(infile_name) as infile:
        content = json.load(infile)

    uniques = set(str(c) for c in content)
    uniques = [eval(u) for u in uniques]

    with open(outfile_name, 'w') as outfile:
        json.dump(uniques, outfile)


if __name__ == '__main__':
    filter_json_for_unique('aftopics.json', 'topics.json')