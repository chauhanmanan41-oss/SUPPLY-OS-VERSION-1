import os
# pyrefly: ignore [missing-import]
import dj_database_url

from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
# Force SQLite for local development to avoid PostgreSQL driver issues
DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"