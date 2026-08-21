import os
import sys
import django
import json

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.organizations.models import Organization
from apps.ai.services import GeminiMarketplaceAssistant

def run_verification():
    org = Organization.objects.filter(name="MAXMAN").first()
    if not org:
        org = Organization.objects.first()
    print(f"\n==========================================")
    print(f"Executing AI Verification for Org: {org.name} (ID: {org.id})")
    print(f"==========================================\n")

    assistant = GeminiMarketplaceAssistant()

    queries = [
        "Find raw material suppliers",
        "Compare top manufacturers",
        "Recommend packaging suppliers"
    ]

    for q in queries:
        print(f"\n---> TEST QUERY: \"{q}\"")
        result = assistant.execute(org, q)
        clean_answer = result['answer'].encode('ascii', 'replace').decode('ascii')
        print(f"\n[AI Response Answer]:\n{clean_answer[:450]}...\n")
        print(f"[Verified Tool Called]: {result['tool_called']}")
        print(f"[Records Used Count]: {len(result['records_used'])}")
        print(f"[Model Used]: {result['model_version']}")
        print(f"[Execution Time]: {result['execution_time_ms']} ms")
        
        # Verify conditions
        assert len(result['records_used']) > 0, f"FAILED: records_used is empty for '{q}'!"
        assert "No matching records found" not in result['answer'], f"FAILED: Fallback message appeared for '{q}' despite having records!"
        print(f"✅ PASSED verification for: \"{q}\"")
        print("-" * 60)

if __name__ == "__main__":
    run_verification()
