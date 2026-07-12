"""Number / date / currency formatting helpers."""
from decimal import Decimal


def inr(amount: Decimal | float | int) -> str:
    return f"₹{Decimal(amount):,.2f}"
