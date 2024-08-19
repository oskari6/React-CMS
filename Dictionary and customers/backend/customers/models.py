from django.db import models
from django.contrib.auth.models import User

#from django.contrib.auth.models import AbstractUser   
        
class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Order(models.Model):
    customer = models.ForeignKey(Customer, related_name="orders", on_delete=models.CASCADE)#related name for query name
    description = models.CharField(max_length=500)
    total_in_cents = models.IntegerField()

    def __str__(self):
        return self.description
   
class Employee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20)
    
    def __str__(self):
        return self.full_name
    
# making custom User adds more complexity not needed right now
# class User(AbstractUser):
#     email = models.EmailField(max_length=255, unique=True)
#     name = models.CharField(max_length=255, blank=True, null=True)
    
#     REQUIRED_FIELDS = ['name']
    
#     def __str__(self):
#         return self.email