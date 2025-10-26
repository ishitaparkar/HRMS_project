from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        # This tells the serializer to automatically include all the fields
        # from your Employee model (firstName, lastName, etc.).
        fields = '__all__'