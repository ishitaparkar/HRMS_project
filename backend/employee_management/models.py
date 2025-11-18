from django.db import models

class Employee(models.Model):
    # We use CharField for text-based fields with a max length.
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    employeeId = models.CharField(max_length=20, unique=True) # Ensure every employee ID is unique
    
    # EmailField provides email validation.
    personalEmail = models.EmailField(max_length=100, unique=True)
    mobileNumber = models.CharField(max_length=15)
    
    # DateField is for storing dates.
    joiningDate = models.DateField()
    
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.firstName} {self.lastName} ({self.employeeId})"

    class Meta:
        permissions = [
            ("view_all_employees", "Can view all employees"),
            ("view_department_employees", "Can view department employees"),
            ("manage_employees", "Can manage employees"),
        ]