from django.urls import path
from .views import LeaveRequestListCreateAPIView, LeaveRequestDetailAPIView

urlpatterns = [
    path('leave-requests/', LeaveRequestListCreateAPIView.as_view()),
    path('leave-requests/<int:pk>/', LeaveRequestDetailAPIView.as_view()),
]