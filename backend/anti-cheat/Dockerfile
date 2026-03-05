FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Install uv (pinned version for reproducibility)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && mv /root/.local/bin/uv /usr/local/bin/uv

# Create non-root user
RUN groupadd --system kaladin && useradd --system --gid kaladin --home /app kaladin

WORKDIR /app

# Ensure runtime caches are written to a non-root, writable location.
ENV HOME=/app
ENV XDG_CACHE_HOME=/app/.cache

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

RUN chown -R kaladin:kaladin /app
USER kaladin

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost:8000/health 2>/dev/null || exit 1

ENTRYPOINT ["./start.sh"]
