from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.validators import UnicodeUsernameValidator

# 1. DEFINIMOS UN VALIDADOR QUE SÍ PERMITE ESPACIOS
class UnicodeSpaceUsernameValidator(UnicodeUsernameValidator):
    # Agregamos un espacio al final de la expresión regular [\w.@+- ]
   regex = r'^[\w.@+ -]+$' 
   message = "Ingrese un nombre de usuario válido."

# 2. APLICAMOS EL VALIDADOR AL MODELO USER POR DEFECTO
# Esto "parcha" el modelo de Django para que acepte nombres completos
User._meta.get_field('username').validators = [UnicodeSpaceUsernameValidator()]

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    scholar_id = models.CharField(max_length=50, blank=True, null=True)
    
    # INFORMACIÓN PERSONAL Y CONTACTO
    bio = models.TextField(blank=True, null=True)
    office_location = models.CharField(max_length=255, blank=True, null=True)
    mailing_address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    can_post_as_group = models.BooleanField(default=False, verbose_name="¿Puede publicar como grupo?")
    
    # FOTO DE PERFIL
    image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # REDES SOCIALES / ENLACES ACADÉMICOS
    github_url = models.URLField(max_length=255, blank=True, null=True)
    linkedin_url = models.URLField(max_length=255, blank=True, null=True)
    twitter_url = models.URLField(max_length=255, blank=True, null=True)
    personal_website = models.URLField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

# --- SIGNALS (Creación automática del perfil) ---
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()