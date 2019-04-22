const fs = require("fs");
const homedir = require("os").homedir();
module.exports = {
  writeOrOpenFile: writeOrOpenFile,
  saveItem: saveItem
};

const savedItemsFilePath = `${homedir}/.rss-saved.json`,
  readItemsFilePath = `${homedir}/.rss-read.json`;

function saveItem(item) {
  try {
    fs.readFile(savedItemsFilePath, "utf8", (err, data) => {
      if (err) throw err;
      const savedItems = data ? JSON.parse(data) : {};
      if (!savedItems[item.link]) {
        item.savedOn = new Date();
        savedItems[item.link] = item;
        fs.writeFile(savedItemsFilePath, JSON.stringify(savedItems), err => {
          throw err;
        });
      }
    });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const savedItems = {};
    item.savedOn = new Date();
    savedItems[item.link] = item;
    fs.writeFile(savedItemsFilePath, JSON.stringify(savedItems), err => {
      throw err;
    });
  }
}

function writeOrOpenFile(filePath, data, callback) {
  try {
    fs.writeFile(filePath, data, callback);
  } catch (error) {
    if (error.code === "ENOENT") {
      fs.open(filePath, "w", (err, fd) => {
        if (err) throw err;
        fs.writeFile(filePath, data, callback);
      });
    } else {
      throw error;
    }
  }
}

function readOrOpenFile(filePath, callback) {
  try {
    fs.readFile(filePath, callback);
  } catch (error) {
    if (error.code === "ENOENT") {
      fs.open(filePath, "w", (err, fd) => {
        if (err) throw err;
        fs.readFile(filePath, callback);
      });
    }
  }
}
