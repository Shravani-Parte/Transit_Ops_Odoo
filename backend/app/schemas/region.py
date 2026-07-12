from pydantic import BaseModel


<<<<<<< HEAD
class RegionRead(BaseModel):
    id: str
    name: str
=======
class RegionOut(BaseModel):
    region_id: int
    region_name: str
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8

    class Config:
        from_attributes = True
