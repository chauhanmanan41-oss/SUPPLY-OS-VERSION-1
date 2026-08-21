import os
import django

# Setup django environment to introspect apps
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.apps import apps

APPS_DIR = 'apps'
for app_config in apps.get_app_configs():
    if not app_config.name.startswith('apps.'):
        continue
        
    app_name = app_config.name.split('.')[-1]
    app_path = os.path.join(APPS_DIR, app_name)
    admin_file = os.path.join(app_path, 'admin.py')
    
    # Introspect models
    models = app_config.get_models()
    model_names = [model.__name__ for model in models]
    
    if not model_names:
        continue # No models, no admin needed
        
    if not os.path.exists(admin_file):
        with open(admin_file, 'w', encoding='utf-8') as f:
            f.write("from django.contrib import admin\n")
            f.write(f"from .models import {', '.join(model_names)}\n\n")
            for model_name in model_names:
                f.write(f"@admin.register({model_name})\n")
                f.write(f"class {model_name}Admin(admin.ModelAdmin):\n")
                f.write(f"    pass\n\n")
        print(f"Created {admin_file} with models: {', '.join(model_names)}")
    else:
        print(f"{admin_file} already exists")

print("Admin generation complete.")
