const Parser = require("rss-parser");
const parser = new Parser();

module.exports = {
  pull: pull,
  pullItems: pullItems,
  getMetadata: getMetadata
};

function pull(feedUrl) {
  return parser.parseURL(feedUrl);
}

function pullItems(feedUrl) {
  return pull(feedUrl).then(feed => feed.items);
}

function getMetadata(feed) {
  let feedMetadata = {};
  for (let key in feed) {
    if (!key.includes('items')) {
      feedMetadata[key] = feed[key];
    }
  }
  return feedMetadata;
}
