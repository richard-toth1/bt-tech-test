#!/bin/sh
docker compose exec php sh -c '
	set -e
	apk add openssl
	php bin/console lexik:jwt:generate-keypair --skip-if-exists
	setfacl -R -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
	setfacl -dR -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt

	php bin/console app:add-user buyer buyer ROLE_BUYER --skip-if-invalid
	php bin/console app:add-user seller seller ROLE_SELLER --skip-if-invalid
'
