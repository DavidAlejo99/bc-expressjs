import { Schema, model, Types } from 'mongoose';

interface IChild {
  name: string;
  enrollmentCode: string;
  group: string;
  monthlyFee: number;
  active: boolean;
  birthDate: Date;
  parent: Types.ObjectId;
}

const GROUPS = ['Sala Cuna', 'Maternal', 'Párvulos', 'Pre-jardín', 'Jardín', 'Transición'];

const childSchema = new Schema<IChild>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: 150,
    },
    enrollmentCode: {
      type: String,
      required: [true, 'El código de matrícula es requerido'],
      trim: true,
      unique: true,
      maxlength: 20,
    },
    group: {
      type: String,
      required: [true, 'El grupo es requerido'],
      enum: GROUPS,
    },
    monthlyFee: {
      type: Number,
      required: [true, 'La mensualidad es requerida'],
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    birthDate: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida'],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Parent',
      required: [true, 'La referencia al acudiente es requerida'],
    },
  },
  { timestamps: true },
);

export const Child = model<IChild>('Child', childSchema);