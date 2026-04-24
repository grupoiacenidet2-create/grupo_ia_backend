from django.contrib import admin
from .models import Publication, Project, Event, Student, Course, News

admin.site.register(Publication)
admin.site.register(Project)
admin.site.register(Event)
admin.site.register(Student)  # <--- Agregado
admin.site.register(Course)   # <--- Agregado
admin.site.register(News)     # <--- Agregado