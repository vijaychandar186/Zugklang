FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ make && \
    pip install --no-cache-dir uv && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies using uv (frozen = respect lock file exactly)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy application code
COPY src/ ./src/
COPY main.py ./

# Model weights are mounted at runtime (bind mount or volume)
# Expected path: /app/model/weights/eval{use_eval}_tc{tc}_days{days}/

# PYTHONPATH lets Python resolve `main`, `config`, `api`, `data`, `model`
# without requiring a src. prefix (matching the import style in src/)
ENV PYTHONPATH=/app/src

# --- Runtime configuration (override via -e / docker run / compose) ---
ENV LOG_LEVEL=INFO
ENV DATA_DIR=/app/data
ENV MODEL_DIR=/app/model/weights
ENV USE_EVAL=0
ENV TC_LIST=[2,6]
ENV DAYS_LIST=[180]
ENV MONGODB_URI=mongodb://mongo:27017
ENV MONGODB_DB=kaladin
ENV MONGODB_COLLECTION=insights

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
