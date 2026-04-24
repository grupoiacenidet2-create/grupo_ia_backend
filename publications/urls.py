from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicationViewSet, ProjectViewSet, EventViewSet, 
    StudentViewSet, CourseViewSet, NewsViewSet,
    get_scholar_publications, force_scholar_sync,
    import_from_scholar
)

router = DefaultRouter()

# Registros ÚNICOS
router.register(r'publications', PublicationViewSet, basename='publication')
router.register(r'projects', ProjectViewSet, basename='project') # Solo una vez
router.register(r'events', EventViewSet)
router.register(r'students', StudentViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'news', NewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('scholar-data/<str:scholar_id>/', get_scholar_publications, name='scholar_pubs'),
    path('force-sync/', force_scholar_sync, name='force_sync'),
    path('import-scholar/', import_from_scholar, name='import_scholar'),
]