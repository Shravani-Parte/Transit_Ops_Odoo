"""Reusable pagination helpers."""
from math import ceil


def paginate_meta(total: int, page: int, size: int) -> dict:
    return {"total": total, "page": page, "size": size, "pages": ceil(total / size) if size else 0}
