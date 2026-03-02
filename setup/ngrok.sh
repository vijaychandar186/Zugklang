#!/usr/bin/env bash
set -euo pipefail

curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update \
  && sudo apt install -y ngrok

ngrok config add-authtoken 3APTVsRBjOlhZek7ftvBkUpljpl_4a797F7zfuWjoM5qvDDsA
nohup ngrok http --url=unmellifluently-unforcible-ricky.ngrok-free.dev 3000 >/dev/null 2>&1 &