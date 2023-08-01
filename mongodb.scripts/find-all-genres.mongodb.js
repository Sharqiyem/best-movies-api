use('bestsimilar');

// _______________genre___________
db.getCollection('movies').distinct('genre');

// [
//   'Drama',
//   'Comedy',
//   'Thriller',
//   'Romance',
//   'Action',
//   'Crime',
//   'Horror',
//   'Adventure',
//   'Fantasy',
//   'Animation',
//   'Mystery',
//   'Sci-Fi',
//   'Family',
//   'Biography',
//   'Documentary',
//   'History',
//   'Western',
//   'Musical',
//   'Short',
//   'Sport',
// ];

// _______________YEARs_________
// db.getCollection('movies').distinct('year');
// [
//   0,
//   1946,
//   1958,
//   1960,
//   1961,
//   1962,
//   1963,
//   1964,
//   1965,
//   1966,
//   1967,
//   1968,
//   1969,
//   1970,
//   1971,
//   1972,
//   1973,
//   1974,
//   1975,
//   1976,
//   1977,
//   1978,
//   1979,
//   1980,
//   1981,
//   1982,
//   1983,
//   1984,
//   1985,
//   1986,
//   1987,
//   1988,
//   1989,
//   1990,
//   1991,
//   1992,
//   1993,
//   1994,
//   1995,
//   1996,
//   1997,
//   1998,
//   1999,
//   2000,
//   2001,
//   2002,
//   2003,
//   2004,
//   2005,
//   2006,
//   2007,
//   2008,
//   2009,
//   2010,
//   2011,
//   2012,
//   2013,
//   2014,
//   2015,
//   2016,
//   2017,
//   2018,
//   2019,
//   2020,
//   2021,
//   2022,
//   2023,
//   2024
// ]

// _______________country_________

// db.getCollection('movies').distinct('country');

// [
//   "",
//   "Afghanistan",
//   "Albania",
//   "Algeria",
//   "Andorra",
//   "Angola",
//   "Antigua and Barbuda",
//   "Argentina",
//   "Armenia",
//   "Aruba",
//   "Australia",
//   "Austria",
//   "Azerbaijan",
//   "Bahamas",
//   "Bahrain",
//   "Bangladesh",
//   "Barbados",
//   "Belarus",
//   "Belgium",
//   "Bhutan",
//   "Bolivia",
//   "Bosnia and Herzegovina",
//   "Botswana",
//   "Brazil",
//   "Bulgaria",
//   "Burkina Faso",
//   "Cambodia",
//   "Cameroon",
//   "Canada",
//   "Cayman Islands",
//   "Chad",
//   "Chile",
//   "China",
//   "Colombia",
//   "Costa Rica",
//   "Croatia",
//   "Cuba",
//   "Cyprus",
//   "Czech Republic",
//   "Czechoslovakia",
//   "Côte d'Ivoire",
//   "Denmark",
//   "Dominican Republic",
//   "East Germany",
//   "Ecuador",
//   "Egypt",
//   "El Salvador",
//   "Equatorial Guinea",
//   "Eritrea",
//   "Estonia",
//   "Ethiopia",
//   "Falkland Islands",
//   "Faroe Islands",
//   "Federal Republic of Yugoslavia",
//   "Fiji",
//   "Finland",
//   "France",
//   "French Guiana",
//   "Gabon",
//   "Georgia",
//   "Germany",
//   "Ghana",
//   "Gibraltar",
//   "Greece",
//   "Greenland",
//   "Guadeloupe",
//   "Guam",
//   "Guatemala",
//   "Guinea",
//   "Haiti",
//   "Hong Kong",
//   "Hungary",
//   "Iceland",
//   "India",
//   "Indonesia",
//   "Iran",
//   "Iraq",
//   "Ireland",
//   "Israel",
//   "Italy",
//   "Jamaica",
//   "Japan",
//   "Jordan",
//   "Kazakhstan",
//   "Kenya",
//   "Kosovo",
//   "Kuwait",
//   "Kyrgyzstan",
//   "Laos",
//   "Latvia",
//   "Lebanon",
//   "Lesotho",
//   "Liberia",
//   "Libya",
//   "Liechtenstein",
//   "Lithuania",
//   "Luxembourg",
//   "Macao",
//   "Malawi",
//   "Malaysia",
//   "Mali",
//   "Malta",
//   "Martinique",
//   "Mauritania",
//   "Mexico",
//   "Moldova",
//   "Monaco",
//   "Mongolia",
//   "Montenegro",
//   "Morocco",
//   "Mozambique",
//   "Myanmar",
//   "Namibia",
//   "Nepal",
//   "Netherlands",
//   "Netherlands Antilles",
//   "New Caledonia",
//   "New Zealand",
//   "Nicaragua",
//   "Niger",
//   "Nigeria",
//   "North Korea",
//   "Norway",
//   "Pakistan",
//   "Palestine",
//   "Panama",
//   "Papua New Guinea",
//   "Paraguay",
//   "Peru",
//   "Philippines",
//   "Poland",
//   "Portugal",
//   "Puerto Rico",
//   "Qatar",
//   "Romania",
//   "Russia",
//   "Rwanda",
//   "Samoa",
//   "San Marino",
//   "Saudi Arabia",
//   "Senegal",
//   "Serbia",
//   "Serbia and Montenegro",
//   "Singapore",
//   "Slovakia",
//   "Slovenia",
//   "Somalia",
//   "South Africa",
//   "South Korea",
//   "Soviet Union",
//   "Spain",
//   "Sri Lanka",
//   "Sweden",
//   "Switzerland",
//   "Syria",
//   "Taiwan",
//   "Tajikistan",
//   "Tanzania",
//   "Thailand",
//   "Trinidad and Tobago",
//   "Tunisia",
//   "Turkey",
//   "UK",
//   "USA",
//   "Uganda",
//   "Ukraine",
//   "United Arab Emirates",
//   "Uruguay",
//   "Uzbekistan",
//   "Vanuatu",
//   "Venezuela",
//   "Vietnam",
//   "West Germany",
//   "Yemen",
//   "Yugoslavia",
//   "Zambia",
//   "Zimbabwe"
// ]

// ________count aggregate_______
// const aggregateBy = 'time';
// db.getCollection('movies')
//   .aggregate([
//     //Unwind the deck to get every card
//     {
//       $unwind: `$${aggregateBy}`,
//     },
//     //Get count of each card
//     {
//       $group: {
//         _id: `$${aggregateBy}`,
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { count: -1 },
//     },
//     { $limit: 5 },
//   ])
//   .toArray();

// _______sort by rating______
// db.getCollection('movies').find().sort({rating: -1})

// const query = {};
// query.title = RegExp(/Avatar/i);
// query.genre = { $in: ['Adventure'] };
// query.country = { $in: ['Japan', 'USA'] };
// query.year = { $gte: 2009, $lte: 2023 };
// query.rating = { $gte: 7.2, $lte: 8.2 };

// db.getCollection('movies').find(query).sort({ title: 1 });