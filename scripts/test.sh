#!/bin/sh
dredd apiary.apib http://www.sbir.gov/
RESULT=$?
exit $RESULT
