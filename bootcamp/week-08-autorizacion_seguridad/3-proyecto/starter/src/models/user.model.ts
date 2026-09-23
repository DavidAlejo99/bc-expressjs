import { Schema, model, Document } from 'mongoose';

// staff: educadora/profesor del jardín — puede crear y editar SUS registros
// admin: director/a del jardín — acceso total, incluida la eliminación
export type UserRole = 'staff' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['staff', 'admin'], default: 'staff' },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
