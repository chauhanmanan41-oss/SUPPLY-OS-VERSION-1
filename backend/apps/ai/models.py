from django.db import models
from apps.common.models import OrgOwnedModel


class AIInteractionLog(OrgOwnedModel):
    """
    Records every interaction with the AI Assistant (Marketplace v1 and future modules).
    Ensures auditability, performance monitoring, and multi-tenant isolation.
    """
    MODULE_CHOICES = [
        ("marketplace", "Marketplace AI v1"),
        ("procurement", "Procurement AI"),
        ("inventory", "Inventory AI"),
        ("production", "Production AI"),
        ("general", "General Copilot"),
        ("copilot", "Enterprise AI Copilot V2"),
        ("product_builder", "AI Product Builder"),
        ("product_validator", "AI Product Validator"),
        ("procurement_planner", "AI Procurement Planner"),
        ("document_generator", "AI Document Generator"),
    ]

    module = models.CharField(max_length=50, choices=MODULE_CHOICES, default="marketplace")
    question = models.TextField(help_text="User input question or query")
    response_text = models.TextField(help_text="Final text response returned by AI Assistant")
    tools_used = models.JSONField(default=list, blank=True, help_text="List of tool names and parameters invoked during reasoning")
    records_count = models.PositiveSmallIntegerField(default=0, help_text="Number of database records passed to LLM context")
    execution_time_ms = models.PositiveIntegerField(default=0, help_text="Total elapsed execution time in milliseconds")
    model_version = models.CharField(max_length=100, default="gemini-2.5-flash", blank=True)
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Interaction Log"
        verbose_name_plural = "AI Interaction Logs"

    def __str__(self):
        return f"[{self.module}] {self.question[:50]}... ({self.execution_time_ms}ms)"
