const feedList = require("./feed-list");
const itemList = require("./item-list");
const read = require("./commands/read");
const homedir = require("os").homedir();

module.exports = {
  addFeedCmd: addFeedCmd,
  pullItems: pullItems,
  read: read.read,
  readSaved: read.readSaved
};

function addFeedCmd(feedUrl, cmd) {
  feedList.addFeed(feedUrl, `${homedir}/.rss-feeds.json`);
}

function pullItems(feedUrl, cmd) {
  if (cmd.headlines) {
    itemList.getAllItems(items =>
      items.forEach(item => console.log(item.title))
    );
  } else if (!feedUrl) {
    itemList.getAllItems(logTitle);
  }
}

function logTitle(items) {
  items.forEach(i => console.log(i.title, i.pubDate));
}
