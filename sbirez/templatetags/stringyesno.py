from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter
@stringfilter
def stringyesno(value):
    if value == "true":
        return "yes"
    else:
        return "no"
