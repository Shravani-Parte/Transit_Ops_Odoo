"""Filter query-string helpers (status, region, type, date range)."""


def normalize_status(value: str | None) -> str | None:
    return value.strip() if isinstance(value, str) else None
