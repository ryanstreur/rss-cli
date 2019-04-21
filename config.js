const fs = require("fs");

module.exports = {
  getConfig: getConfig
};

function getConfig(callback, filePath = "example-config.json") {
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) throw err;
    callback(JSON.parse(data));
  });
}
