from rest_framework import serializers
from .models import AIInteractionLog


class MarketplaceAIQuerySerializer(serializers.Serializer):
    """
    Validates incoming natural language requests from React AI components (v1 compatibility).
    """
    question = serializers.CharField(max_length=1500, required=True, allow_blank=False)
    conversation_history = serializers.ListField(
        child=serializers.DictField(), required=False, default=list
    )
    context = serializers.DictField(required=False, default=dict)

    def validate_question(self, value):
        stripped = value.strip()
        if len(stripped) < 2:
            raise serializers.ValidationError("Question must be at least 2 characters long.")
        return stripped


class CopilotQuerySerializer(serializers.Serializer):
    """
    Validates inquiries for SupplyOS AI Copilot V2.
    """
    question = serializers.CharField(max_length=3000, required=True, allow_blank=False)
    module = serializers.CharField(max_length=100, required=False, default="copilot")
    context = serializers.DictField(required=False, default=dict)

    def validate_question(self, value):
        stripped = value.strip()
        if len(stripped) < 1:
            raise serializers.ValidationError("Question cannot be empty.")
        return stripped


class AIProductGenerateSerializer(serializers.Serializer):
    description = serializers.CharField(max_length=4000, required=True, allow_blank=False)


class AIProductValidateSerializer(serializers.Serializer):
    product_data = serializers.DictField(required=True)


class AIProcurementPlanSerializer(serializers.Serializer):
    description = serializers.CharField(max_length=4000, required=True, allow_blank=False)


class AIDocumentGenerateSerializer(serializers.Serializer):
    doc_type = serializers.CharField(max_length=100, required=True)
    description = serializers.CharField(max_length=4000, required=False, allow_blank=True, default="")
    context = serializers.DictField(required=False, default=dict)


class AIInteractionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteractionLog
        fields = [
            "id",
            "module",
            "question",
            "response_text",
            "tools_used",
            "records_count",
            "execution_time_ms",
            "created_at",
        ]
        read_only_fields = fields


# ── AI Product Architect Serializers ─────────────────────────────────────────

class InterviewStartSerializer(serializers.Serializer):
    """No input required — starts a new interview session."""
    pass


class InterviewMessageSerializer(serializers.Serializer):
    """Validates a user message sent to an active interview session."""
    session_id = serializers.UUIDField(required=True)
    message = serializers.CharField(max_length=5000, required=True, allow_blank=False)

    def validate_message(self, value):
        stripped = value.strip()
        if len(stripped) < 1:
            raise serializers.ValidationError("Message cannot be empty.")
        return stripped


class InterviewCreateWorkspaceSerializer(serializers.Serializer):
    """Validates the workspace creation request from a completed interview."""
    session_id = serializers.UUIDField(required=True)

