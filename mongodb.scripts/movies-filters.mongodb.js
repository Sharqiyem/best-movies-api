use('bestsimilar');

// Search for documents in the current collection.
db.getCollection('movies').aggregate([
  {
    $filter: {
      genre: { $in: ['Drama'] },
      // year: { $gte: 2004 },
      // country: { $in: ['Indonesia'] },
      // rating: { $gt: 8 },
    },
    $project: {
      title: 1,
      // year: 1,
      // genre: 1,
      // country: 1,
      // rating: 1,
    },
  },
]);

// {country: {$in: [ 'USA']}, year: {$gte: 2004}, genre: {$all: ['Drama', 'Action', 'Thril']}, style: {$all: ['tense', 'brutal', 'harsh']}, rating: {$gt: 8}}
