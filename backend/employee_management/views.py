from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
from authentication.permissions import IsHRManager, IsEmployee
from authentication.utils import (
    user_has_any_role,
    get_user_department,
    ROLE_SUPER_ADMIN,
    ROLE_HR_MANAGER,
    ROLE_EMPLOYEE
)


class EmployeeListCreateAPIView(generics.ListCreateAPIView):
    """
    List and create employees with role-based filtering and permissions.
    
    GET: Returns employees based on user role:
        - Super Admin/HR Manager: All employees
        - Employee: Only their own employee record
    
    POST: Requires HR Manager or Super Admin role
    """
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter employees based on user role.
        """
        user = self.request.user
        
        # Super Admin and HR Manager can see all employees
        if user_has_any_role(user, [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]):
            return Employee.objects.all()
        
        # Employee can only see their own record
        if hasattr(user, 'profile') and user.profile and user.profile.employee:
            return Employee.objects.filter(id=user.profile.employee.id)
        
        return Employee.objects.none()
    
    def perform_create(self, serializer):
        """
        Create employee with permission check.
        Only HR Manager and Super Admin can create employees.
        """
        user = self.request.user
        
        # Check if user has permission to manage employees
        if not user_has_any_role(user, [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to create employees.")
        
        serializer.save()
    
    def create(self, request, *args, **kwargs):
        """
        Override create to add account creation details to the response.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Get the created employee instance
        employee = serializer.instance
        
        # Prepare response data
        response_data = serializer.data
        
        # Add account creation details if available
        if hasattr(employee, '_account_creation_result'):
            result = employee._account_creation_result
            response_data['account_creation'] = {
                'user_account_created': result['user_account_created'],
                'username': result['username'],
            }
            
            # If there was an error, include it in the response
            if result['error_message']:
                response_data['account_creation']['error'] = result['error_message']
                response_data['account_creation']['warning'] = (
                    "Employee created successfully, but user account creation encountered an issue. "
                    "Please manually create the account or contact system administrator."
                )
            else:
                # Success message
                response_data['account_creation']['message'] = (
                    f"Employee and user account created successfully. "
                    f"Login credentials have been sent to {result['username']}."
                )
        
        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_serializer_context(self):
        """
        Add permission metadata to serializer context.
        """
        context = super().get_serializer_context()
        context['user_roles'] = list(self.request.user.groups.values_list('name', flat=True))
        context['can_manage'] = user_has_any_role(
            self.request.user, 
            [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]
        )
        return context


class EmployeeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a single employee with role-based permissions.
    
    GET: Allowed based on role and department scope
    PUT/PATCH: Requires HR Manager or Super Admin role
    DELETE: Requires HR Manager or Super Admin role
    """
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter employees based on user role for object-level access.
        """
        user = self.request.user
        
        # Super Admin and HR Manager can access all employees
        if user_has_any_role(user, [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]):
            return Employee.objects.all()
        
        # Employee can only access their own record
        if hasattr(user, 'profile') and user.profile and user.profile.employee:
            return Employee.objects.filter(id=user.profile.employee.id)
        
        return Employee.objects.none()
    
    def perform_update(self, serializer):
        """
        Update employee with permission check.
        Only HR Manager and Super Admin can update employees.
        """
        user = self.request.user
        
        # Check if user has permission to manage employees
        if not user_has_any_role(user, [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to update employees.")
        
        serializer.save()
    
    def perform_destroy(self, instance):
        """
        Delete employee with permission check.
        Only HR Manager and Super Admin can delete employees.
        """
        user = self.request.user
        
        # Check if user has permission to manage employees
        if not user_has_any_role(user, [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to delete employees.")
        
        instance.delete()
    
    def get_serializer_context(self):
        """
        Add permission metadata to serializer context.
        """
        context = super().get_serializer_context()
        context['user_roles'] = list(self.request.user.groups.values_list('name', flat=True))
        context['can_manage'] = user_has_any_role(
            self.request.user, 
            [ROLE_SUPER_ADMIN, ROLE_HR_MANAGER]
        )
        return context