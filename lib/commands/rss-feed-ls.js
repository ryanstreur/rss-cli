#!/usr/bin/env node
const program = require('commander');
const _ = require('lodash');
const feedList = require('../feed-list');

program.parse(process.argv);

(async function() {
  const feedMap = await feedList.getFeedsPromise();
  for (let feedUrl in feedMap) {
    console.log(feedMap[feedUrl].title, ' | ', feedUrl);
  }
})();
