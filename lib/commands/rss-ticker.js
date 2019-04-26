#!usr/bin/env node
const program = require('commander');
const rxjs = require('rxjs');
const operators = require('rxjs/operators');
const moment = require('moment');
const _ = require('lodash');
const feed = require('../feed-single');
const feedList = require('../feed-list');

program.option('-f, --feed <feedUrl>');
program.parse(process.argv);

if (program.feed) {
  getTickerForFeed(program.feed).subscribe(items =>
    items.forEach(item => console.log(item))
  );
} else {
  feedList.getFeeds(feedMap => {
    const feedUrls = _.keys(feedMap);
    const observables$ = feedUrls.map(getTickerForFeed);

    rxjs.combineLatest(observables$).subscribe(itemArrays => {
      const items = _.uniq(_.flatten(itemArrays));
      items.forEach(i =>
        console.log(moment(i.isoDate).format(), ' | ', i.title)
      );
    });
  });
}

function getTickerForFeed(feedUrl) {
  let latestTime = new Date().getTime();

  return rxjs.interval(5000).pipe(
    operators.flatMap(() =>
      rxjs.from(
        feed.pull(feedUrl).catch(err => {
          console.error(err);
          return { items: [] };
        })
      )
    ),
    operators.map(getLatestItems)
  );

  function getLatestItems(feed) {
    return feed.items.filter(afterLatestBeforeNow);
  }

  function afterLatestBeforeNow(item) {
    const currentTime = new Date().getTime();
    const itemTime = new Date(item.isoDate).getTime();
    const timeBetween = latestTime < itemTime && itemTime < currentTime;
    if (timeBetween) {
      latestTime = new Date().getTime();
      console.log('got one');
    }
    return timeBetween;
  }
}
