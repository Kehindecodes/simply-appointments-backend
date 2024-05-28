import request from 'supertest';
import app from './index';
import { close,init } from "./migration/data-source";

describe('GET /', () => {
  beforeAll(async () => {
    await init();
    console.log("Database has been initialized!")
  })
  // afterAll(async () => {
  //   await close();
  //   console.log("Database has been closed!")
  // })
  it('responds with "It is about to get down!"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('It is about to get down!');
  });
});