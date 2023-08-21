import { Test } from '@nestjs/testing';

import { allHomeStub } from './stubs/home.stub';
import { HomesController } from '../home.controller';
import { HomeService } from '../home.service';

jest.mock('../home.service');

describe('HomeController', () => {
  let homesController: HomesController;
  let homeService: HomeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [HomesController],
      providers: [HomeService],
    }).compile();

    homesController = moduleRef.get<HomesController>(HomesController);
    homeService = moduleRef.get<HomeService>(HomeService);
    jest.clearAllMocks();
  });

  describe('getAllHomes', () => {
    describe('when getAllHomes is called', () => {
      let allHomes: any;

      beforeEach(async () => {
        allHomes = await homesController.getAllHomes();
      });

      test('then it should call homeService', () => {
        expect(homeService.getHome).toBeCalled();
      });

      test('then is should return a all home result', () => {
        expect(allHomes).toEqual(allHomeStub());
      });
    });
  });
});
