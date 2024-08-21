from django.db import models
from .customer import Customer

class Order(models.Model):
    customer = models.ForeignKey(Customer, related_name="orders", on_delete=models.CASCADE)#related name for query name
    description = models.CharField(max_length=500)
    total_in_cents = models.IntegerField()

    def __str__(self):
        return self.description