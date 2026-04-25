import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

# Directorio base del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent

# Seguridad
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-9^ed7dcv-v_nc8$6!x827l-q5yio7l*39gls(k8(=1n04^eaf^')

# DEBUG
DEBUG = os.environ.get('RENDER_DEBUG', 'False').lower() == 'true' or 'RENDER' not in os.environ
AUTHENTICATION_BACKENDS = [
    'accounts.backends.EmailOrUsernameBackend', # Tu nueva lógica
    'django.contrib.auth.backends.ModelBackend', # La de siempre (respaldo)
]
# Permitir todos los hosts
ALLOWED_HOSTS = ['*']
if not DEBUG:
    RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
    if RENDER_EXTERNAL_HOSTNAME:
        ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# --- APLICACIONES ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',    # Debe ir antes de staticfiles
    'django.contrib.staticfiles',
    'cloudinary',            
    'rest_framework',
    'corsheaders',
    'accounts',
    'publications',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Siempre al principio
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# --- BASE DE DATOS ---
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'postgresql://postgres:Postgres123@localhost:5432/cenidet_db'),
        conn_max_age=600,
        ssl_require=not DEBUG
    )
}

# Validadores
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internacionalización
LANGUAGE_CODE = 'es-mx'
TIME_ZONE = 'America/Mexico_City'
USE_I18N = True
USE_TZ = True

# --- ARCHIVOS ESTÁTICOS ---
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# --- CONFIGURACIÓN DE CLOUDINARY ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME', 'dkhhttmhk'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY', '299713792442895'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET', '5Ye1sXbXVkxTHOxb6oS7tpqpT24')
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# --- CONFIGURACIÓN DE SEGURIDAD Y CORS ---
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True

# Configuración estricta para evitar el error de "Cargando"
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
APPEND_SLASH = False  # Evita problemas de redirección 404 en el Login

# --- DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id', # Asegura que use el ID numérico y no el nombre
    'UPDATE_LAST_LOGIN': True,
}