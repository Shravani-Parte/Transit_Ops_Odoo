<<<<<<< HEAD
FROM python:3.12-slim
=======
FROM python:3.11-slim
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
<<<<<<< HEAD
=======
EXPOSE 8000
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
