const fs = require("fs");
const feed = require("./feed");

module.exports = {
  addFeed: addFeed
};

function addFeed(feedUrl, feedMapLocation) {
  feed.pull(feedUrl).then(feedData => {
    const newFeed = feed.getMetadata(feedData);
    fs.readFile(feedMapLocation, "utf8", addNewFeedData(newFeed));
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
          console.log("added feed:", newFeed);
        });
      }
    };
  }
}

