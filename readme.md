# gta-news

A very simplistic way of fetching all the news splash screens for GTA Online on all currently supported platforms.

## usage

There is a daily workflow running to make sure every new event gets saved with all of its content (image, description in all languages, metadata.) The images are in `.dds` format as supplied by Rockstar, the data and metadata are in `.json`. This is the most up to date and accessible collection of these events to my knowledge. 

Alternatively you can run this on your own machine. Just clone the repo and `node index.js` should get you going.

## todo

Some missing functionality I'd like to add would be saving the `news.json` and the `event-schedule.json` files to archive these as well.

## license

None.