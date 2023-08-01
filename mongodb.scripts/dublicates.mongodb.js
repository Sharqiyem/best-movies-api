/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('bestsimilar');

// Search for documents in the current collection.
// db.getCollection('movies').ensureIndex();

// db.getCollection('movies').aggregate([
//   {
//     $group: {
//       _id: { title: '$title' },
//       count: { $sum: 1 },
//     },
//   },
//   { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
//   { $project: { name: '$_id', _id: 0, count: 1 } },
// ]);

// db.getCollection('movies').find({
//   movieId: '33563-the-hypothesis-of-the-stolen-painting',
// });

// db.getCollection('movies').countDocuments();
// 13445 +2391*2+759*3+274*4+118*5+48*6+33*7+19*8+9*9+2*10+1*12+0+1*14
// 22988 -> 22973
//104616
////81628

/** Create a array to store all duplicate records ids*/
var duplicates = [];

/** Start Aggregation pipeline*/
db.getCollection('movies')
  .aggregate(
    [
      {
        $group: {
          _id: { title: '$title' },

          dups: {
            $push: {
              _id: '$_id',
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $match: { _id: { $ne: null }, count: { $gt: 1 } },
      },
    ],
    {
      allowDiskUse: true,
    },
  )
  .forEach(function (doc) {
    doc.dups.shift();

    doc.dups.forEach(function (dupId) {
      duplicates.push(dupId._id);
    });
  });

console.log('duplicates', duplicates.length);

/** Delete the duplicates*/
var i,
  j,
  temparray,
  chunk = 100000;
for (i = 0, j = duplicates.length; i < j; i += chunk) {
  temparray = duplicates.slice(i, i + chunk);
  db.getCollection('movies').bulkWrite([
    { deleteMany: { filter: { _id: { $in: temparray } } } },
  ]);
}
