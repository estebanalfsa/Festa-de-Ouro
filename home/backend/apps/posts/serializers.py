from rest_framework import serializers
from .models import Post
from apps.users.serializers import UserWithInfoSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserWithInfoSerializer(source='user', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'