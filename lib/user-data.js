const fs = require('fs');
const homedir = require('os').homedir();
const _ = require('lodash');
module.exports = {
  writeOrOpenFile: writeOrOpenFile,
  saveItem: saveItem,
  markAsRead: markAsRead,
  getReadItemLinks: getReadItemLinks,
  getSavedItems
};

const savedItemsFilePath = `${homedir}/.rss-saved.json`,
  readItemsFilePath = `${homedir}/.rss-read.json`;

function saveItem(item) {
  if (fs.existsSync(savedItemsFilePath)) {
    fs.readFile(savedItemsFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      const savedItems = data ? JSON.parse(data) : {};
      if (!savedItems[item.link]) {
        item.savedOn = new Date();
        savedItems[item.link] = item;
        fs.writeFile(
          savedItemsFilePath,
          JSON.stringify(savedItems),
          throwIfError
        );
      }
    });
  } else {
    const savedItems = {};
    item.savedOn = new Date();
    savedItems[item.link] = item;
    fs.writeFile(savedItemsFilePath, JSON.stringify(savedItems), throwIfError);
  }
}

function getSavedItems(callback) {
  if (!fs.existsSync(savedItemsFilePath)) {
    return {};
  } else {
    fs.readFile(savedItemsFilePath, (err, data) => {
      if (err) throw err;
      callback(
        _.values(JSON.parse(data)).sort(
          (a, b) => new Date(a.isoDate) - new Date(b.isoDate)
        )
      );
    });
  }
}

function markAsRead(item) {
  readItemsFileExists = fs.existsSync(readItemsFilePath);
  if (readItemsFileExists) {
    fs.readFile(readItemsFilePath, (err, data) => {
      if (err) throw err;
      const readItems = JSON.parse(data);
      readItems[item.link] = new Date();
      fs.writeFile(readItemsFilePath, JSON.stringify(readItems), err => {
        if (err) throw err;
      });
    });
  } else {
    const readItems = {};
    readItems[item.link] = new Date();
    fs.writeFile(readItemsFilePath, JSON.stringify(readItems), throwIfError);
  }
}

function getReadItemLinks(callback) {
  if (!fs.existsSync(readItemsFilePath)) return callback({});
  fs.readFile(readItemsFilePath, (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data));
  });
}

function writeOrOpenFile(filePath, data, callback) {
  try {
    fs.writeFile(filePath, data, callback);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.open(filePath, 'w', (err, fd) => {
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
    if (error.code === 'ENOENT') {
      fs.open(filePath, 'w', (err, fd) => {
        if (err) throw err;
        fs.readFile(filePath, callback);
      });
    }
  }
}

function throwIfError(error) {
  if (error) throw error;
}
