# Ngrok Setup

## Install Ngrok

### Windows (Chocolatey)

```
choco install ngrok
```

### Linux (APT)

```
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
	| sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
	&& echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
	| sudo tee /etc/apt/sources.list.d/ngrok.list \
	&& sudo apt update \
	&& sudo apt install ngrok
```

### macOS (Homebrew)

```
brew install ngrok/ngrok/ngrok
```

## Add Authentication Token

```
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## Expose Local Service

```
ngrok http 3000
```

## Expose With Custom Domain

```
ngrok http --url=YOUR_SUBDOMAIN.ngrok-free.app 3000
```
