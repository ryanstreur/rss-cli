const open = require('open');
const inquirer = require('inquirer');
const itemList = require('../item-list');
const userData = require('../user-data');
const moment = require('moment');

module.exports = { read };

function read(cmd) {
  if (cmd.saved) {
    itemList.getSavedItems(processEachItem);
    return;
  }
  itemList.getUnreadItems(processEachItem);
}

function processEachItem(items) {
  if (!items.length) return console.log('end of feed');
  const currentItem = items.pop();
  inquirer.prompt(getPrompt(currentItem)).then(answer => {
    switch (answer.readOutput) {
      case 'open':
        items.push(currentItem);
        open(currentItem.link);
        break;
      case 'details':
        items.push(currentItem);
        console.log(currentItem.content);
        break;
      case 'quit':
        console.clear();
        process.exit();
        break;
      case 'save':
        userData.saveItem(currentItem);
        userData.markAsRead(currentItem);
        break;
      case 'markAsRead':
        userData.markAsRead(currentItem);
        break;
    }
    processEachItem(items);
  });

  function getPrompt(item) {
    return {
      type: 'expand',
      name: 'readOutput',
      message: [
        moment(item.isoDate).fromNow(),
        item.feedTitle,
        item.title
      ].join(' | '),
      choices: [
        {
          key: 'r',
          name: 'mark as read',
          value: 'markAsRead'
        },
        {
          key: 's',
          name: 'save item',
          value: 'save'
        },
        {
          key: 'o',
          name: 'open item',
          value: 'open'
        },
        {
          key: 't',
          name: 'tag',
          value: 'tag'
        },
        {
          key: 'd',
          name: 'details',
          value: 'details'
        },
        {
          key: 'q',
          name: 'quit',
          value: 'quit'
        }
      ],
      default: 0
    };
  }
}
