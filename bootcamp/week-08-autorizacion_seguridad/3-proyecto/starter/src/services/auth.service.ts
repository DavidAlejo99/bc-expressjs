import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithRefreshToken,
  updateRefreshToken,
} from '../repositories/users.repository.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sha256 } from '../utils/token-hash.js';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema.js';

const SALT_ROUNDS = 12;

export async function register(dto: RegisterDto) {
  const existing = await findUserByEmail(dto.email);
  if (existing) throw new AppError(409, 'Email already registered');

  const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await createUser({ ...dto, password: hashed });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function login(dto: LoginDto) {
  const user = await findUserByEmail(dto.email);
  if (!user) throw new AppError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(dto.password, user.password);
  if (!valid) throw new AppError(401, 'Invalid credentials');

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  const refreshToken = signRefreshToken(user._id.toString());

  const hashedRefresh = await bcrypt.hash(sha256(refreshToken), SALT_ROUNDS);
  await updateRefreshToken(user._id.toString(), hashedRefresh);

  return { accessToken, refreshToken, role: user.role };
}

export async function refreshTokens(token: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const user = await findUserByIdWithRefreshToken(payload.sub);
  if (!user || !user.refreshToken) throw new AppError(401, 'User not found');

  const isValid = await bcrypt.compare(sha256(token), user.refreshToken);
  if (!isValid) throw new AppError(401, 'Refresh token has been revoked or rotated');

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = signRefreshToken(user._id.toString());

  const hashedNewRefresh = await bcrypt.hash(sha256(newRefreshToken), SALT_ROUNDS);
  await updateRefreshToken(user._id.toString(), hashedNewRefresh);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string) {
  await updateRefreshToken(userId, null);
}

export async function getMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, 'User not found');
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}
