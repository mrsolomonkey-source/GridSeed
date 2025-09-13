import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole } from '../types/user';

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.Viewer },
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>('User', UserSchema);