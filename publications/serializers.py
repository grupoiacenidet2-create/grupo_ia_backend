from rest_framework import serializers
from .models import Publication, Project, Event, Student, Course, News
from django.contrib.auth.models import User

# Serializer para ver datos básicos del Doctor
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

# Serializer para Publicaciones (ACTUALIZADO con journal_name e image)
# Serializer para Publicaciones (ACTUALIZADO con autores y año calculado)
class PublicationSerializer(serializers.ModelSerializer):
    author_details = UserSerializer(source='author', read_only=True)
    # Creamos un campo para enviar solo el año a React de forma limpia
    year = serializers.SerializerMethodField()
    
    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'abstract', 'authors_list', # <--- NUEVO CAMPO
            'date_published', 'year',                 # <--- AÑO CALCULADO
            'pdf_file', 'external_url', 'journal_name',
            'image', 'author', 'author_details', 
            'status', 'ai_image_url', 'scholar_id_ref'
        ]
        read_only_fields = ['author']

    def get_year(self, obj):
        if obj.date_published:
            return obj.date_published.year
        return None
# --- EL RESTO DE SERIALIZERS SE MANTIENEN IGUAL ---

class ProjectSerializer(serializers.ModelSerializer):
    doctor_details = UserSerializer(source='lead_doctor', read_only=True)
    class Meta:
        model = Project
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'description', 'category', 'link', 'doctor']
        read_only_fields = ['doctor']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['doctor']

class NewsSerializer(serializers.ModelSerializer):
    doctor_username = serializers.ReadOnlyField(source='doctor.username')
    
    class Meta:
        model = News
        # AGREGAMOS 'is_group_announcement' A LA LISTA
        fields = [
            'id',
            'title',
            'date_text', 
            'content', 
            'link', 
            'is_important', 
            'is_group_announcement', # <--- ESTA ES LA CLAVE
            'doctor_username', 
            'doctor', 
            'image'
        ]
        read_only_fields = ['doctor']
        
class PublicDoctorSerializer(serializers.ModelSerializer):
    scholar_id = serializers.CharField(source='profile.scholar_id', read_only=True, default="")
    image_url = serializers.ImageField(source='profile.image', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'scholar_id', 'image_url']
        
class ProjectSerializer(serializers.ModelSerializer):
    # Esto es para que en el dashboard sepamos quién lo creó
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image', 
            'participants', 'last_updated', 'created_by', 
            'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']