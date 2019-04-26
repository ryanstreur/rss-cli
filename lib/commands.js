const feedList = require('./feed-list');
const itemList = require('./item-list');
const userData = require('./user-data');
const open = require('open');
const inquirer = require('inquirer');
var fuzzy = require('fuzzy');
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);
const _ = require('lodash');

module.exports = {
  addFeedCmd: addFeedCmd,
  pullItems: pullItems,
  read: read.read,
  searchSaved
};

function addFeedCmd(feedUrl, cmd) {
  feedList.addFeed(feedUrl);
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

async function searchSaved(cmd) {
  const savedItems = await userData.getSavedItemsPromise();
  const savedItemTitles = savedItems.map(si => si.title);
  function searchSavedItems(answers, input) {
    input = input || '';
    return new Promise(function(resolve) {
      var fuzzyResult = fuzzy.filter(input, savedItemTitles);
      resolve(
        fuzzyResult.map(function(el) {
          return el.original;
        })
      );
    });
  }

  const answer = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'title',
      message: 'Open saved article',
      source: searchSavedItems,
      pageSize: 4
    }
  ]);

  const title = answer.title;
  const item = savedItems.find(i => i.title === title);
  open(item.link);
}
