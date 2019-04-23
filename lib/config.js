const fs = require('fs');
const homedir = require('os').homedir();

module.exports = {
  getConfig: getConfig
};

function getConfig(callback, filePath = `${homedir}/.rss-feeds.json`) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) throw err;
    callback(JSON.parse(data));
  });
}
