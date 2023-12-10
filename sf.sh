#!/bin/sh
# Run symfony console commands in running docker container
docker compose exec php bin/console "$@"
