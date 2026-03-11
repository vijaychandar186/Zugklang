FROM python:3.13-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv==0.8.22
WORKDIR /app
ENV HOME=/app
ENV XDG_CACHE_HOME=/app/.cache
COPY pyproject.toml uv.lock ./
COPY schema.prisma ./
RUN uv sync --no-dev --frozen
COPY src/ src/
COPY model/ model/
COPY .env.base ./
COPY start.sh ./
RUN chmod +x start.sh

FROM python:3.13-slim
RUN apt-get update && apt-get install -y --no-install-recommends libatomic1 \
    && rm -rf /var/lib/apt/lists/*
RUN groupadd --system kaladin && useradd --system --gid kaladin --home /app kaladin
WORKDIR /app
ENV HOME=/app
ENV XDG_CACHE_HOME=/app/.cache
ENV PATH=/app/.venv/bin:$PATH
COPY --from=build /app/.venv ./.venv
COPY --from=build /app/src ./src
COPY --from=build /app/model ./model
COPY --from=build /app/.env.base ./.env.base
COPY --from=build /app/start.sh ./start.sh
COPY --from=build /app/schema.prisma ./schema.prisma
RUN mkdir -p /app/.cache /app/.npm \
    && chown -R kaladin:kaladin /app/.venv /app/src /app/model /app/.cache /app/.npm \
    /app/.env.base /app/start.sh /app/schema.prisma \
    && chmod +x ./start.sh
USER kaladin

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=5)" || exit 1

ENTRYPOINT ["./start.sh"]
