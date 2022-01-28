# OpenSea Sales Twitter Bot - Modified for @pixa_nft_sales

A (quickly put together) bot that monitors Opensea sales for a given collection & then posts them to Twitter.

## Useful Commands

npm install
git push -u heroku master
git push -u origin master
heroku login
heroku create
heroku ps:scale web=1
heroku open
heroku logs --tail
heroku ps
heroku ps:scale web=0
heroku ps:scale web=1
heroku local web
heroku addons:create papertrail
heroku addons:docs papertrail
heroku run bash
heroku config:set CONSUMER_KEY="<YOUR KEY HERE>"
heroku config:set CONSUMER_SECRET="<YOUR KEY HERE>"
heroku config:set ACCESS_TOKEN_KEY="<YOUR KEY HERE>"
heroku config:set ACCESS_TOKEN_SECRET="<YOUR KEY HERE>"
heroku config:set X_API_KEY="<YOUR KEY HERE>"
heroku config
$env:Path += $env:Path + 'C:\Program Files\heroku\bin'
heroku ps:scale web=0
heroku ps:scale worker=1


## Useful Links

https://wiegand.io/nft/pixa/collection/pixawizards.json
so you can use this json files later
I call these endpoint on opensea if you need more
https://api.opensea.io/api/v1/collection/pixawizards
for witch, brews... the same
key is always the opensea collection name
'pixawizards',
'pixawyverns',
'pixawitches',
'pixabrews',
'relics-of-the-pixarealm',


## Additional Info


In the Settings section of your Heroku app you'll see a Config Vars section. Add the following config vars:

- **CONSUMER_KEY** - Your Twitter Developer App's Consumer Key
- **CONSUMER_SECRET** - Your Twitter Developer App's Consumer Secret
- **ACCESS_TOKEN_KEY** - The Access Token Key of the Twitter Account your bot is posting from
- **ACCESS_TOKEN_SECRET** - The Access Token Secret of the Twitter Account your bot is posting from
- **OPENSEA_COLLECTION_SLUG** - The OpenSea collection name you wish to track (e.g. `cryptopunks`)
- **X_API_KEY** - Your unique OpenSea API key

Now you're ready to release - just push up the code via. git to the Heroku remote (see [Heroku Remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote) if unsure how).

Make sure you are using `worker` dynos and not `web` dynos - you can set this in the CLI your project with:

```sh
heroku ps:scale web=0
heroku ps:scale worker=1
```


## TODOS