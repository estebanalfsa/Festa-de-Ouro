from rest_framework import viewsets, permissions
from rest_framework.filters import OrderingFilter
from .models import Post
from .serializers import PostSerializer


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at', 'date']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Post.objects.select_related('author', 'author__perfil', 'category').all()
        author = self.request.query_params.get('author')
        if author:
            qs = qs.filter(author_id=author)
        return qs
