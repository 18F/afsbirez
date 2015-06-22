from django.contrib import admin
# Register your models here.

from .models import Solicitation, WorkflowDefinition
admin.site.register(Solicitation)
admin.site.register(WorkflowDefinition)

from django.contrib.auth.models import User, Group
admin.site.register(User)
