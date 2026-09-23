import { User, IUser } from '../models/user.model.js';

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email }).select('+password +refreshToken');
}

export async function findUserById(id: string): Promise<IUser | null> {
  return User.findById(id);
}

export async function findUserByIdWithRefreshToken(id: string): Promise<IUser | null> {
  return User.findById(id).select('+refreshToken');
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> {
  return User.create(data);
}

export async function updateRefreshToken(
  userId: string,
  hashedRefreshToken: string | null
): Promise<void> {
  await User.findByIdAndUpdate(userId, { refreshToken: hashedRefreshToken });
}
