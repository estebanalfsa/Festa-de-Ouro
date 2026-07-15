from django.db import models
from django.contrib.auth.models import User
import secrets


# Modelo que almacena códigos de recuperación de contraseña
# Cada código está asociado a un usuario y tiene una fecha de creación
class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_codes')
    code = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Genera automáticamente un token criptográfico aleatorio de 32 bytes si no se proporciona uno
        if not self.code:
            self.code = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Código de reset para {self.user.email}'


# Modelo que gestiona las relaciones de seguimiento entre usuarios
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seguindo')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seguidores')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['follower', 'following']

    def __str__(self):
        return f'{self.follower.first_name} → {self.following.first_name}'


# Modelo que extiende la información del usuario (perfil)
# Contiene datos adicionales como sobrenombre, teléfono, república, foto y banner
class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    sobrenome = models.CharField(max_length=150, blank=True)
    telefone = models.CharField(max_length=20, blank=True)
    republica = models.CharField(max_length=150, blank=True)
    foto = models.ImageField(upload_to='perfis/fotos/', blank=True, null=True)
    banner = models.ImageField(upload_to='perfis/banners/', blank=True, null=True)

    def __str__(self):
        return f'Perfil de {self.user.username}'
