FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

# Install dependencies (cached layer)
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev

# Generate Prisma client
COPY schema.prisma ./
RUN uv run prisma generate

# Copy application code and model weights
COPY src/ src/
COPY model/ model/
COPY .env.base ./
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 8000

ENTRYPOINT ["./start.sh"]
