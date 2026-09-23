// ============================================================
// UNIT TESTS — children.controller.ts (error branches)
// ============================================================

jest.mock('../services/children.service');

import type { Request, Response, NextFunction } from 'express';
import * as childrenService from '../services/children.service';
import { getAllHandler, createHandler } from '../controllers/children.controller';

const mockGetAll = childrenService.getAll as jest.MockedFunction<typeof childrenService.getAll>;
const mockCreate = childrenService.create as jest.MockedFunction<typeof childrenService.create>;

function mockRes(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res as Response;
}

describe('ChildrenController — Unit Tests (error branches)', () => {
  it('getAllHandler should call next(err) when the service throws', async () => {
    mockGetAll.mockRejectedValue(new Error('DB down'));
    const req: any = {};
    const res = mockRes();
    const next = jest.fn() as unknown as NextFunction;

    await getAllHandler(req as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });

  it('createHandler should call next(err) when the service throws a non-Zod error', async () => {
    mockCreate.mockRejectedValue(new Error('duplicate key'));
    const req: any = {
      body: {
        name: 'Sofía Ramírez',
        enrollmentCode: 'JI-0001',
        group: 'Pre-jardín',
        monthlyFee: 350000,
        birthDate: '2021-03-14',
      },
    };
    const res = mockRes();
    res.locals = { user: { sub: 'user-id-owner' } };
    const next = jest.fn() as unknown as NextFunction;

    await createHandler(req as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalledWith(201);
  });
});

export {};
