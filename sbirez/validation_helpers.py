from dateutil.parser import parse
from doctest import testmod, NORMALIZE_WHITESPACE
import shlex

class CustomValidationError(Exception):
    pass

tokenizers = {
    'words': lambda s: shlex.split(s),
    'comma_separated_phrases': lambda s: s.split(','),
    }

def _count(data, unit):
    """
    >>> _count('the quick, brown fox', 'words')
    4
    """
    try:
        tokenizer = tokenizers[unit]
    except KeyError:
        raise CustomValidationError('no tokenizer defined for %s' % unit)

    return len(tokenizer(data))


def _compare(data, target, comparitor, unit=None):

    if unit:
        data = _count(data, unit)
    try:
        target = int(target)
        data = int(data)
    except ValueError:
        pass # leave data as string

    return comparitor(data, target)

def not_more_than(all_fields, data, target, unit=None):
    """
    >>> not_more_than({}, '60', '50')
    False
    >>> not_more_than({}, '40', '50')
    True
    """
    comparitor = lambda d, t: d <= t
    return _compare(data, target, comparitor, unit)

no_more_than = not_more_than

def not_less_than(all_fields, data, target, unit=None):
    comparitor = lambda d, t: d >= t
    return _compare(data, target, comparitor, unit)

no_less_than = not_less_than

def equals(all_fields, data, target, unit=None):
    comparitor = lambda d, t: d == t
    return _compare(data, target, comparitor, unit)

def does_not_equal(all_fields, data, target, unit=None):
    comparitor = lambda d, t: d != t
    return _compare(data, target, comparitor, unit)

def one_of(all_fields, data, target):
    targets = [s.lower() for s in target.split()]

if __name__ == '__main__':
    testmod(optionflags=NORMALIZE_WHITESPACE)