from django.urls import path
from .views import CustomAuthToken

urlpatterns = [
    # This creates the URL /api/login/
    path('login/', CustomAuthToken.as_view(), name='auth-token'),
]