import { allHomeStub } from '../test/stubs/home.stub';

export const HomeService = jest.fn().mockReturnValue({
  getHome: jest.fn().mockResolvedValue(allHomeStub()),
});
