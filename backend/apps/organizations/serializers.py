from rest_framework import serializers

from .models import Membership, Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "industry", "logo_url", "is_active", "plan", "created_at"]
        read_only_fields = ["id", "created_at"]


class MembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = Membership
        fields = [
            "id", "user", "user_email", "user_full_name",
            "organization", "organization_name", "role", "is_active", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=Membership._meta.get_field("role").choices)

    def validate_role(self, value):
        if value == "super_admin":
            raise serializers.ValidationError("Super Admin cannot be assigned via invite.")
        return value
