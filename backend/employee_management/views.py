from rest_framework import generics
from .models import Employee
from .serializers import EmployeeSerializer

# This view handles GET (list all) and POST (create new) requests for the /api/employees/ URL.
# You already have this, and it is correct.
class EmployeeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


# --- ADD THE NEW VIEW BELOW ---

# This is a new view to handle requests for a *single* employee.
# It will manage URLs like /api/employees/1/, /api/employees/2/, etc.
# 'RetrieveUpdateDestroyAPIView' automatically provides the logic for:
# 1. GET requests to retrieve a single employee's details.
# 2. PUT requests to update that employee's details.
# 3. DELETE requests to delete that employee.
class EmployeeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer