import { Schema, model } from 'mongoose';

interface IParent {
  fullName: string;
  email: string;
  phone: string;
}

const parentSchema = new Schema<IParent>(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
      maxlength: 20,
    },
  },
  { timestamps: true },
);

export const Parent = model<IParent>('Parent', parentSchema);