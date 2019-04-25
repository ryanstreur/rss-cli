const fs = require('fs');
const homedir = require('os').homedir();

module.exports = {
  getConfig: getConfig
};

const defaultConfig = {
  feedListPath: `${homedir}/.rss-cli/feeds.json`,
  savedItemsPath: `${homedir}/.rss-cli/saved.json`,
  readItemsPath: `${homedir}/.rss-cli/read.json`
};

function getConfig(callback) {
  const configPath = `${homedir}/.rss-cli.json`;
  const configExists = fs.existsSync(configPath);
  if (configExists) {
    fs.readFile(configPath, 'utf8', (err, data) => {
      const configData = JSON.parse(data);
      for (let key in configData) {
        configData[key] = configData[key].replace('~', homedir);
      }
      callback(configData);
    });
  } else {
    const directoryExists = fs.existsSync(`${homedir}/.rss-cli`);
    if (directoryExists) {
      callback(defaultConfig);
      return;
    }

    fs.mkdir(`${homedir}/.rss-cli`, err => {
      if (err) throw err;
      callback(defaultConfig);
    });
  }
}
