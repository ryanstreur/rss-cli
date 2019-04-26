const Parser = require('rss-parser');
const parser = new Parser();

module.exports = {
  pull: pull,
  pullItems: pullItems,
  getMetadata: getMetadata
};

function pull(feedUrl) {
  return parser.parseURL(feedUrl);
}

async function pullItems(feedUrl) {
  console.time(feedUrl);
  const feed = await pull(feedUrl);
  console.timeEnd(feedUrl);
  return feed.items.map(i => {
    i.feedTitle = feed.title;
    return i;
  });
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
