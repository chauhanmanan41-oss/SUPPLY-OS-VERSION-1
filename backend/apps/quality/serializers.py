from rest_framework import serializers

from .models import QualityInspection


class QualityInspectionSerializer(serializers.ModelSerializer):
    inspected_by_name = serializers.CharField(source="inspected_by.full_name", read_only=True)
    batch_number = serializers.CharField(source="production_batch.batch_number", read_only=True)

    class Meta:
        model = QualityInspection
        fields = [
            "id", "production_batch", "batch_number", "checks", "result",
            "inspected_by", "inspected_by_name", "notes", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
