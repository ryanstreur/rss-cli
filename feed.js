const Parser = require("rss-parser");
const parser = new Parser();

module.exports = {
  pull: pull,
  getMetadata: getMetadata
};

function pull(feedUrl) {
  return parser.parseURL(feedUrl);
}

function pullItems(feedUrl) {
  return pull(feedUrl).then(feed => feed.items);
}

function getMetadata(feed) {
  return {
    feedUrl: feed.feedUrl,
    image: feed.image,
    title: feed.title,
    description: feed.description,
    link: feed.link,
    language: feed.language,
    copyright: feed.copyright,
    lastBuildDate: feed.lastBuildDate
  };
}
