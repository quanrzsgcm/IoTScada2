from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import UserCreateSerializer, UserSerializer
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.forms.models import model_to_dict


User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        data = request.data

        # serializer = UserCreateSerializer(data=data)

        # if not serializer.is_valid():
        #   return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # user = serializer.create(serializer.validated_data)
        # user = UserSerializer(user)

        # return Response(user.data, status=status.HTTP_201_CREATED)
        first_name = data["first_name"]
        last_name = data["last_name"]
        email = data["email"]
        password = data["password"]

        user = User.objects.create_user(first_name, last_name, email, password)
        user = UserCreateSerializer(user)
        return Response(user.data, status=status.HTTP_201_CREATED)


class RetrieveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = UserSerializer(user)

        return Response(user.data, status=status.HTTP_200_OK)
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class ChangeUserTimezoneView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # Assuming the JSON request contains a 'timezone' key with the new timezone value
        new_timezone = data.get('timezone')

        if new_timezone:
            user.timezone = new_timezone
            user.save()

            # Serialize the updated user data
            serialized_user = UserSerializer(user)
            return Response(serialized_user.data, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid request. Provide a valid timezone.'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    user_data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'is_staff': user.is_staff,
        'timezone': user.timezone,
    }

    return JsonResponse(user_data)
