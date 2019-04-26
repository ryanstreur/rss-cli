#!/usr/bin/env node
const program = require('commander');

program.command('add <feedUrl>', 'adds a feed to the list of feeds');
program.command('ls', 'list feeds');
program.command('rm', 'remove a feed');
program.parse(process.argv);
