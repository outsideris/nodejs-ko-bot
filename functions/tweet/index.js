'use strict';

const feed = require('./feed');
const store = require('./store');
const tweet = require('./tweet');

const FEED_URL = 'https://nodejs.github.io/nodejs-ko/atom.xml';

exports.handle = (e, ctx, cb) => {
  console.log('starting function');

  feed.fetch(FEED_URL, (err, posts) => {
    if (err) { return cb(err); }

    posts = feed.normalize(posts);
    store.getHistory((err, history) => {
      if (err) { return cb(err); }

      const postsToTweet = feed.findNotInHistory(posts, history);
      console.log('posts to tweet:', postsToTweet.length, postsToTweet);

      let failToTweet = [];
      const next = (posts, cb) => {
        const p = posts.pop();

        if (p) {
          tweet.post(`${p.title}\n${p.link}`, (err, tweet) => {
            if (err) { failToTweet.push(p); }
            next(posts, cb);
          });
        } else {
          cb();
        }
      };

      if (postsToTweet.length > 0) {
        next(postsToTweet, () => {
          console.log('failToTweet:', failToTweet.length, failToTweet);
          const newHistory = feed.findNotInHistory(posts, failToTweet);

          store.saveHistory(newHistory, (err) => {
            cb(err, newHistory);
          });
        });
      } else {
        cb();
      }
    });
  });
};
