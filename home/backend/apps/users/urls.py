from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (RegisterView, MeuPerfilView, buscar_usuarios, follow_toggle,
                    PerfilPublicoView, solicitar_reset_senha, confirmar_reset_senha)

# Definición de rutas de la API para el módulo de usuarios
urlpatterns = [
    # Registro de nuevo usuario (público)
    path('register/', RegisterView.as_view(), name='register'),
    # Inicio de sesión (devuelve tokens JWT)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refrescar token JWT
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Ver/editar perfil propio (requiere autenticación)
    path('perfil/', MeuPerfilView.as_view(), name='meu_perfil'),
    # Ver perfil público de otro usuario por ID
    path('perfil/<int:user_id>/', PerfilPublicoView.as_view(), name='perfil_publico'),
    # Buscar usuarios por nombre/email (público - accesible para invitados)
    path('buscar/', buscar_usuarios, name='buscar_usuarios'),
    # Seguir/dejar de seguir a un usuario (requiere autenticación)
    path('seguir/<int:user_id>/', follow_toggle, name='follow_toggle'),
    # Solicitar recuperación de contraseña (envía email con link)
    path('senha/', solicitar_reset_senha, name='solicitar_reset'),
    # Confirmar recuperación de contraseña (recibe código + nueva contraseña)
    path('senha/confirmar/', confirmar_reset_senha, name='confirmar_reset'),
]
