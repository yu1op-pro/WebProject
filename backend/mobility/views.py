from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import University, Application
from .serializers import (
    UniversitySerializer, 
    ApplicationSerializer, 
    StatSerializer, 
    ContactFormSerializer
)

# 1. ViewSet для автоматического CRUD университетов
class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

# 2. FBV (Function-Based Views)
@api_view(['GET'])
def api_root(request):
    return Response({"message": "Welcome to Mobility API"})

@api_view(['GET'])
def university_stats(request):
    data = {
        'total_universities': University.objects.count(),
        'total_countries': University.objects.values('country').distinct().count()
    }
    serializer = StatSerializer(data)
    return Response(serializer.data)

# 3. CBV (Class-Based Views)
class ApplicationList(APIView):
    # GET доступен всем, POST только авторизованным
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        apps = Application.objects.all()
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            # Привязываем заявку к юзеру, который прислал токен
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