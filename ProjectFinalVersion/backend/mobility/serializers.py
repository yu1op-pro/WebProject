from rest_framework import serializers
from .models import University, Faculty, Application, Review

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name']

class UniversitySerializer(serializers.ModelSerializer):
    admission_chance = serializers.SerializerMethodField()
    faculties = FacultySerializer(many=True, read_only=True)

    class Meta:
        model = University
        fields = [
            'id', 'name', 'country', 'min_gpa', 'min_ielts',
            'faculties', 'admission_chance'
        ]

    def get_admission_chance(self, obj):
        request = self.context.get('request')
        if not request:
            return None

        gpa = request.query_params.get('gpa')
        ielts = request.query_params.get('ielts')

        if not gpa or not ielts:
            return None

        try:
            gpa = float(gpa)
            ielts = float(ielts)

            if gpa < obj.min_gpa or ielts < obj.min_ielts:
                gpa_ratio = gpa / obj.min_gpa if obj.min_gpa > 0 else 0
                ielts_ratio = ielts / obj.min_ielts if obj.min_ielts > 0 else 0

                weak_score = (gpa_ratio * 0.65) + (ielts_ratio * 0.35)
                final_chance = weak_score * 9.99
                final_chance = max(min(final_chance, 9.99), 1.00)
                return f"{final_chance:.2f}%"

            gpa_bonus = min((gpa - obj.min_gpa) / obj.min_gpa, 0.20)
            ielts_bonus = min((ielts - obj.min_ielts) / obj.min_ielts, 0.20) if obj.min_ielts > 0 else 0.20

            weighted_bonus = (gpa_bonus * 0.65) + (ielts_bonus * 0.35)

            final_chance = 95.0 + (weighted_bonus / 0.20) * 4.99
            final_chance = min(final_chance, 99.99)

            return f"{final_chance:.2f}%"

        except (ValueError, TypeError):
            return "0.00%"

class ApplicationSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    country = serializers.CharField(source='university.country', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'user', 'university', 'university_name', 'country', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'university_name', 'country', 'status', 'created_at']


class StatSerializer(serializers.Serializer):
    total_universities = serializers.IntegerField()
    total_countries = serializers.IntegerField()

class ContactFormSerializer(serializers.Serializer):
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=100)
    message = serializers.CharField()