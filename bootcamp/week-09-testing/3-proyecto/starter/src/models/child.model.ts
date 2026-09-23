import mongoose, { Schema, Document } from 'mongoose';
import type { ChildGroup } from '../types/index.js';

const GROUPS: ChildGroup[] = [
  'Sala Cuna',
  'Maternal',
  'Párvulos',
  'Pre-jardín',
  'Jardín',
  'Transición',
];

export interface IChild extends Document {
  name:           string;
  enrollmentCode: string;
  group:          ChildGroup;
  monthlyFee:     number;
  active:         boolean;
  birthDate:      Date;
  createdBy:      string;
  createdAt:      Date;
  updatedAt:      Date;
}

const ChildSchema = new Schema<IChild>(
  {
    name:           { type: String, required: true, trim: true },
    enrollmentCode: { type: String, required: true, unique: true, trim: true },
    group:          { type: String, enum: GROUPS, required: true },
    monthlyFee:     { type: Number, required: true, min: 0 },
    active:         { type: Boolean, default: true },
    birthDate:      { type: Date, required: true },
    createdBy:      { type: String, required: true },
  },
  { timestamps: true },
);

export const ChildModel = mongoose.model<IChild>('Child', ChildSchema);
