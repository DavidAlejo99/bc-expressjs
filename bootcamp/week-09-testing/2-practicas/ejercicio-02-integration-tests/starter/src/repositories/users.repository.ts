import { UserModel } from '../models/user.model.js';
import type { IUser } from '../models/user.model.js';

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email }).lean<IUser>().exec();
}

export async function createUser(
  data: Pick<IUser, 'name' | 'email' | 'password' | 'role'>,
): Promise<IUser> {
  const user = new UserModel(data);
  await user.save();
  // .toObject() devuelve un objeto plano (sin metadata interna de Mongoose
  // como $__, _doc, etc.) — necesario para que el spread {...safeUser} del
  // service limpie correctamente el password de la respuesta.
  return user.toObject() as IUser;
}

export async function findUserById(id: string): Promise<IUser | null> {
  return UserModel.findById(id).lean<IUser>().exec();
}
