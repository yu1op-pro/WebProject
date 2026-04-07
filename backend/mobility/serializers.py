from rest_framework import serializers
from .models import University, Faculty, Application, Review

# --- 1. ModelSerializers (Минимум 2 по заданию) ---

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name']

class UniversitySerializer(serializers.ModelSerializer):
    admission_chance = serializers.SerializerMethodField()

    class Meta:
        model = University
        fields = [
            'id', 'name', 'country', 'min_gpa', 'min_ielts', 
            'admission_chance' # Добавляем новое поле в JSON
        ]

    def get_admission_chance(self, obj):
        request = self.context.get('request')
        if not request: return None

        gpa = request.query_params.get('gpa')
        ielts = request.query_params.get('ielts')
        
        # Если данные не введены, ничего не считаем
        if not gpa: return None

        try:
            gpa = float(gpa)
            # Если IELTS не ввели, считаем его как 0.0 для логики
            ielts = float(ielts) if ielts else 0.0
            
            # 1. Проверяем жесткое соответствие минимальным требованиям вуза
            # Если твои баллы выше или равны минимальным — это 100% успех
            if gpa >= obj.min_gpa and ielts >= obj.min_ielts:
                return "100%"

            # 2. Если баллов чуть-чуть не хватает (мягкий расчет)
            # Считаем, насколько процентов ты "дотягиваешь" до идеала
            gpa_ratio = min(gpa / obj.min_gpa, 1.0)
            
            # Для языка: если вуз не требует IELTS (min_ielts=0), то 1.0
            if obj.min_ielts > 0:
                ielts_ratio = min(ielts / obj.min_ielts, 1.0)
            else:
                ielts_ratio = 1.0

            # Итоговый шанс — это среднее между твоим GPA и IELTS относительно требований
            final_chance = ((gpa_ratio + ielts_ratio) / 2) * 100
            
            # Чтобы не было слишком низких цифр для старательных студентов
            if final_chance < 10: final_chance = 10
                
            return f"{round(final_chance, 1)}%"

        except (ValueError, TypeError):
            return "0%"

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