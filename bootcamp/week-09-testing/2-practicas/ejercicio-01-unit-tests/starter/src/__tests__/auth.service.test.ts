// ============================================================
// UNIT TESTS — auth.service.ts
// ============================================================
// Objetivo: testear auth.service en aislamiento total.
// La capa de repositorio se MOCKEA — nunca toca una DB real.
//
// Patrón:
//   Arrange → configurar mocks y datos de prueba
//   Act     → llamar la función que se testea
//   Assert  → verificar el resultado o el error
// ============================================================

import bcrypt from 'bcrypt';

// PASO 1: Mockear el módulo de repositorio
jest.mock('../repositories/users.repository');

import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';

const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<typeof usersRepo.findUserByEmail>;
const mockCreateUser = usersRepo.createUser as jest.MockedFunction<typeof usersRepo.createUser>;

const userBase = {
  _id: 'user-id-abc123',
  name: 'Alice',
  email: 'alice@test.com',
  role: 'user' as const,
  createdAt: new Date('2025-01-01'),
};

const registerDto = {
  name: 'Alice',
  email: 'alice@test.com',
  password: 'Password1!',
};

const loginDto = {
  email: 'alice@test.com',
  password: 'Password1!',
};

describe('Auth Service — Unit Tests', () => {
  it('should have mocked repository functions', () => {
    expect(jest.isMockFunction(usersRepo.findUserByEmail)).toBe(true);
    expect(jest.isMockFunction(usersRepo.createUser)).toBe(true);
  });

  // PASO 2: register() — happy path
  describe('register()', () => {
    it('should create a user and return it without the password', async () => {
      mockFindByEmail.mockResolvedValue(null);

      const hashedPwd = await bcrypt.hash(registerDto.password, 1);
      mockCreateUser.mockResolvedValue({
        ...userBase,
        password: hashedPwd,
      });

      const result = await authService.register(registerDto);

      expect(result.email).toBe(registerDto.email);
      expect(result.name).toBe(registerDto.name);
      expect(result.role).toBe('user');
      expect((result as Record<string, unknown>).password).toBeUndefined();
    });

    // PASO 3: register() — email duplicado → 409
    it('should throw AppError 409 if email already exists', async () => {
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: 'hashed-password',
      });

      await expect(authService.register(registerDto)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already registered',
      });

      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  // PASO 4: login() — credenciales incorrectas → 401
  describe('login()', () => {
    it('should throw AppError 401 when user is not found', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should throw AppError 401 when password is wrong', async () => {
      const realHash = await bcrypt.hash('OtraContrasena1!', 1);
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: realHash,
      });

      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should return accessToken on valid credentials', async () => {
      const correctHash = await bcrypt.hash(loginDto.password, 1);
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: correctHash,
      });

      const result = await authService.login(loginDto);

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });

    // PASO 5 (Bonus): Verificar argumentos con toHaveBeenCalledWith
    it('should call findByEmail with the correct email', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toBeDefined();

      expect(mockFindByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockFindByEmail).toHaveBeenCalledTimes(1);
    });
  });
});

export {};
