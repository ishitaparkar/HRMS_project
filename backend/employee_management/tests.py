from django.test import TestCase
from django.contrib.auth.models import User
from .models import Employee
from authentication.models import UserProfile
from datetime import date


class EmployeeModelTest(TestCase):
    """Test cases for Employee model to verify module organization."""
    
    def setUp(self):
        """Set up test data."""
        self.employee_data = {
            'firstName': 'John',
            'lastName': 'Doe',
            'employeeId': 'EMP001',
            'personalEmail': 'john.doe@test.com',
            'mobileNumber': '+1-555-1234',
            'joiningDate': date(2024, 1, 1),
            'department': 'Computer Science',
            'designation': 'Professor',
        }
    
    def test_employee_creation(self):
        """Test that Employee model can be created successfully."""
        employee = Employee.objects.create(**self.employee_data)
        self.assertEqual(employee.firstName, 'John')
        self.assertEqual(employee.lastName, 'Doe')
        self.assertEqual(employee.employeeId, 'EMP001')
        self.assertEqual(employee.department, 'Computer Science')
        self.assertEqual(employee.designation, 'Professor')
    
    def test_employee_str_representation(self):
        """Test the string representation of Employee."""
        employee = Employee.objects.create(**self.employee_data)
        expected_str = "John Doe (EMP001)"
        self.assertEqual(str(employee), expected_str)
    
    def test_employee_unique_constraints(self):
        """Test that employeeId and personalEmail are unique."""
        Employee.objects.create(**self.employee_data)
        
        # Try to create another employee with same employeeId
        duplicate_data = self.employee_data.copy()
        duplicate_data['personalEmail'] = 'different@test.com'
        
        with self.assertRaises(Exception):
            Employee.objects.create(**duplicate_data)
    
    def test_employee_userprofile_relationship(self):
        """Test that Employee can be linked to UserProfile."""
        # Create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@test.com',
            password='testpass123'
        )
        
        # Create employee
        employee = Employee.objects.create(**self.employee_data)
        
        # Create user profile linking user and employee
        profile = UserProfile.objects.create(
            user=user,
            employee=employee,
            department='Computer Science'
        )
        
        # Verify the relationship
        self.assertEqual(profile.employee, employee)
        self.assertEqual(employee.user_profile, profile)
        self.assertEqual(user.profile, profile)
