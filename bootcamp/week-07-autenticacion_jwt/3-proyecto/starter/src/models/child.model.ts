import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChild extends Document {
  name: string;
  enrollmentCode: string;
  group: 'Sala Cuna' | 'Maternal' | 'Párvulos' | 'Pre-jardín' | 'Jardín' | 'Transición';
  monthlyFee: number;
  active: boolean;
  birthDate: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GROUPS = ['Sala Cuna', 'Maternal', 'Párvulos', 'Pre-jardín', 'Jardín', 'Transición'];

const childSchema = new Schema<IChild>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    enrollmentCode: {
      type: String,
      required: [true, 'El código de matrícula es requerido'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    group: {
      type: String,
      enum: GROUPS,
      required: [true, 'El grupo es requerido'],
    },
    monthlyFee: {
      type: Number,
      required: [true, 'La mensualidad es requerida'],
      min: [0, 'La mensualidad no puede ser negativa'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    birthDate: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const ChildModel = mongoose.model<IChild>('Child', childSchema);
