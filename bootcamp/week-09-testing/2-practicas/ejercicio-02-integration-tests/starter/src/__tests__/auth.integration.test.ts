// ============================================================
// INTEGRATION TESTS — auth routes
// ============================================================
// Objetivo: testear el ciclo completo HTTP → controller → service → DB
// SIN mocks de la capa de servicio. La DB es MongoDB en memoria.
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
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
    it('should return 201 and user data on valid registration', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Alice',
          email: 'alice@test.com',
          password: 'Password1!',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        email: 'alice@test.com',
        name: 'Alice',
        role: 'user',
      });
      expect(res.body.data.password).toBeUndefined();
    });

    it('should return 422 on invalid input', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'A', email: 'not-an-email', password: '123' });

      expect(res.status).toBe(422);
    });

    it('should return 409 when email is already registered', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Alice', email: 'alice@test.com', password: 'Password1!' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Alice Duplicada', email: 'alice@test.com', password: 'Password1!' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('Email already registered');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Alice', email: 'alice@test.com', password: 'Password1!' });
    });

    it('should return 200 and accessToken on valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@test.com', password: 'Password1!' });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(typeof res.body.accessToken).toBe('string');
    });

    it('should return 401 on wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@test.com', password: 'WrongPassword1!' });

      expect(res.status).toBe(401);
    });

    it('should use token to access GET /auth/me', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@test.com', password: 'Password1!' });

      const token = loginRes.body.accessToken as string;

      const meRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.data.email).toBe('alice@test.com');
    });

    it('should return 401 on GET /auth/me without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});

export {};
