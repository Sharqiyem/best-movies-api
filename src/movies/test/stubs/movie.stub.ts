import { Movie } from '../../movies.schema';

export const movieStub = (): Movie => {
  return {
    // id: '64a0d060fb66651c10a28599',
    title: 'The Red Mosquito (2019)',
    link: 'https://bestsimilar.com/movies/40129-the-red-mosquito',
    year: 2019,
    movieId: '40129-the-red-mosquito',
    img: '/img/movie/thumb/0c/40129.jpg',
    video: null,
    rating: 9.6,
    votes: '23',
    isTVShow: false,
    genre: ['Action'],
    audience: [],
    time: [],
    story:
      'Johnny Angel is an everyday Joe kinder guy, happy go lucky, working class who stays out of trouble and away from strange characters, has few friends, but that is by his choice, and his best friend in which they know each other for a very long time ...',
    country: ['UK'],
    place: ['manila philippi'],
    plot: ['samurai sword', 'kung fu', 'martial arts', 'bicycle', 'jour'],
    style: [],
    duration: '90min',
    keyword: '',
    sim: ['64a08c498f0ea3a2123e5b3f'],
  };
};
