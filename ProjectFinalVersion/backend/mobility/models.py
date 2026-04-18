from django.db import models
from django.contrib.auth.models import User

class University(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    description = models.TextField()
    min_gpa = models.FloatField()
    min_ielts = models.FloatField()

    def __str__(self):
        return self.name

class Faculty(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='faculties')
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.university.name})"
    

class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    university = models.ForeignKey('University', on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.university.name}'

class Review(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.IntegerField(default=5)

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"