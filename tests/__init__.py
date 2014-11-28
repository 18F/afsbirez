import sys
import sure
sys.path.append('../')

from dougrain import Document
import json


def hal_loads(resp_str):
	"""
	Helper function that converts a string into a HAL object
	"""
	return Document.from_object(json.loads(resp_str))
