const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
// const tweet = require('./tweetV1.js.backup'); // old v1 tweet library
const tweet = require('./tweet'); //  new v2 tweet library
const cache = require('./cache');
// new v2 tweet library
// const Twitter = require('twitter-api-v2');
// npm i twitter-api-v2
// const {TwitterApi} = require('twitter-api-v2');

// you can remove these later:
// const fs = require('fs');
// const path = require('path');


// Read a tweet example!
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

// START HERE, FIGURE OUT HOW TO SET JSON TEXT INLINE, OR BETTER YET READ IT IN FROM YOUR
// .JSON FILE YOU SAVED.. READ THAT FILE INTO A VARIABLE AND JUST CONSOLE.LOG IT TO STDOUT !!!
// start here ^^^ // this will give you a great way to TEST, once your TEST works, then 
// figure out how to pass in the sales event JSON from the OPENSEA API CALL!

// let rawdata = fs.readFileSync(path.resolve(__dirname, 'test_event.json'));
// let testEvent = JSON.parse(rawdata);
// console.log(testEvent);



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



// Poll OpenSea every 60 seconds & retrieve all sales for a given collection in either the time since the last sale OR in the last minute
setInterval(() => {
// original line below was set for 1mins:
// const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(59, "seconds").unix();
// set this line to ~ every 5mins
// we should be able to look back as far as we want in the moment().startOf side of the statement below...
// just have the bot look back for any sales made in last 24 hours and tweet about them if it finds any..
const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(86400, "seconds").unix();
console.log(`******************** LAST SALE TIME: ${lastSaleTime}`);
console.log(`Last sale (in seconds since Unix epoch): ${cache.get('lastSaleTime', null)}`);

// axios.get('https://testnets-api.opensea.io/api/v1/events', {
axios.get('https://api.opensea.io/api/v1/events', {
headers: {
  'X-API-KEY': process.env.X_API_KEY
},  
params: {
    event_type: 'successful',
    only_opensea: 'false',
    collection_slug: 'pixawizards',
    occurred_after: lastSaleTime
    // collection_slug: 'clonex-mfz9ecb4mm',
    // collection_slug: 'jlkcollection',
    // collection_slug: 'pixawitches',
    // occurred_after: '1643485561'
    // asset_contract_address: '0xc6b0b290176aaab958441dcb0c64ad057cbc39a0',
    // token_id: '869'
  }
}).then(response => {
    const events = _.get(response, ['data', 'asset_events']);
    // comment later..
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
        console.log("TWEEEEEEEEEEEEEEEEETING NOW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("BELOW IS THE EVENT ITSELF........................................");
        console.log(event);
        return formatAndSendTweet(event);
    });

}).catch((error) => {
    console.error(error);
});
}, 300000); // Need to change this to every 5mins instead of every 1 min.

