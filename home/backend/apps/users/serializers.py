from rest_framework import serializers
from .models import User, UserInfo


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserWithInfoSerializer(serializers.ModelSerializer):
    info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'info']

    def get_info(self, obj):
        try:
            return UserInfoSerializer(obj.userinfo).data
        except UserInfo.DoesNotExist:
            return None
