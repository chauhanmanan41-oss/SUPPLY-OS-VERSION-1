from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.common.permissions import IsAuthenticatedAndActive

from .serializers import CustomTokenObtainPairSerializer, RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    Public signup. Does NOT create an organization — the frontend should send
    the user straight to the "create your company" onboarding step
    (POST /api/v1/organizations/create/) right after this succeeds.
    """
    serializer_class = RegisterSerializer
    permission_classes = []
    authentication_classes = []


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """Blacklists the refresh token so it can no longer be used to mint new access tokens."""
    permission_classes = [IsAuthenticatedAndActive]

    def post(self, request):
        try:
            refresh = request.data["refresh"]
            RefreshToken(refresh).blacklist()
        except (KeyError, TokenError):
            return Response({"detail": "Invalid or missing refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticatedAndActive]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticatedAndActive]

    def post(self, request):
        old_password = request.data.get("old_password", "")
        new_password = request.data.get("new_password", "")

        if not request.user.check_password(old_password):
            return Response({"old_password": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth.password_validation import validate_password
        validate_password(new_password, user=request.user)

        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        return Response({"detail": "Password updated."})
