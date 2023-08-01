use('bestsimilar');

// db.getCollection('movies').find({
//   movieId: '73676-vote-for-juan',
// });
// db.getCollection('movies')
//   .find({ $where: 'this.genre.length>0' })
//   .count();

// db.getCollection('movies').aggregate([
//   { $unwind: '$plot' },
//   { $group: { _id: '$_id', length: { $sum: 1 } } },
//   { $sort: { length: -1 } },
//   // { $limit: 1 },
// ]);

// db.getCollection('movies').countDocuments();

db.getCollection('movies').find({
  // _id: ObjectId('64a072cb4dbfff2f81e4baa7'),
  title: /heroes/i,
});

// const datata = db
//   .getCollection('movies')
//   .find({})
//   .sort({ rating: -1, title: -1, year: -1 })
//   // .skip(40000)
//   .toArray();

// console.log(datata.length);
// console.log(datata.filter((s) => s.sim?.length === 19)?.length);
// console.log(datata.filter((s) => s.sim?.length !== 19)?.length);
