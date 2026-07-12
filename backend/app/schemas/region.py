from pydantic import BaseModel


class RegionOut(BaseModel):
    region_id: int
    region_name: str

    class Config:
        from_attributes = True
