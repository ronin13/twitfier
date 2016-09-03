# twitfier
Routes the 'mobile' notifications of Twitter user stream to pinboard.
This is something I wrote since I found it hard to deal with twitter
user push notifications (https://support.twitter.com/articles/20169887)
on android and wanted it archived in some place such as Pinboard.
Pinboard is also useful as a jumpboard to connect to other services
through IFTTT.

## Running locally

1. Create a file called config with:
```
    export TWITTER_CONSUMER_KEY=
    export TWITTER_CONSUMER_SECRET=
    export TWITTER_ACCESS_TOKEN_KEY=
    export TWITTER_ACCESS_TOKEN_SECRET=
    export PINBOARD_TOKEN=""
```
where you can get twitter credentials from api.twitter.com and pinboard
token from Pinboard settings.

2. npm install node-pinboard sleep twitter --save

3. node twitter.js

## Running on GAE

Update package.json with credentials, 
follow this [hello-world](https://cloud.google.com/nodejs/getting-started/hello-world) 
and to deploy and promote:

    gcloud app deploy --promote


## Disclaimer
This is something I wrote for my own usage. I am far from a javascript/nodejs expert.
Use at your own risk.

## Thanks to:
* Suggestions provided on twitter community forum: https://twittercommunity.com/t/mobile-notifications-and-filtering-through-api/71744
* Libraries I am using 
    - [node-pinboard](https://github.com/maxmechanic/node-pinboard)
    - [twitter](https://www.npmjs.com/package/twitter)
    - [sleep](https://www.npmjs.com/package/sleep)
