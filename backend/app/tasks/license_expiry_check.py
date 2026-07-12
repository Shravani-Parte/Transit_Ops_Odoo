"""Daily scan for expiring driver licenses. Placeholder."""
from app.tasks.celery_app import celery_app


@celery_app.task
def scan():
    """Query drivers whose license_expiry_date is within N days
    (N from settings.license_expiry_remind_days) and create notifications
    + queue emails.
    """
    return {"scanned": 0, "notified": 0}
