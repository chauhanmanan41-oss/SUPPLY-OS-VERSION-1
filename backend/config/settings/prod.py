import os

from .base import *  # noqa: F401,F403

DEBUG = False
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]

# Works with either a plain Postgres instance or Supabase's PostgreSQL
# connection string (set DATABASE_URL and this block resolves it via
# dj-database-url; falls back to discrete DB_* vars otherwise).
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    import dj_database_url
    DATABASES = {"default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["DB_NAME"],
            "USER": os.environ["DB_USER"],
            "PASSWORD": os.environ["DB_PASSWORD"],
            "HOST": os.environ["DB_HOST"],
            "PORT": os.environ.get("DB_PORT", "5432"),
        }
    }

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Cloud object storage (S3-compatible / Supabase Storage) — configure via env
# once a bucket exists; falls back to local disk storage otherwise.
if os.environ.get("AWS_STORAGE_BUCKET_NAME"):
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    AWS_STORAGE_BUCKET_NAME = os.environ["AWS_STORAGE_BUCKET_NAME"]
    AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL")  # Supabase Storage endpoint if used
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "us-east-1")

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
