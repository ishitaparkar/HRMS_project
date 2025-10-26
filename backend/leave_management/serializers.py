from rest_framework import serializers
from .models import LeaveRequest
# Import the Employee model itself to perform the database lookup
from employee_management.models import Employee
# Import the EmployeeSerializer to handle the nested display of employee details
from employee_management.serializers import EmployeeSerializer 

class LeaveRequestSerializer(serializers.ModelSerializer):
    # This field is for READING data (when you GET the list of leave requests).
    # It will display a nested object with the employee's full details.
    employee = EmployeeSerializer(read_only=True)
    
    # This field is for WRITING data (when you POST a new leave request).
    # Your React form sends this field. It is not saved directly to the database.
    employee_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = LeaveRequest
        # List all the fields that the API will interact with.
        fields = ['id', 'employee', 'employee_id', 'start_date', 'end_date', 'leave_type', 'status', 'reason']

    # This custom `create` method is the key to fixing the error.
    # It overrides Django's default behavior.
    def create(self, validated_data):
        # 1. Take the 'employee_id' out of the incoming data dictionary.
        employee_id = validated_data.pop('employee_id')
        
        # 2. Use that ID to find the actual Employee object in the database.
        try:
            employee_instance = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            # If no employee with that ID is found, raise a clean validation error.
            raise serializers.ValidationError({"employee_id": "An employee with this ID does not exist."})

        # 3. Create the new LeaveRequest object.
        #    Crucially, we pass the full `employee_instance` object to the `employee` field,
        #    and the rest of the validated data (`**validated_data`) to the other fields.
        leave_request = LeaveRequest.objects.create(employee=employee_instance, **validated_data)
        return leave_request