import mongoose, { Document, Schema, Types } from 'mongoose';

export type ChildGroup =
  | 'Sala Cuna'
  | 'Maternal'
  | 'Párvulos'
  | 'Pre-jardín'
  | 'Jardín'
  | 'Transición';

const GROUPS: ChildGroup[] = [
  'Sala Cuna',
  'Maternal',
  'Párvulos',
  'Pre-jardín',
  'Jardín',
  'Transición',
];

export interface IChild extends Document {
  name: string;
  enrollmentCode: string;
  group: ChildGroup;
  monthlyFee: number;
  active: boolean;
  birthDate: Date;
  createdBy: Types.ObjectId; // staff/admin que registró al niño
  createdAt: Date;
  updatedAt: Date;
}

const childSchema = new Schema<IChild>(
  {
    name: { type: String, required: true, trim: true },
    enrollmentCode: { type: String, required: true, unique: true, trim: true },
    group: { type: String, enum: GROUPS, required: true },
    monthlyFee: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    birthDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ChildModel = mongoose.model<IChild>('Child', childSchema);
