import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/users.repository';
import { signAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema';

export async function register(dto: RegisterDto) {
  const existing = await usersRepository.findByEmail(dto.email);
  if (existing) {
    throw new AppError(409, 'El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const user = await usersRepository.create({ ...dto, password: hashedPassword });

  const userObj = user.toObject() as unknown as Record<string, unknown>;
  delete userObj['password'];
  return userObj;
}

export async function login(dto: LoginDto) {
  const user = await usersRepository.findByEmailWithPassword(dto.email);

  if (!user) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const passwordStr = user.password as string;
  const isValid = await bcrypt.compare(dto.password, passwordStr);
  if (!isValid) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const token = signAccessToken({
    sub: user._id.toString(),
    email: user.email as string,
    role: (user.role as string) ?? 'user',
  });

  return { token, user: { id: user._id, email: user.email, name: user.name, role: user.role } };
}

export async function getMe(userId: string) {
  const user = await usersRepository.findById(userId);
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  return user;
}
