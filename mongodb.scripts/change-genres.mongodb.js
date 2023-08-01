// db.getCollection('movies').distinct('genre');
use('bestsimilar');

const re = [];
db.getCollection('movies').find().projection({ genre: 1 }).limit(20);
//   .forEach((el) => {
//     // console.log(JSON.stringify(el));
//     re.push(el);
//   });

// re.forEach((el) => {
//   console.log('first');
//   console.log('first', el.link);
// });

// const res = db
//   .getCollection('movies')
//   .updateOne(
//     { _id: ObjectId('64a06c84617ab8b92b716c51') },
//     { $set: { genre: ['Action', 'Adventure', 'Thril', '2'] } },
//   );

// console.log('first', JSON.stringify(res, null, 2));

const genres = [
  'Act',
  'Action',
  'Advent',
  'Adventure',
  'Animat',
  'Animation',
  'Biogra',
  'Biography',
  'Com',
  'Comedy',
  'Cr',
  'Crime',
  'Document',
  'Documentary',
  'Dr',
  'Drama',
  'Fam',
  'Family',
  'Fant',
  'Fantasy',
  'Hist',
  'History',
  'Hor',
  'Horror',
  'Mu',
  'Musi',
  'Music',
  'Musical',
  'Myst',
  'Mystery',
  'Roma',
  'Romance',
  'Sci',
  'Sci-Fi',
  'Sh',
  'Short',
  'Sp',
  'Sport',
  'Thril',
  'Thriller',
  'War',
  'West',
  'Western',
];
