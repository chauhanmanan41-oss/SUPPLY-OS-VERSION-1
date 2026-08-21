from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.organizations.serializers import OrganizationSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name", "phone"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    default_organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", "full_name", "phone",
            "avatar_url", "default_organization", "is_email_verified", "created_at",
        ]
        read_only_fields = ["id", "email", "is_email_verified", "created_at"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Adds a few convenience claims to the JWT so the frontend doesn't need an
    extra round-trip right after login just to know who it's talking to.
    Authorization for individual requests is still re-checked server-side
    via OrganizationMiddleware + RBAC permission classes — these claims are
    for UI convenience only, never trusted as the source of truth.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["full_name"] = user.full_name
        if user.default_organization_id:
            token["default_organization_id"] = str(user.default_organization_id)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
