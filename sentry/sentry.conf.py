from sentry.conf.server import *  # noqa
import os

DATABASES = {
    "default": {
        "ENGINE": "sentry.db.postgres",
        "NAME": "sentry",
        "USER": "sentry",
        "PASSWORD": os.environ["SENTRY_POSTGRES_PASSWORD"],
        "HOST": "sentry-postgres",
        "PORT": "5432",
    }
}

# Cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": ["sentry-memcached:11211"],
        "OPTIONS": {"ignore_exc": True},
    }
}

# Required by newer Sentry releases for attachment/default cache initialization.
SENTRY_CACHE = "sentry.cache.redis.RedisCache"
SENTRY_CACHE_OPTIONS = {"cluster": "default"}

# Redis
SENTRY_OPTIONS.update(
    {
        "redis.clusters": {
            "default": {
                "hosts": {0: {"host": "sentry-redis", "port": 6379}},
            }
        },
    }
)

# Kafka / event pipeline
KAFKA_CLUSTERS = {
    "default": {
        "bootstrap.servers": "sentry-kafka:9092",
    }
}

BROKER_URL = "redis://sentry-redis:6379"
SENTRY_RATELIMITER = "sentry.ratelimits.redis.RedisRateLimiter"
SENTRY_BUFFER = "sentry.buffer.redis.RedisBuffer"
SENTRY_QUOTAS = "sentry.quotas.redis.RedisQuota"
SENTRY_DIGESTS = "sentry.digests.backends.redis.RedisBackend"

# Snuba
SENTRY_SEARCH = "sentry.search.snuba.EventsDatasetSnubaSearchBackend"
SENTRY_TSDB = "sentry.tsdb.redissnuba.RedisSnubaTSDB"
SENTRY_EVENTSTREAM = "sentry.eventstream.kafka.KafkaEventStream"
SENTRY_ANALYTICS = "sentry.analytics.snuba.SnubaAnalyticsBackend"
SENTRY_OUTCOMES_CONSUMER = "sentry.outcomes.consumers.OutcomesConsumer"

SNUBA = "http://snuba-api:1218"

# Secret key — loaded from environment
SECRET_KEY = os.environ["SENTRY_SECRET_KEY"]

# Relay
SENTRY_RELAY_WHITELIST_PK = []

# File storage (local — swap for S3/GCS in larger deployments)
SENTRY_OPTIONS["filestore.backend"] = "filesystem"
SENTRY_OPTIONS["filestore.options"] = {"location": "/data/files"}

# Email
SENTRY_OPTIONS.update(
    {
        "mail.backend": "smtp",
        "mail.host": os.environ.get("SENTRY_EMAIL_HOST", "localhost"),
        "mail.port": int(os.environ.get("SENTRY_EMAIL_PORT", 25)),
        "mail.username": os.environ.get("SENTRY_EMAIL_USER", ""),
        "mail.password": os.environ.get("SENTRY_EMAIL_PASSWORD", ""),
        "mail.use-tls": os.environ.get("SENTRY_EMAIL_USE_TLS", "false").lower() == "true",
        "mail.from": os.environ.get("SENTRY_SERVER_EMAIL", "root@localhost"),
    }
)

SENTRY_OPTIONS["system.url-prefix"] = os.environ.get("SENTRY_URL_PREFIX", "http://localhost:9000")

# Avoid pyuwsgi runtime issues in minimal self-hosted deployments.
SENTRY_USE_UWSGI = False

# Suppress info-level noise; only warnings and errors surface in logs.
import logging
logging.root.setLevel(logging.WARNING)
