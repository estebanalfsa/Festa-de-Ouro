from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author_nome = serializers.CharField(source='author.first_name', read_only=True)
    author_sobrenome = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_id', 'author_nome', 'author_sobrenome', 'content', 'created_at']
        read_only_fields = ['author', 'created_at', 'post']

    def get_author_sobrenome(self, obj):
        if hasattr(obj.author, 'perfil'):
            return obj.author.perfil.sobrenome or ''
        return ''
