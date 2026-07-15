from django.urls import path
from .views import CommentListCreateView, CommentDestroyView

urlpatterns = [
    path('posts/<int:post_pk>/comments/', CommentListCreateView.as_view(), name='post-comments'),
    path('comments/<int:pk>/', CommentDestroyView.as_view(), name='comment-detail'),
]
