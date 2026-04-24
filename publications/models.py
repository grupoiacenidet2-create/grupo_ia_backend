from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from cloudinary_storage.storage import MediaCloudinaryStorage # <--- IMPORTANTE

# Modelo para las Publicaciones (Artículos Científicos)
class Publication(models.Model):
    title = models.CharField(max_length=255, verbose_name="Título")
    abstract = models.TextField(verbose_name="Resumen")
    
    # El usuario que gestiona la publicación (el Doctor logueado)
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Doctor/Autor")
    
    # Los autores reales del paper
    authors_list = models.TextField(blank=True, null=True, verbose_name="Autores del artículo")
    
    date_published = models.DateField(verbose_name="Fecha de Publicación")
    
    # --- Forzamos Cloudinary en PDF e Imagen ---
    pdf_file = models.FileField(
        upload_to='publications/pdfs/', 
        storage=MediaCloudinaryStorage(), 
        verbose_name="Archivo PDF", 
        null=True, blank=True
    )
    image = models.ImageField(
        upload_to='publications/', 
        storage=MediaCloudinaryStorage(), 
        null=True, blank=True
    )
    
    external_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Enlace Externo (Directo o Scholar)")
    journal_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nombre de la Revista/Editorial")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    citations = models.IntegerField(default=0, verbose_name="Citas")
    
    ai_image_url = models.URLField(max_length=500, blank=True, null=True)
    scholar_id_ref = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    def __str__(self):
        return self.title

# Modelo para Proyectos (Versión corregida y única)
class Project(models.Model):
    title = models.CharField(max_length=255, verbose_name="Título del Proyecto")
    description = models.TextField(verbose_name="Descripción")
    
    # --- Forzamos Cloudinary ---
    image = models.ImageField(
        upload_to='projects/', 
        storage=MediaCloudinaryStorage(), 
        null=True, blank=True
    )
    
    participants = models.TextField(help_text="Nombres de los participantes separados por comas")
    last_updated = models.DateField(null=True, blank=True, verbose_name="Última actualización")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects_created')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Proyecto"
        verbose_name_plural = "Proyectos"

# Modelo para Eventos
class Event(models.Model):
    title = models.CharField(max_length=255, verbose_name="Título del Evento")
    description = models.TextField()
    date = models.DateTimeField(verbose_name="Fecha y Hora")
    location = models.CharField(max_length=255, verbose_name="Lugar")

    def __str__(self):
        return self.title

# Modelo para Estudiantes
class Student(models.Model):
    CATEGORY_CHOICES = [
        ('phd', 'Estudiante de Doctorado'),
        ('undergrad', 'Estudiante de Pregrado'),
        ('alumni', 'Antiguos Alumnos'),
    ]
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='students')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=500, help_text="Ej: desde primavera de 2025")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    link = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

# Modelo para Cursos/Materias
class Course(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=255, verbose_name="Nombre de la materia")
    code = models.CharField(max_length=50, blank=True, null=True, verbose_name="Código (ej: IS407)")
    semester = models.CharField(max_length=100, verbose_name="Semestre (ej: Primavera 2025)")
    link = models.URLField(blank=True, null=True, verbose_name="Enlace al curso")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    def __str__(self):
        return f"{self.name} - {self.semester}"

# Modelo para Noticias
class News(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news')
    
    # --- NUEVO CAMPO: TÍTULO ---
    title = models.CharField(
        max_length=200, 
        verbose_name="Título de la Noticia", 
        default="Comunicado Académico"
    )
    
    date_text = models.CharField(max_length=50)
    content = models.TextField()
    link = models.URLField(blank=True, null=True)
    is_important = models.BooleanField(default=False)
    
    # --- Forzamos Cloudinary ---
    image = models.ImageField(
        upload_to='news_pics/', 
        storage=MediaCloudinaryStorage(), 
        blank=True, null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_group_announcement = models.BooleanField(default=False, verbose_name="¿Es comunicado del grupo?")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    
    def __str__(self):
        # Ahora el admin mostrará el título para que sepas cuál es cuál
        return f"{self.title} ({self.date_text})"

    class Meta:
        verbose_name = "Noticia"
        verbose_name_plural = "Noticias"
        ordering = ['-created_at'] # Las más recientes aparecerán primero