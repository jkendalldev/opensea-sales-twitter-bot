// const axios = require('axios');
// const twit = require('twit');

// new v2 tweet library
// const Twitter = require('twitter-api-v2');
// npm i twitter-api-v2
const {TwitterApi} = require('twitter-api-v2');

console.log("LOOK, I GOT PAST REQUIRING THE twitter-api-v2 module !!!!");


const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN_KEY,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

console.log("LOOK, tweet.js ... I GOT PAST SETTING UP MY TWITTER OBJECT !!!!");

async function tweet(tweetText) {
  // console.log('Inside of myfunction');
  // const { data: createdTweet } = await client.v2.tweet('PIXA-BUILDER BOT Says twitter-api-v2 is awesome JAN 28!', {
  // const { data: createdTweet } = await client.v2.tweet('PIXA-BUILDER BOT Says twitter-api-v2 is awesome JAN 28!', {  
    // poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
  // });

  const { data: createdTweet } = await client.v2.tweet(tweetText);

  console.log('Tweet', createdTweet.id, ':', createdTweet.text);
  }

  // Here we wait for the myfunction to finish
  // and then returns a promise that'll be waited for aswell
  // It's useless to wait the myfunction to finish before to return
  // we can simply returns a promise that will be resolved later
  // Also point that we don't use async keyword on the function because
  // we can simply returns the promise returned by myfunction
  
  // function start() {
    // return tweet();
  // }
  
  // Call start
  // (async() => {
    // console.log('before start');
    // await start();
    // console.log('after start');
  // })();



/*
// below this line was already here for v1
const twitterConfig = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

const twitterClient = new twit(twitterConfig);

// Tweet a text-based status
async function tweet(tweetText) {
    const tweet = {
        status: tweetText,
    };

    twitterClient.post('statuses/update', tweet, (error, tweet, response) => {
        if (!error) {
            console.log(`Successfully tweeted: ${tweetText}`);
        } else {
            console.error(error);
        }
    });
}

// OPTIONAL - use this method if you want the tweet to include the full image file of the OpenSea item in the tweet.
async function tweetWithImage(tweetText, imageUrl) {
    // Format our image to base64
    const processedImage = await getBase64(imageUrl);

    // Upload the item's image from OpenSea to Twitter & retrieve a reference to it
    twitterClient.post('media/upload', { media_data: processedImage }, (error, media, response) => {
        if (!error) {
            const tweet = {
                status: tweetText,
                media_ids: [media.media_id_string]
            };

            twitterClient.post('statuses/update', tweet, (error, tweet, response) => {
                if (!error) {
                    console.log(`Successfully tweeted: ${tweetText}`);
                } else {
                    console.error(error);
                }
            });
        } else {
            console.error(error);
        }
    });
}

// Format a provided URL into it's base64 representation
function getBase64(url) {
    return axios.get(url, { responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

*/


module.exports = {
    tweet: tweet
    // tweet: tweet,
    // tweetWithImage: tweetWithImage
};