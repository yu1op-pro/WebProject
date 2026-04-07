from django.db import models

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