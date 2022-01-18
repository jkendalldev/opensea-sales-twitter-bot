const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
// const tweet = require('./tweet');
const cache = require('./cache');

// HELLO WORLD TEST CODE
// console.log("LOOK v8 !!!!!!!!!!!!!!!!!!!!!!");
// var minutes = 60, the_interval = minutes * 60 * 1000;
// setInterval(function() {
//   console.log("LOOK...I am doing my X minutes check");
//   // do your stuff here
// }, the_interval);


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


// Poll OpenSea every 60 seconds & retrieve all sales for a given collection in either the time since the last sale OR in the last minute
setInterval(() => {
    const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(59, "seconds").unix();

    console.log(`Last sale (in seconds since Unix epoch): ${cache.get('lastSaleTime', null)}`);

    // use testing API key in postman next and change API URL next..
    // https://testnets-api.opensea.io/api/v1/events?collection_slug=ruthless-raccoons&event_type=successful&only_opensea=false&occurred_after=2022-01-01T18:45:40&token_id=25&asset_contract_address=0x34c06aee75d6aa530a8521e8323f2813f3cfcb1a
    // axios.get('https://api.opensea.io/api/v1/events', {
    axios.get('https://testnets-api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': process.env.X_API_KEY
        },
        params: {
            collection_slug: process.env.OPENSEA_COLLECTION_SLUG,
            event_type: 'successful',
            occurred_after: lastSaleTime,
            only_opensea: 'false'
        }
    }).then((response) => {
        const events = _.get(response, ['data', 'asset_events']);

        const sortedEvents = _.sortBy(events, function(event) {
            const created = _.get(event, 'created_date');

            return new Date(created);
        })

        console.log(`${events.length} sales since the last one...`);

        _.each(sortedEvents, (event) => {
            const created = _.get(event, 'created_date');

            cache.set('lastSaleTime', moment(created).unix());

            // UNCOMMENT THIS LATER:
            // return formatAndSendTweet(event);
            console.log(`${events} WERE THE EVENTS `);

        });
    }).catch((error) => {
        console.error(error);
    });
}, 60000);