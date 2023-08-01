/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('bestsimilar');

// Search for documents in the current collection.

// db.getCollection('tags').find({ img: { $regex: 'noimg256h' } });
//.toArray();

console.log(
  db
    .getCollection('tags')
    .find({ img: { $regex: 'noimg256h' } })
    .count(),
);
// const ss = {
//   x: db.getCollection('tags').find({}).count(),
//   y: db
//     .getCollection('tags')
//     .find({ img: { $regex: 'noimg256h' } })
//     .count(),
// };

// console.log(items);

// const dubTags = db.getCollection('tags').find({ img: { $regex: 'noimg256h' } });
// var noImgItems = dubTags.count();

// console.log(noImgItems);
