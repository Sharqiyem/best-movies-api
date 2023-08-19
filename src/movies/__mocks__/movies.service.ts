import { movieStub } from '../test/stubs/movie.stub';

export const UsersService = jest.fn().mockReturnValue({
  getMovie: jest.fn().mockResolvedValue(movieStub()),
  getSimilarMovies: jest.fn().mockResolvedValue([movieStub()]),
});
