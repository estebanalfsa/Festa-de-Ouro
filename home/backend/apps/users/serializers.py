from rest_framework import serializers
from .models import User, UserInfo


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'senha']
        extra_kwargs = {
            'senha': {'write_only': True},
        }


class UserWithInfoSerializer(serializers.ModelSerializer):
    info = UserInfoSerializer(source='userinfo', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'info']
