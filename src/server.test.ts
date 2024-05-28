import request from 'supertest';
import app from './index';

describe('GET /', () => {
  it('responds with "It is about to get down!"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('It is about to get down!');
  });
});