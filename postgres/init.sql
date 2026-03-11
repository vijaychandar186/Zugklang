-- Creates both application databases on first postgres container initialization.
-- Runs automatically when the postgres volume is empty (fresh install).
CREATE DATABASE "zugklang-frontend";
CREATE DATABASE "zugklang-anti-cheat";
CREATE DATABASE "grafana";
