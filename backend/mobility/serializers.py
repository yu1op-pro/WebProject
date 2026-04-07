from rest_framework import serializers
from .models import University, Faculty, Application, Review

# --- 1. ModelSerializers (Минимум 2 по заданию) ---

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name']

class UniversitySerializer(serializers.ModelSerializer):
    faculties = FacultySerializer(many=True, read_only=True)
    class Meta:
        model = University
        fields = ['id', 'name', 'country', 'description', 'min_gpa', 'min_ielts', 'faculties']

class ApplicationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    university_name = serializers.ReadOnlyField(source='university.name')
    
    class Meta:
        model = Application
        fields = ['id', 'user', 'university', 'university_name', 'status', 'created_at']

# --- 2. Regular Serializers (Минимум 2 по заданию) ---

class StatSerializer(serializers.Serializer):
    total_universities = serializers.IntegerField()
    total_countries = serializers.IntegerField()

class ContactFormSerializer(serializers.Serializer):
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=100)
    message = serializers.CharField()