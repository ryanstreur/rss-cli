#!/usr/bin/env node
const program = require('commander');

program
  .version('0.0.1')
  .command('feed', 'manage rss feeds')
  .command('read', 'read through items from feeds')
  .command('saved', 'find saved items')
  .parse(process.argv);
