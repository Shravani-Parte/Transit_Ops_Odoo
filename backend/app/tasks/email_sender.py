"""SMTP email sender for reminders/notifications. Placeholder (bonus)."""
from app.tasks.celery_app import celery_app


@celery_app.task
def send_email(to: str, subject: str, body: str) -> None:
    """Send transactional email via SMTP settings from env. Placeholder."""
    return None
