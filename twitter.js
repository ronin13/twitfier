// [START app]
"use strict";
var Twitter = require('twitter');
var sleep = require('sleep');
var process = require('process');
var console = require('console');
 
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var Pinboard = require('node-pinboard');
var pinboard = new Pinboard(process.env.PINBOARD_TOKEN);


var stream = client.stream('user', {});
stream.on('data', function(event) {
  if (event && event.user) {


        var params = {screen_name: event.user.screen_name};
        console.log('Looking up ' + event.user.screen_name);
        client.get('users/lookup', params, function(error, tweets, response) {
            //console.dir(event.user);
            if (!error) {
                console.log(tweets[0].notifications);
                //console.dir(tweets);
                if (tweets[0].notifications === true) {
                    var day = new Date(Date.parse(event.created_at));
                    var month = day.toString().split(' ')[1]
                    var weekday = day.toString().split(' ')[0]
                    var year = day.toString().split(' ')[3]
                    day = day.toDateString().replace(/\s/g,'-');

                    var suggested = ['myhose', 'pinsource', 'emnotified', weekday, year, month, day, event.user.screen_name].join(', ')

                    var url = 'https://twitter.com/'+event.user.screen_name+'/status/'+event.id_str;
                    var inturl = '';

                    if (event.entities.urls.length > 0)
                        inturl = event.entities.urls[0].expanded_url || '';

                    pinboard.suggest(url, function(err, body) { 

                        if (!err) { 
                            if (body[0].popular && body[0].popular.length > 0)
                                suggested+= ',' + body[0].popular.join(); 

                            if (body[0].recommended && body[0].recommended.length > 0)
                                suggested+= ',' + body[0].recommended.join(); 

                        } else {
                            console.log('Pinboard suggestions failed');
                        }

                        pinboard.suggest(inturl, function(err, body) { 
                            if (!err) { 
                                if (body[0].popular && body[0].popular.length > 0)
                                    suggested+= ',' + body[0].popular.join(); 

                                if (body[0].recommended && body[0].recommended.length > 0)
                                    suggested+= ',' + body[0].recommended.join(); 
                            }

                            var options = {
                                url: url,
                                description: event.text,
                                tags: suggested
                            };
                            console.log('Sending to pinboard');
                            console.dir(options);

                            pinboard.add(options, function(err, res) {
                                if (err)
                                    throw err;
                                console.log(res);
                            });


                        });

                    
                    });

                    

                }
            } else {
                console.log('Twitter lookup error ');
                console.dir(error);
                if (error[0].code === 88) {
                    console.log('Sleeping longer due to rate limiting ');
                    sleep.sleep(900);
                } else {
                    sleep.sleep(10);
                }
            }
        });
      
  }

  //if (event && event.user) {
     //var url =  'https://twitter.com/'+event.user.screen_name+'/status/'+event.id_str;
    //console.log(url, '++++', event.text, '++++++', event.user.screen_name, '++++++++++', event.user.notifications);
  //}
});
 
stream.on('error', function(error) {
    console.log('Twitter stream error');
    console.dir(error);
    // This is just a band-aid, need a better back-off
    // for Twitter's 420 response for ratelimiting.
    sleep.sleep(60);
});
// [END app]
