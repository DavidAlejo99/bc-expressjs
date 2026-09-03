import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/users.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sha256 } from '../utils/token-hash';
import { AppError } from '../errors/AppError';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema';

export async function register(dto: RegisterDto) {
  const existing = await usersRepository.findByEmail(dto.email);
  if (existing) throw new AppError(409, 'El email ya está registrado');
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const user = await usersRepository.create({ ...dto, password: hashedPassword });
  const userObj = user.toObject() as unknown as Record<string, unknown>;
  delete userObj['password'];
  return userObj;
}

export async function login(dto: LoginDto) {
  const user = await usersRepository.findByEmailWithPassword(dto.email);
  if (!user) throw new AppError(401, 'Credenciales inválidas');
  const isValid = await bcrypt.compare(dto.password, user.password as string);
  if (!isValid) throw new AppError(401, 'Credenciales inválidas');

  const userId = user._id.toString();
  const accessToken = signAccessToken({
    sub: userId,
    email: user.email as string,
    role: (user.role as string) ?? 'user',
  });

  const refreshToken = signRefreshToken({ sub: userId });
  const hashedRefresh = await bcrypt.hash(sha256(refreshToken), 10);
  await usersRepository.updateRefreshToken(userId, hashedRefresh);

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  };
}

export async function refresh(incomingRefreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new AppError(401, 'Refresh token inválido');
  }

  const user = await usersRepository.findByIdWithTokens(payload.sub);
  if (!user || !user.refreshToken) {
    throw new AppError(401, 'Refresh token inválido');
  }

  const isMatch = await bcrypt.compare(sha256(incomingRefreshToken), user.refreshToken as string);
  if (!isMatch) throw new AppError(401, 'Refresh token inválido o ya rotado');

  const userId = user._id.toString();
  const newAccessToken = signAccessToken({
    sub: userId,
    email: user.email as string,
    role: (user.role as string) ?? 'user',
  });
  const newRefreshToken = signRefreshToken({ sub: userId });
  const newHashedRefresh = await bcrypt.hash(sha256(newRefreshToken), 10);
  await usersRepository.updateRefreshToken(userId, newHashedRefresh);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string): Promise<void> {
  await usersRepository.updateRefreshToken(userId, undefined);
}

export async function getMe(userId: string) {
  const user = await usersRepository.findById(userId);
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  return user;
}
