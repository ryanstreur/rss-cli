const config = require('./config');
const feed = require('./feed-single');
const feedList = require('./feed-list');
const _ = require('lodash');
const userData = require('./user-data');

module.exports = {
  getCreatorCounts,
  getAllItems,
  getUnreadItems,
  getSavedItems
};

function getSavedItems(callback) {
  userData.getSavedItems(callback);
}

function getUnreadItems(callback) {
  getAllItems(items => {
    userData.getReadItemLinks(readItems => {
      const filteredItems = items.filter(i => !readItems[i.link]);
      callback(filteredItems);
    });
  });
}

function getAllItems(callback) {
  feedList.getFeeds(feedMap => {
    const pullPromises = Object.keys(feedMap).map(key => feed.pullItems(key));
    Promise.all(pullPromises)
      .then(itemLists => {
        const flattenedArray = itemLists
          .reduce((acc, val) => acc.concat(val), [])
          .sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
        return flattenedArray;
      })
      .then(callback)
      .catch(console.error);
  });
}

function getCreatorCounts(items) {
  return items
    .map(item => item.creator)
    .reduce((acc, val) => {
      if (acc[val]) {
        acc[val] += 1;
      } else {
        acc[val] = 1;
      }
      return acc;
    }, {});
}
