FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create a start script to run both processes
RUN echo "#!/bin/bash\npython -m dashboard.api.main & python main.py" > /app/start.sh
RUN chmod +x /app/start.sh

# Expose the dashboard port
EXPOSE 8000

CMD ["/app/start.sh"]
