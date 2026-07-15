from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer


class IsCommentAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk']).select_related('author', 'author__perfil')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, post_id=self.kwargs['post_pk'])


class CommentDestroyView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsCommentAuthorOrReadOnly]
