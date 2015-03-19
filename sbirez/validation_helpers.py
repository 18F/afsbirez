from dateutil.parser import parse

def no_more_than(data, field, limit, units=None):
	"""`field` Less Than or Equal to `limit`"""
	return float(field) <= limit

def no_less_than(data, field, limit, units=None):
	"""`field` Less Than or Equal to `limit`"""
	return float(field) <= limit

def does_not_equal(data, field, target):
	return field.strip().lower() != target.strip().lower()

lte = no_more_than
gte = no_less_than