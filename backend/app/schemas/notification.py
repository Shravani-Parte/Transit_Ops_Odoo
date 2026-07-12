from datetime import datetime
from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: str
    kind: str
    payload: dict | None
    read_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True
