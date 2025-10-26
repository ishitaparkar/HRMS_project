from rest_framework import generics
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer

# This view will handle GET (list all) and POST (create new)
class LeaveRequestListCreateAPIView(generics.ListCreateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

# This view will handle GET (detail), PUT/PATCH (update), and DELETE
class LeaveRequestDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer