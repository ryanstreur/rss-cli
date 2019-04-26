#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const open = require('open');
const userData = require('../user-data');
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

program.parse(process.argv);

searchSaved(program);

async function searchSaved(cmd) {
  const savedItems = await userData.getSavedItemsPromise();
  const savedItemTitles = savedItems.map(si => [si.title].join(' | '));

  function searchSavedItems(answers, input = '') {
    return new Promise(function(resolve) {
      var fuzzyResult = fuzzy.filter(input, savedItemTitles);
      resolve(fuzzyResult.map(el => el.original));
    });
  }

  const answer = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'title',
      message: 'Open saved article',
      source: searchSavedItems,
      pageSize: 4
    }
  ]);

  const title = answer.title;
  const item = savedItems.find(i => i.title === title);
  open(item.link);
}
