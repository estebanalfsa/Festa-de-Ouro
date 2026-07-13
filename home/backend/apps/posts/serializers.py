from rest_framework import serializers
from .models import Post


class PostAuthorSerializer(serializers.Serializer):
    nome = serializers.CharField(source='first_name')
    sobrenome = serializers.SerializerMethodField()

    def get_sobrenome(self, obj):
        if hasattr(obj, 'perfil'):
            return obj.perfil.sobrenome
        return ''


class PostSerializer(serializers.ModelSerializer):
    author_nome = serializers.SerializerMethodField()
    author_sobrenome = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'description', 'date', 'location',
            'image', 'category', 'category_name',
            'author', 'author_nome', 'author_sobrenome',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def get_author_nome(self, obj):
        return obj.author.first_name or ''

    def get_author_sobrenome(self, obj):
        if hasattr(obj.author, 'perfil'):
            return obj.author.perfil.sobrenome or ''
        return ''
