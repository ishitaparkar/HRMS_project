from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # This calls the original ObtainAuthToken's logic
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # This creates a token if it doesn't exist, or gets the existing one
        token, created = Token.objects.get_or_create(user=user)
        
        # This is the custom part: we are returning the token, user_id, and email in the response
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })