"""
Defines a set of validation functions, each following this pattern:

    def val_function_name(all_fields, data, target, unit=None)

returning a `bool`

`all_fields`: a dict containing all submitted data (for functions that
              check the value of more than one field)
`data`:       the specific field value of interest.  Can be in dirty string form.
`target`:     the value to commpare `data` against
`unit`:       A named transformation to apply to `data` to quantify it for comparison.
              currently defined transformations are in `validation_helpers.tokenizers`

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

# for custom validators to call

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

_numberify = re.compile(r'^\s*\$?\s*(?P<quant>\-?\s*[0-9\,\.]+)\s*(?P<oom>k|m|g)?\s*$', re.IGNORECASE)
_order_of_magnitude_abbrevs = {"k": 1000, "m": 1000000, "g": 1000000000}

def _to_decimal(data):
    """Tries to convert string to decimal, discarding non-numeric characters:
    commas, whitespace, $ sign
    """
    if hasattr(data, 'lower'):
        match = _numberify.search(data)
        if match:
            (quant, oom) = match.groups()
            quant = Decimal(quant.replace(',',''))
            if oom:
                quant *= _order_of_magnitude_abbrevs[oom.lower()]
            return quant
        else:
            raise TypeError("'%s' not a number" % data)
        data = data.lstrip("$")
    return Decimal(data)

def _to_integer(data):
    """
    >>> _to_integer(7)
    7
    >>> _to_integer("-4.3")
    -4
    >>> _to_integer("$45,210")
    45210
    >>> _to_integer(" $ 9K")
    9000
    """
    return int(_to_decimal(data))

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
    """

    if unit:
        data = _count(data, unit)
    try:
        target = _to_integer(target)
    except TypeError:
        # if target is not a number, this must be a simple string comparison
        return comparitor(data, target)
    # not trapping this error - if target is a number but data is not, should raise
    data = _to_integer(data)
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
    targets = [s.lower() for s in target.split()]

if __name__ == '__main__':
    testmod(optionflags=NORMALIZE_WHITESPACE)