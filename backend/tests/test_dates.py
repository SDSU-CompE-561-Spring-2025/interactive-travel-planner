import pytest
from datetime import date as dt_date
from app.schemas.dates import DatesCreate

def test_create_date_schema():
    date = DatesCreate(
        start_date="2025-06-01",
        end_date="2025-06-15"
    )

    assert date.start_date == dt_date(2025, 6, 1)
    assert date.end_date == dt_date(2025, 6, 15)

def test_date_invalid_format():
    with pytest.raises(ValueError):
        DatesCreate(
            start_date="June 1st, 2025",
            end_date="June 15th, 2025"
        )
