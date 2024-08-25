from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from customers.models.order import Order
from customers.models.customer import Customer
from customers.models.order_item import OrderItem
from customers.serializers.order_item_serializer import OrderItemSerializer

@api_view(['GET', 'POST'])
def order_items(request, customer_id, order_id):
    """
    Handle requests to list all items for a specific order or create a new item for a specific order.
    """
    # Ensure the customer exists
    try:
        customer_instance = Customer.objects.get(pk=customer_id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the order exists and belongs to the given customer
    try:
        order_instance = Order.objects.get(pk=order_id, customer=customer_instance)
    except Order.DoesNotExist:
        return Response({"error": "Order not found for this customer."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # List all items for a specific order
        data = OrderItem.objects.filter(order=order_instance)
        serializer = OrderItemSerializer(data, many=True)
        return Response({'order_items': serializer.data})

    elif request.method == 'POST':
        # Add the order to the order item data
        data = request.data.copy()
        data['order'] = order_instance.id

        serializer = OrderItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'order_item': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
def order_item(request, customer_id, order_id, item_id):
    """
    Handle requests to retrieve, update, or delete a specific item for a specific order.
    """
    # Ensure the customer exists
    try:
        customer_instance = Customer.objects.get(pk=customer_id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the order exists and belongs to the given customer
    try:
        order_instance = Order.objects.get(pk=order_id, customer=customer_instance)
    except Order.DoesNotExist:
        return Response({"error": "Order not found for this customer."}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the order item exists and belongs to the given order
    try:
        order_item_instance = OrderItem.objects.get(pk=item_id, order=order_instance)
    except OrderItem.DoesNotExist:
        return Response({"error": "Order item not found for this order."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderItemSerializer(order_item_instance)
        return Response({'order_item': serializer.data})

    elif request.method == 'PATCH':
        serializer = OrderItemSerializer(order_item_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'order_item': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        order_item_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)