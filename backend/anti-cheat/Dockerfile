FROM python:3.14-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv==0.8.22
WORKDIR /app
ENV HOME=/app
ENV XDG_CACHE_HOME=/app/.cache
COPY pyproject.toml uv.lock ./
COPY schema.prisma ./
RUN uv sync --no-dev --frozen
# Pre-fetch Prisma query engine and generate Python client at build time
# so container startup does not need to download Node.js or engine binaries.
# PATH must include .venv/bin so prisma generate can locate the prisma-client-py generator.
RUN export PATH="/app/.venv/bin:$PATH" && prisma py fetch && prisma generate --schema schema.prisma \
    && find /app/.cache -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null; \
    find /app/.cache -name "package.json" -o -name "package-lock.json" | xargs rm -f 2>/dev/null; true
COPY src/ src/
COPY model/ model/
COPY .env.base ./
COPY start.sh ./
COPY generate_synthetic_artifacts.py ./
# Generate input_data/ artifacts required by the live ML inference pipeline.
RUN .venv/bin/python generate_synthetic_artifacts.py
RUN chmod +x start.sh

FROM python:3.14-slim
RUN apt-get update && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
RUN groupadd --system kaladin && useradd --system --gid kaladin --home /app kaladin
WORKDIR /app
ENV HOME=/app
ENV XDG_CACHE_HOME=/app/.cache
ENV PATH=/app/.venv/bin:$PATH
COPY --from=build /app/.venv ./.venv
COPY --from=build /app/.cache ./.cache
COPY --from=build /app/src ./src
COPY --from=build /app/model ./model
COPY --from=build /app/input_data ./input_data
COPY --from=build /app/.env.base ./.env.base
COPY --from=build /app/start.sh ./start.sh
COPY --from=build /app/schema.prisma ./schema.prisma
RUN mkdir -p /app/.cache /app/.npm \
    && chown -R kaladin:kaladin /app/.venv /app/src /app/model /app/input_data /app/.cache /app/.npm \
    /app/.env.base /app/start.sh /app/schema.prisma \
    && chmod +x ./start.sh
USER kaladin

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=5)" || exit 1

ENTRYPOINT ["./start.sh"]
