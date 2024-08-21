from django.db import models
from django.contrib.auth.models import User
import uuid

class Employee(models.Model):
    id = models.BigAutoField(primary_key=True)  # Ensure this remains the primary key
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20)
    picture = models.ImageField(upload_to='employee_pictures/', null=True, blank=True)
    
    def __str__(self):
        return self.full_name