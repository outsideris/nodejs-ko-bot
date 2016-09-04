'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const BUCKET = process.env.AWS_S3_BUCKET || 'nodejs-ko';
const POSTED_HISTORY_KEY = process.env.AWS_S3_POSTED_HISTORY_KEY || 'history-test.json';

module.exports = {
  getHistory: (cb) => {
    s3.getObject({Bucket: BUCKET, Key: POSTED_HISTORY_KEY}, function(err, data) {
      let history = [];

      if (err && err.code !== 'NoSuchKey') { return cb(err); }

      if (data && data.Body) {
        let body = JSON.parse(data.Body.toString());
        if (body && body.history) { history = body.history; }
      }

      cb(null, history);
    });
  },
  saveHistory: (history, cb) => {
    if (!history) { cb(new Error('history is required.')); }

    history = JSON.stringify({history: history});
    const params = {
      Bucket: BUCKET,
      Key: POSTED_HISTORY_KEY,
      Body: history,
      ContentType: 'application/json'
    };
    s3.putObject(params, (err, data) => {
      if (err) { return cb(err); }

      cb(null, data);
    });
  }
};
