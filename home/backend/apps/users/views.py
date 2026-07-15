from rest_framework import generics, permissions, serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q, Count, Exists, OuterRef, Value, BooleanField
from django.core.mail import send_mail
from django.conf import settings
from .models import Perfil, Follow, PasswordResetCode

# Lista de repúblicas válidas para la validación en el registro
REPUBLICAS = [
    'NosTravamus', 'Dominakana', 'Badalacao', 'Complexo',
    'Mata Virgem', 'Taberna', 'SoFadinhas', '171', 'Tonteria',
    'Agua Na Boca', 'Moda Antiga', 'BatCaverna', 'Mistura Perfeita',
    'Eclipse', 'Forasteiras', 'Nadave', 'Indiscreta', 'Mexicanas',
    'Exilio', 'Alambique', 'Provincia', 'Flor de Liz', 'Tabu',
    'Maternidade',
]


# Serializer para el registro de nuevos usuarios
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirmarSenha = serializers.CharField(write_only=True)
    sobrenome = serializers.CharField(write_only=True, required=False, allow_blank=True)
    telefone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    republica = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'sobrenome', 'email', 'telefone', 'republica', 'password', 'confirmarSenha']

    def validate_republica(self, value):
        if value and value not in REPUBLICAS:
            raise serializers.ValidationError(f'República inválida. Escolha entre: {", ".join(REPUBLICAS)}')
        return value

    def validate(self, data):
        if data['password'] != data.pop('confirmarSenha'):
            raise serializers.ValidationError({'confirmarSenha': 'As senhas não coincidem'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Este email já está cadastrado'})
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return data

    @transaction.atomic
    def create(self, validated_data):
        # Extrae datos adicionales del perfil
        sobrenome = validated_data.pop('sobrenome', '')
        telefone = validated_data.pop('telefone', '')
        republica = validated_data.pop('republica', '')

        # Crea el usuario de Django con el email como username
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            password=validated_data['password'],
        )
        # Crea el perfil asociado al usuario
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


# Serializer para ver/editar el perfil propio
class PerfilSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='user.first_name')
    email = serializers.EmailField(source='user.email')
    username = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    dataJuncao = serializers.DateTimeField(source='user.date_joined', read_only=True)
    seguidores_count = serializers.IntegerField(read_only=True)
    seguindo_count = serializers.IntegerField(read_only=True)
    is_following = serializers.BooleanField(read_only=True)

    class Meta:
        model = Perfil
        fields = ['userId', 'nome', 'sobrenome', 'email', 'telefone', 'republica', 'username', 'dataJuncao', 'foto', 'banner', 'seguidores_count', 'seguindo_count', 'is_following']
        extra_kwargs = {'foto': {'required': False}, 'banner': {'required': False}}


class MeuPerfilView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Perfil.objects.annotate(
            seguidores_count=Count('user__seguidores', distinct=True),
            seguindo_count=Count('user__seguindo', distinct=True),
            is_following=Value(False, output_field=BooleanField()),
        )

    def get_object(self):
        return self.get_queryset().get(user=self.request.user)


# --- FLUJO DE RECUPERACIÓN DE CONTRASEÑA ---

