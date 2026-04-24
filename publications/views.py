import urllib.parse
from datetime import date
from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from scholarly import scholarly

# Modelos y Serializers
from accounts.models import Profile 
from .models import Publication, Project, Event, Student, Course, News 
from .serializers import (
    PublicationSerializer, ProjectSerializer, EventSerializer,
    StudentSerializer, CourseSerializer, NewsSerializer
)

# --- UTILIDAD DE LIMPIEZA ---
def get_clean_scholar_id(request):
    """Extrae y limpia el scholar_id de los parámetros de la URL"""
    sid = request.query_params.get('scholar_id')
    if sid:
        return sid.split('&')[0].strip()
    return None

# --- VIEWSETS (Actualizados con Borrado Lógico) ---

class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Filtramos para que solo aparezcan los activos
        qs = Publication.objects.filter(is_active=True)
        scholar_id = get_clean_scholar_id(self.request)
        if scholar_id:
            return qs.filter(author__profile__scholar_id=scholar_id).order_by('-date_published')
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return qs.order_by('-date_published')
            return qs.filter(author=self.request.user).order_by('-date_published')
        return qs.order_by('-date_published')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_destroy(self, instance):
        # BORRADO LÓGICO
        instance.is_active = False
        instance.save()

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    
    def get_queryset(self):
        qs = Student.objects.filter(is_active=True)
        scholar_id = get_clean_scholar_id(self.request)
        if scholar_id: return qs.filter(doctor__profile__scholar_id=scholar_id)
        if self.request.user.is_authenticated:
            if self.request.user.is_staff: return qs
            return qs.filter(doctor=self.request.user)
        return Student.objects.none()

    def perform_create(self, serializer): serializer.save(doctor=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        qs = Course.objects.filter(is_active=True)
        scholar_id = get_clean_scholar_id(self.request)
        if scholar_id: return qs.filter(doctor__profile__scholar_id=scholar_id)
        if self.request.user.is_authenticated:
            if self.request.user.is_staff: return qs
            return qs.filter(doctor=self.request.user)
        return Course.objects.none()

    def perform_create(self, serializer): serializer.save(doctor=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class NewsViewSet(viewsets.ModelViewSet):
    serializer_class = NewsSerializer
    queryset = News.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        qs = News.objects.filter(is_active=True)
        if self.request.query_params.get('featured') == 'true': 
            return qs.filter(is_important=True).order_by('-created_at')
        scholar_id = get_clean_scholar_id(self.request)
        if scholar_id: return qs.filter(doctor__profile__scholar_id=scholar_id).order_by('-created_at')
        if self.request.user.is_authenticated:
            if self.request.user.is_staff: return qs.order_by('-created_at')
            return qs.filter(doctor=self.request.user).order_by('-created_at')
        return qs.order_by('-created_at')

    def perform_create(self, serializer): serializer.save(doctor=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Mantenemos que todos vean todo, pero solo lo activo
        return Project.objects.filter(is_active=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer

# --- FUNCIONES DE SINCRONIZACIÓN (Tus funciones mejoradas) ---

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def force_scholar_sync(request):
    target_sid = get_clean_scholar_id(request)
    if not target_sid:
        return Response({"error": "No scholar_id provided"}, status=400)
    
    profile = Profile.objects.filter(scholar_id__icontains=target_sid).first()
    if not profile:
        return Response({"error": "Doctor profile not found"}, status=404)

    user = profile.user
    try:
        # 1. Buscamos al autor de forma rápida
        search_query = scholarly.search_author_id(target_sid)
        # IMPORTANTE: No llenamos todas las publicaciones de golpe aquí
        author_data = scholarly.fill(search_query, sections=['publications'])
        
        with transaction.atomic():
            # Filtramos solo las primeras 5 (las más recientes)
            # Esto reduce drásticamente el uso de RAM
            publications_to_process = author_data.get('publications', [])[:5] 
            
            # Opcional: Si quieres conservar las manuales, no borres todo.
            # Aquí borramos las que ya existían del autor para no duplicar
            Publication.objects.filter(author=user).delete()
            
            count = 0
            for pub in publications_to_process:
                # 2. Llenamos los detalles de cada una de las 5
                pub_details = scholarly.fill(pub)
                bib = pub_details.get('bib', {})
                
                title = bib.get('title', 'Untitled')
                authors = bib.get('author') or "Investigadores del CENIDET"
                num_citations = pub_details.get('num_citations', 0)
                # Resumen corto para ahorrar espacio en DB y RAM
                abstract = bib.get('abstract') or pub_details.get('abstract') or f"Investigación por el Dr. {user.last_name}."

                direct_url = pub_details.get('pub_url') or pub_details.get('eprint_url')
                if not direct_url:
                    direct_url = f"https://scholar.google.com/scholar?q={urllib.parse.quote(title)}"
                
                journal = bib.get('journal') or bib.get('publisher') or "Publicación Científica"

                try:
                    year_val = bib.get('pub_year')
                    year = int(year_val) if year_val else date.today().year
                except:
                    year = date.today().year
                
                Publication.objects.create(
                    title=title, 
                    author=user, 
                    authors_list=authors,
                    citations=num_citations,
                    external_url=direct_url, 
                    abstract=abstract,
                    journal_name=journal,
                    date_published=date(year, 1, 1), 
                    status='published',
                    is_active=True
                )
                count += 1
                
        return Response({"status": "success", "count": count, "message": "Sincronización ligera completada (Top 5)"})
    except Exception as e:
        print(f"Error en sincronización: {e}")
        return Response({"error": "El servidor de Google Scholar tardó demasiado o la memoria se agotó. Intenta de nuevo con menos publicaciones."}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_scholar_publications(request, scholar_id):
    clean_id = scholar_id.split('&')[0].strip()
    profile = Profile.objects.filter(scholar_id__icontains=clean_id).first()
    if not profile:
        return Response({"error": "Profile not found"}, status=404)

    # Solo enviamos las publicaciones activas al frontend público
    pubs = Publication.objects.filter(author=profile.user, is_active=True).order_by('-date_published')
    
    return Response({
        'name': f"{profile.user.first_name} {profile.user.last_name}",
        'bio': profile.bio,
        'image_url': profile.image.url if profile.image else None,
        'github_url': profile.github_url,
        'linkedin_url': profile.linkedin_url,
        'publications': [
            {
                'id': p.id, 
                'title': p.title, 
                'authors_list': p.authors_list,
                'citations': p.citations,
                'year': p.date_published.year, 
                'external_url': p.external_url, 
                'abstract': p.abstract,
                'journal_name': p.journal_name,
                'image': p.image.url if p.image else None
            } for p in pubs
        ]
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_from_scholar(request):
    """
    Ahora este botón sí funciona. Llama a la sincronización
    usando el ID del doctor que está logueado.
    """
    try:
        profile = request.user.profile
        if not profile.scholar_id:
            return Response({"error": "No tienes un Scholar ID configurado."}, status=400)
        
        # Reutilizamos la lógica de force_scholar_sync creando un request falso
        from django.test import RequestFactory
        factory = RequestFactory()
        clean_id = profile.scholar_id.split('&')[0].strip()
        mock_request = factory.get(f'/?scholar_id={clean_id}')
        
        return force_scholar_sync(mock_request)
    except Exception as e:
        return Response({"error": str(e)}, status=500)