const tweet = require('../functions/tweet/tweet');
const expect = require('chai').expect;

// To run this test, you must set environment variables.
// TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN_KEY, TWITTER_ACCESS_TOKEN_SECRET
describe.skip('Tweet', () => {
  describe('post', () => {
    it('should update status on twitter', (done) => {
      tweet.post('test', (err, result) => {
        if (err) { return done(new Error()); }

        expect(result).to.exist;
        done();
      });
    });
  });
});
