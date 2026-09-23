// ============================================================
// UNIT TESTS — auth.middleware.ts
// ============================================================

jest.mock('../utils/jwt');

import type { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import * as jwtUtil from '../utils/jwt';

const mockVerify = jwtUtil.verifyAccessToken as jest.MockedFunction<typeof jwtUtil.verifyAccessToken>;

function mockRes(): Response {
  const res: any = {};
  res.locals = {};
  return res as Response;
}

describe('AuthMiddleware — Unit Tests', () => {
  describe('authenticate()', () => {
    it('should call next with 401 AppError when there is no Authorization header', () => {
      const req: any = { headers: {} };
      const res = mockRes();
      const next = jest.fn() as unknown as NextFunction;

      authenticate(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('should call next with 401 AppError when the header does not start with Bearer', () => {
      const req: any = { headers: { authorization: 'Token abc' } };
      const res = mockRes();
      const next = jest.fn() as unknown as NextFunction;

      authenticate(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('should call next with 401 AppError when the token is invalid or expired', () => {
      mockVerify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });
      const req: any = { headers: { authorization: 'Bearer bad.token.here' } };
      const res = mockRes();
      const next = jest.fn() as unknown as NextFunction;

      authenticate(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401, message: 'Invalid or expired token' }),
      );
    });

    it('should set res.locals.user and call next() when the token is valid', () => {
      mockVerify.mockReturnValue({ sub: 'user-id-1', role: 'user' } as any);
      const req: any = { headers: { authorization: 'Bearer good.token.here' } };
      const res = mockRes();
      const next = jest.fn() as unknown as NextFunction;

      authenticate(req as Request, res, next);

      expect(res.locals['user']).toEqual({ sub: 'user-id-1', role: 'user' });
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('authorize()', () => {
    it('should call next with 403 AppError when there is no user in res.locals', () => {
      const req: any = {};
      const res = mockRes();
      const next = jest.fn() as unknown as NextFunction;

      authorize('admin')(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('should call next with 403 AppError when the role is not allowed', () => {
      const req: any = {};
      const res = mockRes();
      res.locals = { user: { role: 'user' } };
      const next = jest.fn() as unknown as NextFunction;

      authorize('admin')(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('should call next() when the role is allowed', () => {
      const req: any = {};
      const res = mockRes();
      res.locals = { user: { role: 'admin' } };
      const next = jest.fn() as unknown as NextFunction;

      authorize('admin')(req as Request, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});

export {};
