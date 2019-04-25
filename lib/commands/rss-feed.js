#!/usr/bin/env node

const program = require('commander');

program.command('ls').action(() => console.log('trash'));
program.parse(process.argv);

console.log('garbo');
