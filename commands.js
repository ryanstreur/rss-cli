const feedList = require("./feed-list");
const itemList = require('./item-list');

module.exports = {
  addFeedCmd: addFeedCmd,
  pullItems: pullItems
};

function addFeedCmd(feedUrl, cmd) {
  feedList.addFeed(feedUrl, "./example-config.json");
}

function pullItems(feedUrl, cmd) {
  if (cmd.headlines) {
    itemList.getAllItems(items => items.forEach(item => console.log(item.title)));
  } else if (!feedUrl) {
    itemList.getAllItems(logTitle);
  }
}

function logTitle(items) {
  items.forEach(i => console.log(i.title, i.pubDate));
}
