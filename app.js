const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
const tweet = require('./tweet'); //  new v2 tweet library
const cache = require('./cache');


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


// Poll OpenSea every 30mins & retrieve all sales for a given collection in either the time since the last sale OR in the last 1 hour
setInterval(() => {
const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(3600, "seconds").unix();
console.log(`******************** LAST SALE TIME: ${lastSaleTime}`);
console.log(`Last sale (in seconds since Unix epoch): ${cache.get('lastSaleTime', null)}`);

axios.get('https://api.opensea.io/api/v1/events', {
headers: {
  'X-API-KEY': process.env.X_API_KEY
},  
params: {
    event_type: 'successful',
    only_opensea: 'false',
    collection_slug: 'pixawizards',
    occurred_after: lastSaleTime
  }
}).then(response => {
    const events = _.get(response, ['data', 'asset_events']);
    console.log("Printing out events if there were any from OpenSea API call...");
    console.log(events);
    
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
        console.log("SENDING TWEET NOW !!");
        console.log("BELOW IS THE SALE EVENT INFO........................................");
        console.log(event);
        return formatAndSendTweet(event);
    });

}).catch((error) => {
    console.error(error);
});
}, 1800000); // This is every 30mins