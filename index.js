#!/usr/bin/env node
const program = require("commander");
const getCreatorCounts = require("./item-list").getCreatorCounts;
const pull = require("./feed").pull;
const getConfig = require("./config").getConfig;
const commands = require("./commands");

program
  .version("0.0.1")
  .option("--add-feed", "Add a new feed")
  .option("-u --url [url]");

program.command("add-feed <feedUrl>").action(commands.addFeedCmd);

program.parse(process.argv);

// getConfig(c => {
//   const url = c[0].feedUrl;

//   pull(url).then(feed => {
//     feed.items = null;
//     console.log(feed);
//     console.log(feed.title);
//     const creatorCounts = getCreatorCounts(feed.items);
//     for (let c in creatorCounts) {
//       console.log(c, creatorCounts[c]);
//     }
//   });
// });
