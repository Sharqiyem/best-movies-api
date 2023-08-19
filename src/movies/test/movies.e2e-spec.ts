import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../database/database.service';
import { movieStub } from './stubs/movie.stub';

describe('Movies (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('movies').deleteMany({});
  });

  it('/movies/{id} (GET)', async () => {
    await dbConnection.collection('movies').insertOne(movieStub());
    const response = await request(httpServer).get(
      `/movies/${movieStub().movieId}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(movieStub());
  });

  it('/movies/genre/:genre/:page (GET)', async () => {
    const testObj = movieStub();
    const insertedObj = await dbConnection
      .collection('movies')
      .insertOne(testObj);
    const response = await request(httpServer).get(
      `/movies/genre/${testObj.genre[0]}/1`,
    );

    const resObj = {
      _id: insertedObj.insertedId.toString(),
      title: testObj.title,
      link: testObj.link,
      img: testObj.img,
      rating: testObj.rating,
      votes: testObj.votes,
      isTVShow: testObj.isTVShow,
      genre: testObj.genre,
      country: testObj.country,
    };

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject([resObj]);
  });

  it('/movies/search/:page (GET)', async () => {
    const testObj = movieStub();
    const insertedObj = await dbConnection
      .collection('movies')
      .insertOne(testObj);
    const response = await request(httpServer)
      .post(`/movies/search/1`)
      .send({
        genres: ['Action'],
      });

    const resObj = {
      _id: insertedObj.insertedId.toString(),
      title: testObj.title,
      link: testObj.link,
      img: testObj.img,
      rating: testObj.rating,
      votes: testObj.votes,
      isTVShow: testObj.isTVShow,
      genre: testObj.genre,
      country: testObj.country,
    };

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject([resObj]);
  });
});
