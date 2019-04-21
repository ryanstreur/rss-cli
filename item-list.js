const config = require('./config');
const feed = require('./feed');
const _ = require('lodash');

module.exports = {
  getCreatorCounts: getCreatorCounts,
  getAllItems: getAllItems
};

function getAllItems(callback) {
  config.getConfig(feedMap => {
    const pullPromises = Object.keys(feedMap).map(key => feed.pullItems(key));
    Promise
      .all(pullPromises)
      .then(itemLists => {
        const flattenedArray = itemLists.reduce((acc, val) => acc.concat(val), []);
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
