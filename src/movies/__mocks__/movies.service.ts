import { movieStub } from '../test/stubs/movie.stub';

export const MoviesService = jest.fn().mockReturnValue({
  getMovie: jest.fn().mockResolvedValue(movieStub()),
});
