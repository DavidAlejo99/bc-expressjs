// ============================================================
// INTEGRATION TESTS — children routes
// ============================================================
// Ciclo completo con Supertest + MongoDB Memory Server, sin mocks
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;
let ownerToken: string;
let otherToken: string;
let adminToken: string;

async function registerAndLogin(email: string, role: 'user' | 'admin' = 'user'): Promise<string> {
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Test User', email, password: 'Password1!' });

  if (role === 'admin') {
    await mongoose.connection.collection('users').updateOne({ email }, { $set: { role: 'admin' } });
  }

  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'Password1!' });

  return login.body.accessToken as string;
}

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

const validChild = {
  name: 'Sofía Ramírez',
  enrollmentCode: 'JI-0001',
  group: 'Pre-jardín',
  monthlyFee: 350000,
  birthDate: '2021-03-14',
};

describe('Children Routes — Integration Tests', () => {
  beforeEach(async () => {
    ownerToken = await registerAndLogin('owner@test.com');
    otherToken = await registerAndLogin('other@test.com');
    adminToken = await registerAndLogin('admin@test.com', 'admin');
  });

  describe('GET /api/v1/children', () => {
    it('should return 200 and empty array initially', async () => {
      const res = await request(app).get('/api/v1/children');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('POST /api/v1/children', () => {
    it('should return 201 with valid data and token', async () => {
      const res = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      expect(res.status).toBe(201);
      expect(res.body.data.enrollmentCode).toBe('JI-0001');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/v1/children').send(validChild);
      expect(res.status).toBe(401);
    });

    it('should return 422 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'A' });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/v1/children/:id', () => {
    it('should return 200 with existing child', async () => {
      const created = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      const res = await request(app).get(`/api/v1/children/${created.body.data._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Sofía Ramírez');
    });

    it('should return 404 with non-existent ID', async () => {
      const res = await request(app).get('/api/v1/children/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/children/:id', () => {
    it('should return 200 when owner updates', async () => {
      const created = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      const res = await request(app)
        .put(`/api/v1/children/${created.body.data._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ monthlyFee: 400000 });

      expect(res.status).toBe(200);
      expect(res.body.data.monthlyFee).toBe(400000);
    });

    it('should return 403 when non-owner tries to update', async () => {
      const created = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      const res = await request(app)
        .put(`/api/v1/children/${created.body.data._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ monthlyFee: 999999 });

      expect(res.status).toBe(403);
    });

    it('should return 200 when admin updates a child they did not create', async () => {
      const created = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      const res = await request(app)
        .put(`/api/v1/children/${created.body.data._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ monthlyFee: 111111 });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/children/:id', () => {
    it('should return 204 when owner deletes', async () => {
      const created = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      const res = await request(app)
        .delete(`/api/v1/children/${created.body.data._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 when non-owner tries to delete', async () => {
      const created = await request(app)
        .post('/api/v1/children')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(validChild);

      const res = await request(app)
        .delete(`/api/v1/children/${created.body.data._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });
  });
});

export {};
