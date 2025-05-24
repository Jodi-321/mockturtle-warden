#
# Sockpuppet Sentinel - Backend Dockerfile 
#
#
# === Stage 1: Builder ===
FROM python:3.11-slim AS builder

LABEL maintainer="Sockpuppet Sentinel Team" \
    stage="builder" \
    description="Installs dependencies and validates backend app"

# === Set work directory inside container ===
WORKDIR /app

# === Install system dependencies ===
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# === Create and activate vitual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH="/app"

# === Copy only requirements to leverage Docker layer caching
COPY requirements.txt .

# === Install Python dependencies (optimized, compiled)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --compile -r requirements.txt

# === Copy backend application code
COPY . .

# === Run tests to validate app before production build
RUN pip install pytest && \
    pytest tests/ -v --tb=short

# === Run test to validate FastAPI can start
RUN python -c "from main import app; print('FastAPI app loaded')"

#### ==== Stage 2: Runtime ====
FROM python:3.11-slim AS production

LABEL maintiner="Sockpuppet Sentinel Team" \
    stage="runtime" \
    description="Minimal runtime image for backend"

# Set root filesystem as read-only
VOLUME ["/tmp"]

# === Set working directory
WORKDIR /app

# === Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# === Copy virtual environemnt and app code from builder stage
COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /app /app/

# === Set environment varibales
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app"

# === Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser
USER appuser

# === Expose port
EXPOSE 8000

# === Health check to ensure app responds
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit

# === Default command to start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]





# === Copy project files ===
#COPY . /app

# === Install Python dependencies ===
#RUN pip install --upgrade pip && pip install -r requirements.txt

# === Expose the port the app runs on ===
#EXPOSE 8000

# === Set environment variables ===
# These are overridden with --env-file in development or via Elastic Beanstalk in prod
#ENV PYTHONUNBUFFERED=1
#ENV PYTHONPATH="/app"

# === Start FastAPI with uvicorn ===
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
