// ============================================================
// INTEGRATION TESTS — auth routes
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Auth Routes — Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 422 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'A', email: 'not-an-email', password: '123' });

      expect(res.status).toBe(422);
    });

    it('should return 409 when the email is already registered', async () => {
      const payload = { name: 'Test User', email: 'dup@test.com', password: 'Password1!' };
      await request(app).post('/api/v1/auth/register').send(payload);

      const res = await request(app).post('/api/v1/auth/register').send(payload);
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 422 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(422);
    });

    it('should return 401 when the email does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'Password1!' });

      expect(res.status).toBe(401);
    });

    it('should return 401 with a wrong password', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', email: 'wrongpass@test.com', password: 'Password1!' });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'wrongpass@test.com', password: 'WrongPass1!' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 200 with the authenticated user when the token is valid', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', email: 'me@test.com', password: 'Password1!' });

      const login = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'me@test.com', password: 'Password1!' });

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${login.body.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('me@test.com');
      expect(res.body.data.password).toBeUndefined();
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return 404 when the token belongs to a deleted user', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Ghost User', email: 'ghost@test.com', password: 'Password1!' });

      const login = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'ghost@test.com', password: 'Password1!' });

      await mongoose.connection.collection('users').deleteOne({ email: 'ghost@test.com' });

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${login.body.accessToken}`);

      expect(res.status).toBe(404);
    });
  });
});

export {};
