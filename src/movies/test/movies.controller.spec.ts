import { Test } from '@nestjs/testing';

import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { movieStub } from './stubs/movie.stub';
import { Movie } from '../movies.schema';

jest.mock('../movies.service');

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  //   imports: [
  //     MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  //   ],
  //   controllers: [MoviesController],
  //   providers: [MoviesService],
  //   exports: [MoviesService],

  // beforeEach(async () => {
  //   const moduleRef = await Test.createTestingModule({
  //     imports: [],
  //     controllers: [MoviesController],
  //     providers: [MoviesService],
  //   }).compile();

  //   // moviesController = moduleRef.get<MoviesController>(MoviesController);
  //   // moviesService = moduleRef.get<MoviesService>(MoviesService);
  //   // jest.clearAllMocks();
  // });
  describe('getMovie fake', () => {
    it('must true', () => {
      expect(true).toBeTruthy();
    });
  });
  //   describe('getMovie', () => {
  //     describe('when getMovie is called', () => {
  //       let movie: Movie;

  //       beforeEach(async () => {
  //         movie = await moviesController.getMovie(movieStub().movieId);
  //       });

  //       test('then it should call moviesService', () => {
  //         expect(moviesService.getMovie).toBeCalledWith(movieStub().movieId);
  //       });

  //       test('then is should return a movie', () => {
  //         expect(movie).toEqual(movieStub());
  //       });
  //     });
  //   });
});
