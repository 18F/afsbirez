from django import template
from django.template.defaultfilters import stringfilter

from django.contrib.humanize.templatetags.humanize import intcomma

register = template.Library()

@register.filter
@stringfilter
def money(dollars):
    print(dollars)
    try:
        dollars = round(float(dollars), 2)
        return "%s%s" % (intcomma(int(dollars)), ("%0.2f" % dollars)[-3:])
    except ValueError:
        return ""
