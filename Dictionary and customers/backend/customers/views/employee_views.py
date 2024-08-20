from customers.models.employee import Employee
from customers.serializers.employee_serializers import EmployeeSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
def employees(request):
    if request.method == 'GET':
        data = Employee.objects.all()
        serializer = EmployeeSerializer(data, many=True)
        return Response({'employees': serializer.data})
    
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'employee': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET', 'PATCH', 'DELETE'])
def employee(request, id):
    employee = get_object_or_404(Employee, id=id)
    
    if request.method == 'GET':
        serializer = EmployeeSerializer(employee)
        return Response({'employee': serializer.data})
    
    elif request.method == 'PATCH':
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'employee': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)