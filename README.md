## Task summary
* Write a Product Bidding web application
* Seller can create and manage posts
* Buyer can search product, submit bid, etc
* Share Github or Bitbucket URL
## Usage
* Start the project by running `docker compose up`
* While the containers are running execute `./install.sh`
* Navigate to `https://localhost`
* Accept the self-signed certificate. ***If the client completely stops working you might need to refresh the page and accept this again!***
* There are 2 users created by `install.sh` that you can use:  

    | **username** | **password** |
    |--------------|--------------|
    | buyer        | buyer        |
    | seller       | seller       |
* Or generate new ones like this `./sf.sh app:add-user username password role` where `role` is either `ROLE_BUYER` or `ROLE_SELLER`
## Note on Mercure
Api platform pushes events to the frontend through Mercure and the client subscribes to these, so any update is reflected immediately on the client.

For example if someone is looking at an auction and someone else adds a bid, the page will automatically update with the new data.

Same is true if you are looking at the auction list, adding bids to an auction updates the current price column for that auction.
## Running commands with php container
* `docker compose exec php bin/console`
  * Shortcut: `./sf.sh`
* `docker compose exec php bin/phpunit`
* `docker compose exec php composer`
* `docker compose exec php php vendor/bin/php-cs-fixer fix`
## Comments
Spent way too much time trying to figure out how to properly use next.js and eventually gave up on it for this task and decided to use plain react.

I never used typescript or created a react app from scratch so I had a lot of things to figure out. Api platforms client generator gave an okay starting point but the generated code was not exactly working so had to change a lot of things.

There are still missing functionality and I'm not too happy about the status of the code so I will probably keep working on it, but this commit is the state that the code is in at the deadline.
## Assumptions
* Prices do not need to be `decimal` in DB
* Only sellers are able to post auctions
* Only buyers are able to post bids
* Bids must increase in value, startingPrice is inclusive
* You can bid on your own bid
* Bids cannot be added after closingTime
* Accepted/Rejected auctions cannot be reopened
* Auction closing time cannot be in the past
## Shortcuts
* Missing cleanup for unused MediaObjects (store createdAt -> background job periodically cleans old records not linked to auctions)
* Race condition with prices not handled when placing bids
* Timezones are not handled properly
* No refresh tokens for JWT auth
* Helm charts are not updated
