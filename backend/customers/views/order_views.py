from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from customers.models.order import Order
from customers.models.item import Item
from customers.models.order_item import OrderItem
from customers.models.customer import Customer
from customers.serializers.order_serializer import OrderSerializer

@api_view(['GET', 'POST'])
def orders(request, customer_id):
    try:
        customer_instance = Customer.objects.get(pk=customer_id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # List all orders for a specific customer
        data = Order.objects.filter(customer=customer_instance)
        serializer = OrderSerializer(data, many=True)
        return Response({'orders': serializer.data})

    elif request.method == 'POST':
        # Add the customer to the order data
        data = request.data.copy()
        data['customer'] = customer_instance.id

        items_data = data.pop('items', [])

        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            
            for item_data in items_data:
                item_id = item_data.get('item_id')
                quantity = item_data.get('quantity', 1)
                
                try:
                    item_instance = Item.objects.get(pk=item_id)
                    OrderItem.objects.create(order=order, item=item_instance, quantity=quantity)
                except Item.DoesNotExist:
                    # If the item does not exist, return a 400 error
                    return Response({"error": f"Item with id {item_id} does not exist."}, status=status.HTTP_400_BAD_REQUEST)


            return Response({'order': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
def order(request, customer_id, order_id):
    try:
        customer_instance = Customer.objects.get(pk=customer_id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Ensure the order exists and belongs to the given customer
        order_instance = Order.objects.get(pk=order_id, customer=customer_instance)
    except Order.DoesNotExist:
        return Response({"error": "Order not found for this customer."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order_instance)
        return Response({'order': serializer.data})

    elif request.method == 'PATCH':
        serializer = OrderSerializer(order_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'order': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        order_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)