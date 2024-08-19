from django.contrib import admin
from customers.models import Customer, Order

class CustomerAdmin(admin.ModelAdmin):
    def _queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user=request.user)
    
class OrderAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user=request.user)
    
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Order, OrderAdmin)