export enum MOVIE_TYPE {
  ALL = 'all',
  MOVIES = 'movies',
  TV_SHOWS = 'tv-shows',
}
export class FilterDto {
  title: string;
  countries: string[];
  genres: string[];
  rating: [from: number, to: number];
  years: [from: number, to: number];
  isTVShow: boolean;
  type: MOVIE_TYPE;
}
