from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UniversityViewSet, ApplicationList, UniversityDetail, api_root, university_stats, EmailLoginView, ApplicationDetail, LogoutView
from rest_framework.authtoken import views as auth_views


router = DefaultRouter()
router.register(r'universities', UniversityViewSet)

urlpatterns = [
    path('', include(router.urls)),

    #FBV
    path('root/', api_root, name='api-root'),
    path('stats/', university_stats, name='university-stats'),

    #CBV
    path('applications/', ApplicationList.as_view(), name='application-list'),
    path('applications/<int:pk>/', ApplicationDetail.as_view()),
    path('university-detail/<int:pk>/', UniversityDetail.as_view(), name='uni-detail'),

    #Login/Logout
    path('login/', EmailLoginView.as_view(), name='api-token-auth'),
    path('logout/', LogoutView.as_view()),
]