from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UniversityViewSet, ApplicationList, UniversityDetail, api_root, university_stats
from rest_framework.authtoken import views as auth_views

# Роутер для ViewSet (автоматические CRUD)
router = DefaultRouter()
router.register(r'universities', UniversityViewSet)

urlpatterns = [
    # 1. Ссылка на все маршруты через роутер
    path('', include(router.urls)),

    # 2. Эндпоинты для FBV (Function-Based Views)
    path('root/', api_root, name='api-root'),
    path('stats/', university_stats, name='university-stats'),

    # 3. Эндпоинты для CBV (Class-Based Views)
    path('applications/', ApplicationList.as_view(), name='application-list'),
    path('university-detail/<int:pk>/', UniversityDetail.as_view(), name='uni-detail'),

    # 4. Аутентификация (Login/Logout)
    path('login/', auth_views.obtain_auth_token, name='api-token-auth'),
]