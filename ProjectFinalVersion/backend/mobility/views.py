from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import University, Application
from .serializers import (
    UniversitySerializer,
    ApplicationSerializer,
    StatSerializer,
    ContactFormSerializer,
)


class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer


@api_view(['GET'])
def api_root(request):
    return Response({"message": "Welcome to Mobility API"})


@api_view(['GET'])
def university_stats(request):
    data = {
        'total_universities': University.objects.count(),
        'total_countries': University.objects.values('country').distinct().count(),
    }
    serializer = StatSerializer(data)
    return Response(serializer.data)


class ApplicationList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(user=request.user).order_by('-id')
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)

    def post(self, request):
        university_id = request.data.get('university')

        if not university_id:
            return Response(
                {'detail': 'University is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        already_exists = Application.objects.filter(
            user=request.user,
            university_id=university_id
        ).exists()

        if already_exists:
            return Response(
                {'detail': 'You already applied to this university.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UniversityDetail(APIView):
    def get(self, request, pk):
        try:
            uni = University.objects.get(pk=pk)
            serializer = UniversitySerializer(uni)
            return Response(serializer.data)
        except University.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class EmailLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email') or request.data.get('username')
        password = request.data.get('password')

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user_obj = User.objects.filter(email__iexact=email).first()
        username = user_obj.username if user_obj else email

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'email': user.email, 'username': user.username})
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            pass

        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
    
class ApplicationDetail(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            application = Application.objects.get(pk=pk, user=request.user)
        except Application.DoesNotExist:
            return Response(
                {'detail': 'Application not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        application.delete()
        return Response({'detail': 'Application cancelled successfully.'}, status=status.HTTP_204_NO_CONTENT)
