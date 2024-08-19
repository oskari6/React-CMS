from django.db import models
from django.contrib.auth.models import User
        

class Employee(models.Model):
    id = models.UUIDField # then what
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20)
    picture = models.ImageField #then what
    
    def __str__(self):
        return self.full_name