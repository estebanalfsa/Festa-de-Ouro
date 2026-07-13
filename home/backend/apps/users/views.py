from rest_framework import generics, permissions, serializers
from django.contrib.auth.models import User
from django.db import transaction
from .models import Perfil


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirmarSenha = serializers.CharField(write_only=True)
    sobrenome = serializers.CharField(write_only=True, required=False, allow_blank=True)
    telefone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    republica = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'sobrenome', 'email', 'telefone', 'republica', 'password', 'confirmarSenha']

    def validate(self, data):
        if data['password'] != data.pop('confirmarSenha'):
            raise serializers.ValidationError({'confirmarSenha': 'As senhas não coincidem'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Este email já está cadastrado'})
        return data

    @transaction.atomic
    def create(self, validated_data):
        sobrenome = validated_data.pop('sobrenome', '')
        telefone = validated_data.pop('telefone', '')
        republica = validated_data.pop('republica', '')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            password=validated_data['password'],
        )
        Perfil.objects.create(
            user=user,
            sobrenome=sobrenome,
            telefone=telefone,
            republica=republica,
        )
        return user


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class PerfilSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='user.first_name')
    email = serializers.EmailField(source='user.email')
    username = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    dataJuncao = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = Perfil
        fields = ['userId', 'nome', 'sobrenome', 'email', 'telefone', 'republica', 'username', 'dataJuncao']


class MeuPerfilView(generics.RetrieveAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil