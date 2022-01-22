const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
// const tweet = require('./tweet');
const cache = require('./cache');

console.log("START START START START START START START START!");



axios.get('https://testnets-api.opensea.io/api/v1/events', {
// headers: {
  // 'X-API-KEY': process.env.X_API_KEY
// },  
params: {
    event_type: 'successful',
    only_opensea: 'false',
    collection_slug: 'clonex-mfz9ecb4mm',
    asset_contract_address: '0x3ec9c3cb29ed95a396a48a4fbdb6b8546d001d5a',
    token_id: '845'
  }
}).then(response => {
    const events = _.get(response, ['data', 'asset_events']);
    // console.log(events);
    
    const sortedEvents = _.sortBy(events, function(event) {
      const created = _.get(event, 'created_date');
      console.log("CREATED ON...");
        // return new Date(created);
    })

});


console.log("FINISH FINISH FINISH FINISH FINISH FINISH FINISH!");
    