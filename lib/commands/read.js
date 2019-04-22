const open = require("open");
const inquirer = require("inquirer");
const itemList = require("../item-list");
const userData = require("../user-data");

module.exports = { read, readSaved };

function read(cmd) {
  if (cmd.saved) {
    itemList.getSavedItems(processEachItem);
    return;
  }
  itemList.getUnreadItems(processEachItem);
}

function readSaved(cmd) {}

function processEachItem(items) {
  const currentItem = items.pop();
  inquirer.prompt(getPrompt(currentItem)).then(answer => {
    switch (answer.readOutput) {
      case "open":
        items.push(currentItem);
        open(currentItem.link);
        break;
      case "details":
        items.push(currentItem);
        console.log(currentItem);
        break;
      case "quit":
        process.exit();
        break;
      case "save":
        userData.saveItem(currentItem);
        break;
      case "markAsRead":
        userData.markAsRead(currentItem);
        break;
    }
    processEachItem(items);
  });

  function getPrompt(item) {
    return {
      type: "expand",
      name: "readOutput",
      message: item.isoDate + " " + item.title,
      choices: [
        {
          key: "r",
          name: "mark as read",
          value: "markAsRead"
        },
        {
          key: "s",
          name: "save item",
          value: "save"
        },
        {
          key: "o",
          name: "open item",
          value: "open"
        },
        {
          key: "t",
          name: "tag",
          value: "tag"
        },
        {
          key: "d",
          name: "details",
          value: "details"
        },
        {
          key: "q",
          name: "quit",
          value: "quit"
        }
      ],
      default: 0
    };
  }
}
