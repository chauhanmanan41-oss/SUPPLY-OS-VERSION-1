from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

from .models import Document

ALLOWED_EXTENSIONS = {
    "pdf", "png", "jpg", "jpeg", "gif", "webp",
    "xls", "xlsx", "doc", "docx", "csv",
}
MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB


class DocumentSerializer(serializers.ModelSerializer):
    content_type_model = serializers.CharField(write_only=True)  # e.g. "product", "purchaseorder"

    class Meta:
        model = Document
        fields = [
            "id", "file", "original_filename", "category", "content_type_model",
            "object_id", "size_bytes", "mime_type", "created_at",
        ]
        read_only_fields = ["id", "original_filename", "size_bytes", "mime_type", "created_at"]

    def validate_file(self, value):
        ext = value.name.rsplit(".", 1)[-1].lower() if "." in value.name else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"File type '.{ext}' is not allowed. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
            )
        if value.size > MAX_UPLOAD_SIZE_BYTES:
            raise serializers.ValidationError("File exceeds the 25MB upload limit.")
        return value

    def validate_content_type_model(self, value):
        try:
            return ContentType.objects.get(model=value.lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Unknown model '{value}'.")

    def create(self, validated_data):
        content_type = validated_data.pop("content_type_model")
        file = validated_data["file"]
        validated_data["content_type"] = content_type
        validated_data["original_filename"] = file.name
        validated_data["size_bytes"] = file.size
        validated_data["mime_type"] = getattr(file, "content_type", "") or ""
        return super().create(validated_data)
