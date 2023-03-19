# smtp-pushover

![Docker Image Version (latest semver)](https://img.shields.io/docker/v/mattbun/smtp-pushover?sort=semver)

A simple smtp (sendmail) server that forwards all emails to [pushover](https://pushover.net/).

## Why?

It's an easy way to get tools like `smartmontools` to send you push notifications. It can also be handy for quickly scripting push notifications without having to have your pushover credentials all over the place.

## How do I use it?

Docker images are available at [Docker Hub](https://hub.docker.com/r/mattbun/smtp-pushover) and [GitHub Container Registry](https://github.com/mattbun/smtp-pushover/pkgs/container/smtp-pushover).

To use it with `docker-compose`, you could configure it like this:

```yaml
services:
  smtp-pushover:
    restart: unless-stopped
    container_name: smtp-pushover
    image: ghcr.io/mattbun/smtp-pushover
    ports:
      - "25:25"
    environment:
      - PORT=25 # optional, defaults to 25
      - PUSHOVER_USER=...
      - PUSHOVER_TOKEN=...
```

and start it with

```shell
docker-compose up smtp-pushover
```

Now, if you configure a smtp client to use localhost:25, you can send notifications with:

```shell
echo -e "Subject:Test\n\nHello" | msmtp blah@blah.com
```

### Some details

* The destination email doesn't matter, smtp-pushover will forward all email to pushover.
* The subject of the email becomes the title of the push notification.
* The contents of the email become the text of the push notification.

## Development

1. Clone this repo
2. `yarn install` to install dependencies
3. `yarn build` to compile typescript
4. `yarn start` to start the server
