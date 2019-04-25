const fs = require('fs');
const homedir = require('os').homedir();
const config = require('./config');
const _ = require('lodash');
module.exports = {
  writeOrOpenFile: writeOrOpenFile,
  saveItem: saveItem,
  markAsRead: markAsRead,
  getReadItemLinks: getReadItemLinks,
  getSavedItems,
  getSavedItemsPromise
};

function saveItem(item) {
  config.getConfig(conf => {
    if (fs.existsSync(conf.savedItemsPath)) {
      fs.readFile(conf.savedItemsPath, 'utf8', (err, data) => {
        if (err) throw err;
        const savedItems = data ? JSON.parse(data) : {};
        if (!savedItems[item.link]) {
          item.savedOn = new Date();
          savedItems[item.link] = item;
          fs.writeFile(
            conf.savedItemsPath,
            JSON.stringify(savedItems),
            throwIfError
          );
        }
      });
    } else {
      const savedItems = {};
      item.savedOn = new Date();
      savedItems[item.link] = item;
      fs.writeFile(
        conf.savedItemsPath,
        JSON.stringify(savedItems),
        throwIfError
      );
    }
  });
}

function getSavedItemsPromise() {
  return new Promise(resolve => getSavedItems(resolve));
}

function getSavedItems(callback) {
  config.getConfig(conf => {
    if (!fs.existsSync(conf.savedItemsPath)) {
      return {};
    } else {
      fs.readFile(conf.savedItemsPath, (err, data) => {
        if (err) throw err;
        callback(
          _.values(JSON.parse(data)).sort(
            (a, b) => new Date(a.isoDate) - new Date(b.isoDate)
          )
        );
      });
    }
  });
}

function markAsRead(item) {
  config.getConfig(conf => {
    readItemsFileExists = fs.existsSync(conf.readItemsPath);
    if (readItemsFileExists) {
      fs.readFile(conf.readItemsPath, (err, data) => {
        if (err) throw err;
        const readItems = JSON.parse(data);
        readItems[item.link] = new Date();
        fs.writeFile(conf.readItemsPath, JSON.stringify(readItems), err => {
          if (err) throw err;
        });
      });
    } else {
      const readItems = {};
      readItems[item.link] = new Date();
      fs.writeFile(conf.readItemsPath, JSON.stringify(readItems), throwIfError);
    }
  });
}

function getReadItemLinks(callback) {
  config.getConfig(conf => {
    if (!fs.existsSync(conf.readItemsPath)) return callback({});
    fs.readFile(conf.readItemsPath, (err, data) => {
      if (err) throw err;
      callback(JSON.parse(data));
    });
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
