from django.db import models

class Item(models.Model):
    item_number = models.CharField(max_length=100, unique=True)
    item_name = models.CharField(max_length=255)
    price_in_cents = models.IntegerField()

    def __str__(self):
        return f"{self.item_number} - {self.item_name}"