# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Create necessary directories
RUN mkdir -p public/uploads public/data

# Run the app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:9090", "--workers", "4", "--timeout", "120", "wsgi:app"]
