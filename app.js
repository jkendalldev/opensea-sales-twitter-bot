const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
// const tweet = require('./tweet');
const cache = require('./cache');

// Poll OpenSea every 60 seconds & retrieve all sales for a given collection in either the time since the last sale OR in the last minute
setInterval(() => {

console.log('\n');
console.log('\n');
console.log('\n');
console.log("TOP OF setInterval LOOP...");
console.log('\n');
console.log('\n');
console.log('\n');

// so what happens with the API call when lastSaleTime is "undefined"?

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
    collection_slug: 'clonex-mfz9ecb4mm',
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
        // return formatAndSendTweet(event);
    });
// });

}).catch((error) => {
    console.error(error);
});
}, 60000);

// console.log("FINISH FINISH FINISH FINISH FINISH FINISH FINISH!");
    