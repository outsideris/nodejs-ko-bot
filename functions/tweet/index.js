'use strict';

const feed = require('./feed');

const FEED_URL = 'https://nodejs.github.io/nodejs-ko/atom.xml';

exports.handle = (e, ctx, cb) => {
  console.log('starting function');

  feed.fetch(FEED_URL, (err, posts) => {
    if (err) { return cb(err); }

    posts = feed.normalize(posts);
    cb(null, posts);
  });
};
