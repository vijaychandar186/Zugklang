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
        "BACKEND": "django.core.cache.backends.memcached.PyMemcache",
        "LOCATION": "sentry-memcached:11211",
    }
}

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
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("SENTRY_EMAIL_HOST", "localhost")
EMAIL_PORT = int(os.environ.get("SENTRY_EMAIL_PORT", 25))
EMAIL_HOST_USER = os.environ.get("SENTRY_EMAIL_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("SENTRY_EMAIL_PASSWORD", "")
EMAIL_USE_TLS = os.environ.get("SENTRY_EMAIL_USE_TLS", "false").lower() == "true"
SERVER_EMAIL = os.environ.get("SENTRY_SERVER_EMAIL", "root@localhost")
DEFAULT_FROM_EMAIL = SERVER_EMAIL

SENTRY_OPTIONS["system.url-prefix"] = os.environ.get("SENTRY_URL_PREFIX", "http://localhost:9000")
