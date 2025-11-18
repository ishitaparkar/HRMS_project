from django.contrib import admin
from .models import LeaveRequest

# Register your models here.
@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'employee', 'leave_type', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'leave_type', 'start_date']
    search_fields = ['employee__firstName', 'employee__lastName', 'reason']
    date_hierarchy = 'start_date'
