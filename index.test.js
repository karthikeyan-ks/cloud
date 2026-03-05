const request = require('supertest');
const app = require('./index'); // Import our app logic

describe('GET /', () => {
  it('should return a 200 status and the correct message', async () => {
    const res = await request(app).get('/');
    
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello, World! Your Express server is running.');
  });
});