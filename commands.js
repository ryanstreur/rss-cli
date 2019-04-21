const feedList = require("./feed-list");

module.exports = {
  addFeedCmd: addFeedCmd
};

function addFeedCmd(feedUrl, cmd) {
  feedList.addFeed(feedUrl, "./example-config.json");
}
