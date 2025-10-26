from django.db import models
# Import the Employee model from your other app
from employee_management.models import Employee 

class LeaveRequest(models.Model):
    # A ForeignKey creates a relationship. Each leave request belongs to one employee.
    # on_delete=models.CASCADE means if an employee is deleted, their leave requests are also deleted.
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    start_date = models.DateField()
    end_date = models.DateField()
    leave_type = models.CharField(max_length=50) # e.g., 'Sick Leave', 'Casual Leave'
    
    # We'll use choices to limit the status to specific options.
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Denied', 'Denied'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    reason = models.TextField(blank=True) # The reason can be optional

    def __str__(self):
        return f"{self.employee.firstName}'s {self.leave_type} request"