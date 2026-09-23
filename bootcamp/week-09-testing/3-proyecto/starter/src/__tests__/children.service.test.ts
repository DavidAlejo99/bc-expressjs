// ============================================================
// UNIT TESTS — children.service.ts
// ============================================================
// Mockear children.repository — testear la lógica de negocio pura
// ============================================================

jest.mock('../repositories/children.repository');

import * as childrenRepo from '../repositories/children.repository';
import * as childrenService from '../services/children.service';

const mockFindAll  = childrenRepo.findAllChildren as jest.MockedFunction<typeof childrenRepo.findAllChildren>;
const mockFindById = childrenRepo.findChildById   as jest.MockedFunction<typeof childrenRepo.findChildById>;
const mockCreate   = childrenRepo.createChild     as jest.MockedFunction<typeof childrenRepo.createChild>;
const mockUpdate   = childrenRepo.updateChild     as jest.MockedFunction<typeof childrenRepo.updateChild>;
const mockDelete   = childrenRepo.deleteChild     as jest.MockedFunction<typeof childrenRepo.deleteChild>;

const childBase = {
  _id: 'child-id-123',
  name: 'Sofía Ramírez',
  enrollmentCode: 'JI-0001',
  group: 'Pre-jardín' as const,
  monthlyFee: 350000,
  active: true,
  birthDate: new Date('2021-03-14'),
  createdBy: 'user-id-owner',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ChildrenService — Unit Tests', () => {
  describe('getAll()', () => {
    it('should return all children', async () => {
      mockFindAll.mockResolvedValue([childBase as any]);
      const result = await childrenService.getAll();
      expect(result).toHaveLength(1);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no children exist', async () => {
      mockFindAll.mockResolvedValue([]);
      const result = await childrenService.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('getById()', () => {
    it('should return the child when found', async () => {
      mockFindById.mockResolvedValue(childBase as any);
      const result = await childrenService.getById('child-id-123');
      expect(result.name).toBe('Sofía Ramírez');
    });

    it('should throw AppError 404 when child does not exist', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(childrenService.getById('missing-id')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('create()', () => {
    it('should create and return the new child', async () => {
      mockCreate.mockResolvedValue(childBase as any);
      const dto = {
        name: 'Sofía Ramírez',
        enrollmentCode: 'JI-0001',
        group: 'Pre-jardín' as const,
        monthlyFee: 350000,
        birthDate: new Date('2021-03-14'),
      };
      const result = await childrenService.create(dto, 'user-id-owner');
      expect(result.enrollmentCode).toBe('JI-0001');
      expect(mockCreate).toHaveBeenCalledWith(dto, 'user-id-owner');
    });
  });

  describe('update()', () => {
    it('should update and return the child when requester is the owner', async () => {
      mockFindById.mockResolvedValue(childBase as any);
      mockUpdate.mockResolvedValue({ ...childBase, monthlyFee: 400000 } as any);

      const result = await childrenService.update(
        'child-id-123',
        { monthlyFee: 400000 },
        'user-id-owner',
        'user',
      );

      expect(result.monthlyFee).toBe(400000);
    });

    it('should update when requester is admin (not the owner)', async () => {
      mockFindById.mockResolvedValue(childBase as any);
      mockUpdate.mockResolvedValue({ ...childBase, monthlyFee: 500000 } as any);

      const result = await childrenService.update(
        'child-id-123',
        { monthlyFee: 500000 },
        'some-other-admin-id',
        'admin',
      );

      expect(result.monthlyFee).toBe(500000);
    });

    it('should throw AppError 403 when requester is not the owner nor admin', async () => {
      mockFindById.mockResolvedValue(childBase as any);

      await expect(
        childrenService.update('child-id-123', { monthlyFee: 1 }, 'someone-else', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when child does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        childrenService.update('missing-id', { monthlyFee: 1 }, 'user-id-owner', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('update() — edge cases', () => {
    it('should throw AppError 404 when the update unexpectedly returns null', async () => {
      mockFindById.mockResolvedValue(childBase as any);
      mockUpdate.mockResolvedValue(null);

      await expect(
        childrenService.update('child-id-123', { monthlyFee: 1 }, 'user-id-owner', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('remove()', () => {
    it('should delete the child when requester is admin', async () => {
      mockFindById.mockResolvedValue(childBase as any);
      mockDelete.mockResolvedValue(childBase as any);

      await expect(
        childrenService.remove('child-id-123', 'some-admin-id', 'admin'),
      ).resolves.toBeUndefined();

      expect(mockDelete).toHaveBeenCalledWith('child-id-123');
    });

    it('should throw AppError 403 when requester is not owner or admin', async () => {
      mockFindById.mockResolvedValue(childBase as any);

      await expect(
        childrenService.remove('child-id-123', 'someone-else', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when child does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        childrenService.remove('missing-id', 'user-id-owner', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};
