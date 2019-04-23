const fs = require('fs');
const feed = require('./feed-single');
const homedir = require('os').homedir();
const _ = require('lodash');

module.exports = {
  addFeed,
  getFeeds
};

function addFeed(feedUrl, feedMapLocation) {
  feed.pull(feedUrl).then(feedData => {
    const newFeed = feed.getMetadata(feedData);
    if (!fs.existsSync(feedMapLocation)) {
      const newFeedMap = {};
      newFeedMap[feedUrl] = newFeed;
      fs.writeFile(feedMapLocation, JSON.stringify(newFeedMap), err => {
        if (err) throw err;
        console.log('added feed:', newFeed);
      });
    }
    fs.readFile(feedMapLocation, 'utf8', addNewFeedData(newFeed));
  });

  function addNewFeedData(newFeed) {
    return function pushNewFeedToList(err, rawFeedMap) {
      if (err) throw err;
      const feedMap = JSON.parse(rawFeedMap);

      if (feedMap[feedUrl]) return;
      else {
        feedMap[feedUrl] = newFeed;
        fs.writeFile(feedMapLocation, JSON.stringify(feedMap), err => {
          if (err) throw err;
          console.log('added feed:', newFeed);
        });
      }
    };
  }
}

function getFeeds(callback) {
  const feedListLocation = `${homedir}/.rss-feeds.json`;
  if (!fs.existsSync(feedListLocation)) {
    return [];
  }
  fs.readFile(feedListLocation, 'utf8', (err, data) => {
    if (err) throw err;
    const feedMap = JSON.parse(data);
    callback(feedMap);
  });
}
