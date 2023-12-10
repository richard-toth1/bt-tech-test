## Task summary
* Write a Product Bidding web application
* Seller can create and manage posts
* Buyer can search product, submit bid, etc
* Share Github or Bitbucket URL
## Usage
* Start the project by running `docker compose up`
* While the containers are running execute `./install.sh`
* Navigate to `https://localhost`
## Running commands with php container
* `docker compose exec php bin/console`
  * Shortcut: `./sf.sh`
* `docker compose exec php bin/phpunit`
* `docker compose exec php composer`
* `docker compose exec php php vendor/bin/php-cs-fixer fix`
## Assumptions
* Prices do not need to be `decimal` in DB
* Only sellers are able to post auctions
* Only buyers are able to post bids
## Shortcuts
* Missing cleanup for unused MediaObjects (store createdAt -> background job periodically cleans old records not linked to auctions)
