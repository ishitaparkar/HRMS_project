from rest_framework import serializers
from .models import Employee
from authentication.services import AccountCreationService


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model with permission metadata and account creation.
    """
    # Add read-only fields for permission metadata
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    
    # Add fields for user account information
    has_user_account = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = '__all__'
    
    def get_can_edit(self, obj):
        """
        Determine if the current user can edit this employee.
        """
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        # Check if user has manage permission from context
        return self.context.get('can_manage', False)
    
    def get_can_delete(self, obj):
        """
        Determine if the current user can delete this employee.
        """
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        # Check if user has manage permission from context
        return self.context.get('can_manage', False)
    
    def get_has_user_account(self, obj):
        """
        Check if the employee has a linked user account.
        """
        return hasattr(obj, 'user_profile') and obj.user_profile is not None and obj.user_profile.user is not None
    
    def get_username(self, obj):
        """
        Get the username of the linked user account.
        """
        if hasattr(obj, 'user_profile') and obj.user_profile and obj.user_profile.user:
            return obj.user_profile.user.username
        return None
    
    def create(self, validated_data):
        """
        Override create to automatically create a user account for the employee.
        """
        from rest_framework.exceptions import ValidationError
        
        # Create the employee record first
        employee = super().create(validated_data)
        
        # Attempt to create user account
        request = self.context.get('request')
        user_account_created = False
        username = None
        temporary_password = None
        error_message = None
        
        try:
            user, temporary_password, created = AccountCreationService.create_user_account(
                employee=employee,
                request=request
            )
            user_account_created = created
            username = user.username
        except ValueError as e:
            # Handle duplicate email or existing account errors
            error_message = str(e)
            # Don't fail employee creation, but report the error
        except Exception as e:
            # Handle other errors (role assignment, email sending, etc.)
            error_message = f"Account creation failed: {str(e)}"
            # Don't fail employee creation, but report the error
        
        # Store account creation details in the instance for the view to access
        employee._account_creation_result = {
            'user_account_created': user_account_created,
            'username': username,
            'temporary_password': temporary_password,
            'error_message': error_message
        }
        
        return employee
    
    def to_representation(self, instance):
        """
        Add permission metadata to the serialized representation.
        """
        representation = super().to_representation(instance)
        
        # Add permission metadata
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            representation['_permissions'] = {
                'can_edit': self.get_can_edit(instance),
                'can_delete': self.get_can_delete(instance),
                'user_roles': self.context.get('user_roles', [])
            }
        
        return representation