#!usr/bin/env node
const program = require('commander');
const feedList = require('../feed-list');

program.parse(process.argv);

feedList.removeFeed(program.args[0]);
