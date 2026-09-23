// ============================================================
// INTEGRATION TESTS — children.repository.ts (filter branch)
// ============================================================

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ChildModel } from '../models/child.model';
import * as childrenRepo from '../repositories/children.repository';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  await ChildModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('ChildrenRepository — findAllChildren() filter branch', () => {
  it('should return only the children created by the given user when createdBy is provided', async () => {
    await ChildModel.create({
      name: 'Sofía Ramírez',
      enrollmentCode: 'JI-0001',
      group: 'Pre-jardín',
      monthlyFee: 350000,
      birthDate: new Date('2021-03-14'),
      createdBy: 'user-a',
    });
    await ChildModel.create({
      name: 'Mateo Gómez',
      enrollmentCode: 'JI-0002',
      group: 'Maternal',
      monthlyFee: 300000,
      birthDate: new Date('2022-01-10'),
      createdBy: 'user-b',
    });

    const resultA = await childrenRepo.findAllChildren('user-a');
    expect(resultA).toHaveLength(1);
    expect(resultA[0].createdBy).toBe('user-a');

    const resultAll = await childrenRepo.findAllChildren();
    expect(resultAll).toHaveLength(2);
  });
});

export {};
