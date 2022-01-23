const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
// const tweet = require('./tweet'); // old v1 tweet library
const cache = require('./cache');
// new v2 tweet library
const Twitter = require('twitter-api-v2');

// npm i twitter-api-v2

const {TwitterApi} = require('twitter-api-v2');

console.log("LOOK, I GOT PAST REQUIRING THE twitter-api-v2 module !!!!");


const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN_KEY,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

console.log("LOOK, I GOT PAST SETTING UP MY TWITTER OBJECT !!!!");

// Read a tweet!
/*
client.v2.singleTweet('1483205704303333377', {
    'tweet.fields': [
        'created_at',
     ],
  }).then((val) => {
    console.log(val)
}).catch((err) => {
    console.log(err)
})
*/

// Create a new tweet!
const { data: createdTweet } = await client.v2.tweet('PIXA-BUILDER BOT Says twitter-api-v2 is awesome!', {
    poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
  });
  console.log('Tweet', createdTweet.id, ':', createdTweet.text);

/*
// Format tweet text
function formatAndSendTweet(event) {
    // Handle both individual items + bundle sales
    const assetName = _.get(event, ['asset', 'name'], _.get(event, ['asset_bundle', 'name']));
    const openseaLink = _.get(event, ['asset', 'permalink'], _.get(event, ['asset_bundle', 'permalink']));

    const totalPrice = _.get(event, 'total_price');

    const tokenDecimals = _.get(event, ['payment_token', 'decimals']);
    const tokenUsdPrice = _.get(event, ['payment_token', 'usd_price']);
    const tokenEthPrice = _.get(event, ['payment_token', 'eth_price']);

    const formattedUnits = ethers.utils.formatUnits(totalPrice, tokenDecimals);
    const formattedEthPrice = formattedUnits * tokenEthPrice;
    const formattedUsdPrice = formattedUnits * tokenUsdPrice;

    const tweetText = `${assetName} bought for ${formattedEthPrice}${ethers.constants.EtherSymbol} ($${Number(formattedUsdPrice).toFixed(2)}) #NFT ${openseaLink}`;

    console.log(tweetText);

    // OPTIONAL PREFERENCE - don't tweet out sales below X ETH (default is 1 ETH - change to what you prefer)
    // if (Number(formattedEthPrice) < 1) {
    //     console.log(`${assetName} sold below tweet price (${formattedEthPrice} ETH).`);
    //     return;
    // }

    // OPTIONAL PREFERENCE - if you want the tweet to include an attached image instead of just text
    // const imageUrl = _.get(event, ['asset', 'image_url']);
    // return tweet.tweetWithImage(tweetText, imageUrl);

    return tweet.tweet(tweetText);
}
*/


/* UNCOMMENT ALL THIS CODE LATER...

// Poll OpenSea every 60 seconds & retrieve all sales for a given collection in either the time since the last sale OR in the last minute
setInterval(() => {
const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(59, "seconds").unix();
console.log(`******************** LAST SALE TIME: ${lastSaleTime}`);
console.log(`Last sale (in seconds since Unix epoch): ${cache.get('lastSaleTime', null)}`);

axios.get('https://testnets-api.opensea.io/api/v1/events', {
// headers: {
  // 'X-API-KEY': process.env.X_API_KEY
// },  
params: {
    event_type: 'successful',
    only_opensea: 'false',
    // collection_slug: 'clonex-mfz9ecb4mm',
    collection_slug: 'jlkcollection',
    occurred_after: lastSaleTime
    // asset_contract_address: '0x3ec9c3cb29ed95a396a48a4fbdb6b8546d001d5a',
    // token_id: '845'
  }
}).then(response => {
    const events = _.get(response, ['data', 'asset_events']);
    // console.log(events);
    
    const sortedEvents = _.sortBy(events, function(event) {
      const created = _.get(event, 'created_date');
      console.log("CREATED ON...");
      console.log(created);
      return new Date(created);
    })

    console.log(`${events.length} sales since the last one...`);

    
    _.each(sortedEvents, (event) => {
        const created = _.get(event, 'created_date');
        console.log(`EACH LOOP created ... ${created}`);
        cache.set('lastSaleTime', moment(created).unix());
        console.log(`EACH LOOP ... LAST SALE TIME: ${lastSaleTime}`);
        console.log("TWEEEEEEEEEEEEEEEEETING NOW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("BELOW IS THE EVENT ITSELF........................................");
        console.log(event);
        // return formatAndSendTweet(event);
    });

}).catch((error) => {
    console.error(error);
});
}, 60000);

*/