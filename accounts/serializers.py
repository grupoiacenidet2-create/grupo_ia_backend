from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.validators import UnicodeUsernameValidator
from .models import Profile

class UnicodeSpaceUsernameValidator(UnicodeUsernameValidator):
    regex = r'^[\w.@+ -]+$' 
    message = "Ingrese un nombre de usuario válido."

# 1. SERIALIZER PARA LISTADO Y REGISTRO (DASHBOARD)
class UserCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[UnicodeSpaceUsernameValidator()])
    
    # Para escribir al crear
    can_post_as_group = serializers.BooleanField(write_only=True, required=False, default=False)
    
    # Para leer en el Dashboard (Usamos SerializerMethodField para asegurar lectura de DB)
    current_group_permission = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 
            'last_name', 'is_staff', 'can_post_as_group', 'current_group_permission'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_current_group_permission(self, obj):
        # Forzamos la lectura directa desde el perfil relacionado
        try:
            return obj.profile.can_post_as_group
        except:
            return False

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return email

    def create(self, validated_data):
        can_post_group = validated_data.pop('can_post_as_group', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=validated_data.get('is_staff', False)
        )
        profile = user.profile
        profile.can_post_as_group = can_post_group
        profile.save()
        return user

# 2. SERIALIZER PARA LOGIN (CORREGIDA LA INDENTACIÓN)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        # IMPORTANTE: Ahora 'validate' está DENTRO de la clase (indentado)
        data = super().validate(attrs)
        
        user = self.user
        data['username'] = user.username
        data['email'] = user.email
        data['user_id'] = user.id
        data['is_staff'] = user.is_staff
        
        # Leemos el permiso real de la DB al loguear
        try:
            data['current_group_permission'] = user.profile.can_post_as_group
            data['scholar_id'] = user.profile.scholar_id or ""
        except:
            data['current_group_permission'] = False
            data['scholar_id'] = ""
            
        return data

# 3. SERIALIZER PARA VISTA PÚBLICA
class PublicDoctorSerializer(serializers.ModelSerializer):
    scholar_id = serializers.CharField(source='profile.scholar_id', read_only=True)
    bio = serializers.CharField(source='profile.bio', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'scholar_id', 'image_url', 'bio']

    def get_image_url(self, obj):
        if obj.profile.image:
            return obj.profile.image.url
        return None

# 4. SERIALIZER PARA ACTUALIZAR PERFIL
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image', 'bio', 'github_url', 'linkedin_url']