from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import TransitOpsException
from app.db.init_db import create_tables, init_db
from app.db.session import SessionLocal

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(TransitOpsException)
async def transitops_exception_handler(request: Request, exc: TransitOpsException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.on_event("startup")
def on_startup():
    create_tables()
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()


app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
