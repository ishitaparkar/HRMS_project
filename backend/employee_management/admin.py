from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """Admin interface for Employee model."""
    list_display = ('employeeId', 'firstName', 'lastName', 'department', 'designation', 'joiningDate')
    list_filter = ('department', 'designation', 'joiningDate')
    search_fields = ('employeeId', 'firstName', 'lastName', 'personalEmail', 'department', 'designation')
    ordering = ('employeeId',)
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('firstName', 'lastName', 'employeeId', 'personalEmail', 'mobileNumber')
        }),
        ('Employment Details', {
            'fields': ('department', 'designation', 'joiningDate')
        }),
    )
