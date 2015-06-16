import doctest
import re
from itertools import zip_longest

def grouper(iterable, n, fillvalue=None):
    "Collect data into fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3, 'x') --> ABC DEF Gxx
    args = [iter(iterable)] * n
    return zip_longest(fillvalue=fillvalue, *args)

def split_retaining_splitter(splitter, target):
    """
    >>> splitter = re.compile(r'([\w]+:)')
    >>> split_retaining_splitter(splitter, 'a: b c: d e:f')
    ['a: b', 'c: d', 'e:f']
    """
    tuples = grouper(splitter.split(target)[1:], 2)
    return [''.join(t).strip() for t in tuples]

if __name__ == '__main__':
    doctest.testmod()
