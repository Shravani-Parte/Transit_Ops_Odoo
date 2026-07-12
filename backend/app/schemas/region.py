from pydantic import BaseModel


class RegionRead(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True
