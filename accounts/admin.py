from django.contrib import admin
from .models import Profile

# Esto hace que el modelo aparezca en el panel /admin
admin.site.register(Profile)