from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import toggle_group_permission # ... y tus otras vistas
from .views import (
    MyTokenObtainPairView,
    UserCreateView,
    UserViewSet,
    PublicProfileViewSet,
    manage_profile,
    update_profile_photo # <--- AQUÍ ESTÁ LA IMPORTACIÓN QUE FALTABA

)

router = DefaultRouter()
router.register(r'users-list', UserViewSet, basename='users')
router.register(r'public-doctors', PublicProfileViewSet, basename='public-doctors')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', UserCreateView.as_view(), name='register_user'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('manage-profile/', manage_profile, name='manage_profile'),
    path('update-photo/', update_profile_photo, name='update_photo'),
    path('toggle-group-permission/<int:user_id>/', toggle_group_permission, name='toggle-permission'),
]