# Endpoint: POST /api/senha/
# 1. Recibe un email
# 2. Busca al usuario por email
# 3. Elimina códigos anteriores del mismo usuario
# 4. Genera un nuevo código de recuperación
# 5. Envía un email con un link que contiene el código
# Nota: por seguridad, siempre devuelve el mismo mensaje de éxito,
#       incluso si el email no existe (evita enumeración de usuarios)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def solicitar_reset_senha(request):
    email = request.data.get('email', '').strip()
    if not email:
        return Response({'error': 'Email é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Mensaje genérico por seguridad
        return Response({'message': 'Se o email estiver cadastrado, você receberá um link de recuperação.'})

    # Elimina códigos anteriores para que solo el último sea válido
    PasswordResetCode.objects.filter(user=user).delete()
    reset = PasswordResetCode.objects.create(user=user)

    # Construye el link de recuperación con el token
    # Ej: http://localhost:3000/resetar-senha/<código>
    link = f"{settings.FRONTEND_URL}/resetar-senha/{reset.code}"

    try:
        # Envía el email usando la configuración SMTP del servidor
        send_mail(
            subject='Recuperación de senha - Festa de Ouro',
            message=f'Olá {user.first_name or "usuário"},\n\n'
                    f'Recebemos uma solicitação de recuperação de senha.\n\n'
                    f'Clique no link abaixo para redefinir sua senha:\n{link}\n\n'
                    f'Se você não solicitou esta recuperação, ignore este email.\n\n'
                    f'Atenciosamente,\nEquipe Festa de Ouro',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception:
        return Response({'error': 'Erro ao enviar email. Verifique as configurações de email do servidor.'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'Se o email estiver cadastrado, você receberá um link de recuperação.'})


# Endpoint: POST /api/senha/confirmar/
# 1. Recibe código, nueva contraseña y confirmación
# 2. Valida que el código exista en la base de datos
# 3. Cambia la contraseña del usuario asociado al código
# 4. Elimina el código (uso único)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def confirmar_reset_senha(request):
    code = request.data.get('code', '').strip()
    password = request.data.get('password', '')
    confirmar = request.data.get('confirmarSenha', '')

    if not code or not password or not confirmar:
        return Response({'error': 'Código, senha e confirmação são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)
    if password != confirmar:
        return Response({'error': 'As senhas não coincidem'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

    try:
        reset = PasswordResetCode.objects.get(code=code)
    except PasswordResetCode.DoesNotExist:
        return Response({'error': 'Código inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST)

    # Cambia la contraseña del usuario (Django la hashea automáticamente)
    user = reset.user
    user.set_password(password)
    user.save()
    # Elimina el código para que no pueda reutilizarse
    reset.delete()

    return Response({'message': 'Senha redefinida com sucesso!'})


# Serializer para la búsqueda de usuarios (público)
class UserSearchSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='first_name')
    sobrenome = serializers.SerializerMethodField()
    userId = serializers.IntegerField(source='id')
    foto = serializers.SerializerMethodField()
    republica = serializers.SerializerMethodField()
    seguidores_count = serializers.IntegerField(read_only=True)
    is_following = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ['userId', 'nome', 'sobrenome', 'foto', 'republica', 'seguidores_count', 'is_following']

    def get_sobrenome(self, obj):
        return getattr(obj.perfil, 'sobrenome', '')

    def get_foto(self, obj):
        foto = getattr(obj.perfil, 'foto', None)
        if foto:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(foto.url)
            return foto.url
        return None

    def get_republica(self, obj):
        return getattr(obj.perfil, 'republica', '')


# --- MODO INVITADO: BÚSQUEDA DE USUARIOS ---
# Endpoint: GET /api/buscar/?q=<texto>
# Accesible sin autenticación (AllowAny) para que los invitados puedan buscar perfiles
# Si el usuario está autenticado, se le excluye de los resultados y se marca is_following
# Si es invitado, is_following se establece como false
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def buscar_usuarios(request):
    q = request.query_params.get('q', '').strip()
    if len(q) < 2:
        return Response([])

    user = request.user
    qs = User.objects.filter(
        Q(first_name__icontains=q) |
        Q(email__icontains=q) |
        Q(perfil__sobrenome__icontains=q)
    )
    if user.is_authenticated:
        # Usuario logueado: se excluye a sí mismo y se calcula si sigue a cada resultado
        qs = qs.exclude(id=user.id).annotate(
            seguidores_count=Count('seguidores', distinct=True),
            is_following=Exists(
                Follow.objects.filter(follower=user, following=OuterRef('id'))
            ),
        )
    else:
        # Invitado: no se excluye a nadie, is_following siempre false
        qs = qs.annotate(
            seguidores_count=Count('seguidores', distinct=True),
            is_following=Value(False, output_field=BooleanField()),
        )
    qs = qs.select_related('perfil')[:10]

    serializer = UserSearchSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


# Endpoint: POST /api/seguir/<user_id>/
# Requiere autenticación (el invitado no puede seguir, se le redirige a register desde el frontend)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def follow_toggle(request, user_id):
    if request.user.id == user_id:
        return Response({'error': 'Você não pode seguir a si mesmo'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        target = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Si ya sigue, lo deja de seguir; si no, lo sigue
    follow, created = Follow.objects.get_or_create(follower=request.user, following=target)
    if not created:
        follow.delete()
        following = False
    else:
        following = True

    return Response({
        'following': following,
        'seguidores_count': target.seguidores.count(),
    })


# Serializer para perfil público visible por cualquiera (invitados incluidos)
class PerfilPublicoSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='user.first_name')
    sobrenome = serializers.CharField(source='user.perfil.sobrenome', allow_blank=True)
    username = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    dataJuncao = serializers.DateTimeField(source='user.date_joined', read_only=True)
    republica = serializers.CharField(source='user.perfil.republica', allow_blank=True)
    foto = serializers.SerializerMethodField()
    banner = serializers.SerializerMethodField()
    seguidores_count = serializers.IntegerField(read_only=True)
    seguindo_count = serializers.IntegerField(read_only=True)
    is_following = serializers.BooleanField(read_only=True)

    class Meta:
        model = Perfil
        fields = ['userId', 'nome', 'sobrenome', 'username', 'dataJuncao', 'republica', 'foto', 'banner', 'seguidores_count', 'seguindo_count', 'is_following']

    def get_foto(self, obj):
        if obj.foto:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.foto.url)
            return obj.foto.url
        return None

    def get_banner(self, obj):
        if obj.banner:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.banner.url)
            return obj.banner.url
        return None


# Vista de perfil público (accesible sin autenticación)
class PerfilPublicoView(generics.RetrieveAPIView):
    queryset = Perfil.objects.none()
    serializer_class = PerfilPublicoSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        qs = Perfil.objects.filter(user_id=user_id).select_related('user').annotate(
            seguidores_count=Count('user__seguidores', distinct=True),
            seguindo_count=Count('user__seguindo', distinct=True),
        )
        user = self.request.user
        if user.is_authenticated:
            qs = qs.annotate(
                is_following=Exists(
                    Follow.objects.filter(follower=user, following=OuterRef('user_id'))
                )
            )
        else:
            qs = qs.annotate(is_following=Value(False, output_field=BooleanField()))

        obj = qs.first()
        if not obj:
            from rest_framework.exceptions import NotFound
            raise NotFound('Usuário não encontrado')
        return obj
