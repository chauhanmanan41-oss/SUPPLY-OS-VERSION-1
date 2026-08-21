from .dev import *  # noqa: F401,F403

# Fast, isolated SQLite test database for automated testing without touching Supabase production/staging DBs
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]
