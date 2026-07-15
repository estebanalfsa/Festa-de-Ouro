from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django.db.models import Count, Exists, OuterRef, Value, BooleanField
from .models import Post, Like
from .serializers import PostSerializer


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at', 'date']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action == 'like':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        qs = Post.objects.select_related('author', 'author__perfil', 'category').all()

        qs = qs.annotate(likes_count=Count('likes', distinct=True))
        qs = qs.annotate(comments_count=Count('comments', distinct=True))

        user = self.request.user
        if user.is_authenticated:
            qs = qs.annotate(
                is_liked=Exists(Like.objects.filter(post=OuterRef('pk'), user=user))
            )
        else:
            qs = qs.annotate(is_liked=Value(False, output_field=BooleanField()))

        author = self.request.query_params.get('author')
        if author:
            qs = qs.filter(author_id=author)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True

        return Response({
            'liked': liked,
            'likes_count': post.likes.count(),
        })
