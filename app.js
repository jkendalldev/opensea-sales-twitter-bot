const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
// const tweet = require('./tweet');
const cache = require('./cache');

console.log("LOOK - START RUNNING!!!");

// https://testnets-api.opensea.io/api/v1/collections?offset=0&limit=300

axios.get('https://testnets-api.opensea.io/api/v1/events', {
  params: {
    event_type: 'successful',
    only_opensea: 'false',
    collection_slug: 'clonex-mfz9ecb4mm',
    asset_contract_address: '0x3ec9c3cb29ed95a396a48a4fbdb6b8546d001d5a',
    token_id: '845'
  }
}).then(response => {
    console.log(response.data);
});

/*
axios.get('https://testnets-api.opensea.io/api/v1/events', {
  params: {
    event_type: 'successful',
    only_opensea: 'false',
    collection_slug: 'clonex-mfz9ecb4mm',
    asset_contract_address: '0x3ec9c3cb29ed95a396a48a4fbdb6b8546d001d5a',
    token_id: '845'
    }
    }).then((response) => {
      const events = _.get(response, ['asset_events']);
      console.log(`${events}`);
    })
*/

console.log("LOOK - STOP RUNNING!!!");
    