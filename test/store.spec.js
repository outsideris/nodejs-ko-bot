const store = require('../functions/tweet/store');
const expect = require('chai').expect;

const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

describe('Store', () => {
  describe('getHistory', () => {
    afterEach((done) => {
      const params = {
        Bucket: process.env.BUCKET || 'nodejs-ko',
        Key: process.env.POSTED_HISTORY_KEY || 'history-test.json'
      };
      s3.deleteObject(params, done);
    });

    it('should read history file from s3', (done) => {
      const fixture = [{title:'title1', link:'https://url/1'},{title:'title2',link:'https://url/2'}];
      const params = {
        Bucket: process.env.BUCKET || 'nodejs-ko',
        Key: process.env.POSTED_HISTORY_KEY || 'history-test.json',
        Body: JSON.stringify({history: fixture}),
        ContentType: 'application/json'
      };

      s3.putObject(params, (err) => {
        if (err) { return done(err); }

        store.getHistory((err, history) => {
          if (err) { return done(err); }

          expect(history).to.eql(fixture);
          done();
        });
      });

    });

    it('should return empty array if there is no key', (done) => {
      store.getHistory((err, history) => {
        if (err) { return done(err); }

        expect(history.length).to.equal(0);
        done();
      });
    });
  });

  describe('saveHistory', () => {
    it('should save posted history', (done) => {
      const history = [
        { title: 'Node v4.5.0(LTS)', link: 'https://nodejs.github.io/nodejs-ko/articles/2016/08/16/release-v4.5.0/' },
        { title: 'Node v6.4.0(최신 버전)', link: 'https://nodejs.github.io/nodejs-ko/articles/2016/08/16/release-v6.4.0/' }
      ];

      store.saveHistory(history, (err, data) => {
        if (err) { return done(err); }

        expect(data).to.have.property('ETag');
        done();
      });
    });
  });
});
