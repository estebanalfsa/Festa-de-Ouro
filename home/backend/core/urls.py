from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import CustomTokenObtainPairView, CustomTokenRefreshView, UserViewSet, UserInfoViewSet
from apps.posts.views import PostViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'users-info', UserInfoViewSet)
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]