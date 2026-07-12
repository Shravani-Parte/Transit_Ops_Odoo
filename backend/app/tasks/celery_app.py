"""Celery app for scheduled jobs (license expiry, email reminders)."""
from celery import Celery
from app.core.config import settings

celery_app = Celery("transitops", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.beat_schedule = {
    "license-expiry-daily": {
        "task": "app.tasks.license_expiry_check.scan",
        "schedule": 60 * 60 * 24,  # daily
    },
}
