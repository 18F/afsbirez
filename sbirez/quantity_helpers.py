"""
Functions to clean up values and convert them to recognized quantities.
"""

from dateutil.parser import parse
from decimal import Decimal
from doctest import testmod, NORMALIZE_WHITESPACE
import re
import shlex

# for custom validators to call

class CustomValidationError(Exception):
    pass

_numberify = re.compile(r'^\s*\$?\s*(?P<quant>\-?\s*[0-9\,\.]+)\s*(?P<oom>k|m|g)?\s*$', re.IGNORECASE)
_order_of_magnitude_abbrevs = {"k": 1000, "m": 1000000, "g": 1000000000}

def to_decimal(data):
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

def to_integer(data):
    """
    >>> to_integer(7)
    7
    >>> to_integer("-4.3")
    -4
    >>> to_integer("$45,210")
    45210
    >>> to_integer(" $ 9K")
    9000
    """
    return int(to_decimal(data))


_date_quantities = {'hours': 1. / 24.,
                    'days': 1,
                    'weeks': 7,
                    'months': 30,
                    'quarters': 90,
                    'years': 365}

def _is_abbreviation_for(abbreviated, full):
    """
    >>> _is_abbreviation_for('yr', 'years')
    True
    >>> _is_abbreviation_for('years', 'years')
    True
    >>> _is_abbreviation_for('szco', 'years')
    False

    Thanks to Michael Brennan
    http://stackoverflow.com/questions/7331462/check-if-a-string-is-a-possible-abbrevation-for-a-name/7332054#7332054
    """
    abbreviated = abbreviated.strip()
    if abbreviated:
        pattern = ".*".join(abbreviated)
        return bool(re.match("^" + pattern, full, re.IGNORECASE))

_split_number_from_quantity_name = re.compile(r"(?P<quant>[\d\.]+)(?P<quant_name>[^\d].*)?")

def to_days(data):
    """
    >>> to_days("6.5 months")
    195
    >>> to_days("11")
    11
    >>> to_days("6 WKS")
    42
    >>> to_days("3y")
    1095
    """
    match = _split_number_from_quantity_name.search(data)
    if not match:
        raise CustomValidationError("%s not a time quantity" % data)
    quant = float(match.group("quant"))
    abbrev_quant_name = match.group('quant_name')
    if not abbrev_quant_name:
        return int(quant)
    for quant_name in _date_quantities:
        if _is_abbreviation_for(abbrev_quant_name, quant_name):
            return int(_date_quantities[quant_name] * quant)
    raise CustomValidationError("%s not a time quantity" % data)

def to_months(data):
    return int(to_days(data) / 30.)

if __name__ == '__main__':
    testmod(optionflags=NORMALIZE_WHITESPACE)