from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        # 1. Intentamos buscar por correo
        try:
            # Usamos iexact para ignorar Mayúsculas/Minúsculas
            user = UserModel.objects.get(email__iexact=username.strip())
        except (UserModel.DoesNotExist, AttributeError):
            # 2. Si no es correo, intentamos por nombre de usuario (username)
            try:
                user = UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                print(f"DEBUG: No se encontró usuario con el identificador: {username}")
                return None

        # 3. Verificamos la contraseña
        if user.check_password(password) and self.user_can_authenticate(user):
            print(f"DEBUG: Login exitoso para: {user.email}")
            return user
        else:
            print(f"DEBUG: Contraseña incorrecta para: {user.username}")
            return None