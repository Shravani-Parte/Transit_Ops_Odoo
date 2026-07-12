"""Generic CRUD base."""
from typing import Any, Generic, TypeVar
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

ModelT = TypeVar("ModelT")


class CRUDBase(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, model: type[ModelT]):
        self.model = model

    async def get(self, db: AsyncSession, entity_id: Any):
        result = await db.execute(select(self.model).where(self.model.id == entity_id))
        return result.scalar_one_or_none()

    async def list(self, db: AsyncSession, *, offset: int = 0, limit: int = 20, filters: dict | None = None):
        query = select(self.model)
        if filters:
            for k, v in filters.items():
                if hasattr(self.model, k) and v is not None:
                    query = query.where(getattr(self.model, k) == v)
        result = await db.execute(query.offset(offset).limit(limit))
        result_count = await db.execute(select(self.model.id))
        return {"items": result.scalars().all(), "total": len(result_count.scalars().all())}

    async def create(self, db: AsyncSession, obj_in: BaseModel):
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: ModelT, obj_in: BaseModel):
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, entity_id: Any):
        obj = await self.get(db, entity_id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj
