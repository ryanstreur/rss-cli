#!/usr/bin/env node
const program = require("commander");
const getCreatorCounts = require("./lib/item-list").getCreatorCounts;
const pull = require("./lib/feed-single").pull;
const getConfig = require("./lib/config").getConfig;
const commands = require("./lib/commands");

program.version("0.0.1");
program.command("add-feed <feedUrl>").action(commands.addFeedCmd);
program
  .command("pull-items [feedUrl]")
  .option("-hl, --headlines")
  .action(commands.pullItems);

program
  .command("read")
  .option("-s, --saved")
  .action(commands.read);

program.command("feeds").action(commands.feeds);
program.command("search-saved").action(commands.searchSaved);

program.command("feed", "manage rss feeds");

program.parse(process.argv);
