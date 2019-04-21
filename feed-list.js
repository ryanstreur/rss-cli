const fs = require("fs");
const feed = require("./feed");

module.exports = {
  addFeed: addFeed
};

function addFeed(feedUrl, feedListLocation) {
  feed.pull(feedUrl).then(feedData => {
    const newFeed = feed.getMetadata(feedData);
    fs.readFile(feedListLocation, "utf8", addNewFeedData(newFeed));
  });

  function addNewFeedData(newFeed) {
    return function pushNewFeedToList(err, rawFeedList) {
      if (err) throw err;
      const feedList = JSON.parse(rawFeedList);
      const existingFeedData = feedList.find(f => (f.feedUrl = feedUrl));
      if (existingFeedData) return;
      else {
        feedList.push(newFeed);
        fs.writeFile(feedListLocation, JSON.stringify(feedList), err => {
          if (err) throw err;
          console.log("added feed:", newFeed);
        });
      }
    };
  }
}
