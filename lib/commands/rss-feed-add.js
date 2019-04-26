#!usr/bin/env node
const program = require('commander');
const feedList = require('../feed-list');

program.parse(process.argv);

feedList.addFeed(program.args[0]);
