import doctest
import sbirez.validation_helpers

def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(sbirez.validation_helpers))
    return tests
