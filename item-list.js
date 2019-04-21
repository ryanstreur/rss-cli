module.exports = {
  getCreatorCounts: getCreatorCounts
};

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
