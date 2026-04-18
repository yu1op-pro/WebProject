from django.contrib import admin
from .models import University,Faculty, Application, Review

admin.site.register(University)
admin.site.register(Faculty)
admin.site.register(Application)
admin.site.register(Review)