'use strict';

const FeedParser = require('feedparser');
const request = require('request');

module.exports = {
  fetch: (url, cb) => {
    console.log('fetching feed');

    const req = request(url, {timeout: 10000, pool: false});
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    const feedparser = new FeedParser();

    req.on('error', (error) => { cb(error); });
    req.on('response', function(res) {
      console.log('received feeds');

      if (res.statusCode != 200) { return this.emit('error', new Error('Bad status code')); }
      this.pipe(feedparser);
    });

    let posts = [];
    feedparser.on('error', (error) => { cb(error); });
    feedparser.on('readable', function() {
      console.log('parsing feeds');

      let item;
      while (item = this.read()) { posts.push(item); }
    });
    feedparser.on('end', function() { cb(null, posts); });
  },
  normalize: (posts) => {
    console.log('normalizing posts');

    return posts.map((p) => { return { title: p.title, link: p.link }; });
  },
  findNotInHistory: (posts, history) => {
    return posts.filter((p) => !~history.findIndex((h) => h.link === p.link));
  }
}
