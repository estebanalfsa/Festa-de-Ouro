from rest_framework import serializers
from .models import Post


class PostAuthorSerializer(serializers.Serializer):
    nome = serializers.CharField(source='first_name')
    sobrenome = serializers.SerializerMethodField()

    def get_sobrenome(self, obj):
        if hasattr(obj, 'perfil'):
            return obj.perfil.sobrenome
        return ''


# Serializer principal para los posts (eventos)
# Incluye información del autor (nombre, apellido, foto) calculada desde las relaciones
class PostSerializer(serializers.ModelSerializer):
    author_nome = serializers.SerializerMethodField()
    author_sobrenome = serializers.SerializerMethodField()
    # Foto de perfil del autor — usada en PostCard para mostrar la imagen en vez de iniciales
    author_foto = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)
    likes_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'description', 'date', 'location',
            'image', 'category', 'category_name',
            'author', 'author_nome', 'author_sobrenome', 'author_foto',
            'likes_count', 'is_liked', 'comments_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']

    def get_author_nome(self, obj):
        return obj.author.first_name or ''

    def get_author_sobrenome(self, obj):
        if hasattr(obj.author, 'perfil'):
            return obj.author.perfil.sobrenome or ''
        return ''

    # Retorna la URL de la foto de perfil del autor (o null si no tiene)
    # Esta URL se usa en el frontend para mostrar la foto en la tarjeta del post
    def get_author_foto(self, obj):
        if hasattr(obj.author, 'perfil') and obj.author.perfil.foto:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.perfil.foto.url)
            return obj.author.perfil.foto.url
        return None
