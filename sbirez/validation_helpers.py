"""
Defines a set of validation functions, each following this pattern:

    def val_function_name(all_fields, data, target, unit=None)

returning a `bool`

`all_fields`: a dict containing all submitted data (for functions that
              check the value of more than one field)
`data`:       the specific field value of interest.  Can be in dirty string form.
`target`:     the value to commpare `data` against
`unit`:       A named transformation to apply to `data` to quantify it for comparison.
              currently defined transformations are in `validation_helpers.quantifiers`

For example,

>>> not_more_than({}, 'delivery is the strategy', 3, 'words')
False

counts the `'words'` in `'delivery is the strategy'` and compares to 3.
"""

from dateutil.parser import parse
from decimal import Decimal
from doctest import testmod, NORMALIZE_WHITESPACE
import re
import shlex

from quantity_helpers import to_integer, to_decimal, to_days, to_months

# for custom validators to call

class CustomValidationError(Exception):
    pass

quantifiers = {
    'words': lambda s: shlex.split(s),
    'comma_separated_phrases': lambda s: s.split(','),
    'days': to_days,
    'months': to_months,
    }

def _count(data, unit):
    """
    >>> _count('the quick, brown fox', 'words')
    4
    """
    try:
        quantifier = quantifiers[unit]
    except KeyError:
        raise CustomValidationError('no quantifier defined for %s' % unit)

    result = quantifier(data)
    try:
        return len(result)  # when quantifier returns a string
    except TypeError:
        return result

def _compare(data, target, comparitor, unit=None):
    """
    >>> comparitor = lambda x, y: x > y
    >>> _compare(5, 2, comparitor)
    True
    >>> _compare('5', '12', comparitor)
    False
    >>> _compare('i have four words', 3, comparitor, 'words')
    True
    >>> _compare('letter b', 'letter a', comparitor)
    True
    >>> _compare('6 mo', 185, comparitor, 'days')
    False
    """

    if unit:
        data = _count(data, unit)
    try:
        target = to_integer(target)
    except TypeError:
        # if target is not a number, this must be a simple string comparison
        return comparitor(data, target)
    # not trapping this error - if target is a number but data is not, should raise
    data = to_integer(data)
    return comparitor(data, target)

# Functions for inclusion in workflows

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
    """
    >>> one_of({}, 'ms.',  'Mr. Mrs. Ms. Miss')
    True
    >>> one_of({}, 'Supreme Overlord',  'Mr. Mrs. Ms. Miss')
    False
    """
    targets = target.lower().split()
    return data.lower().strip() in targets

if __name__ == '__main__':
    testmod(optionflags=NORMALIZE_WHITESPACE)