import mongoose, { Document, Types } from "mongoose";
import { IExercise } from "./IExercise";

export interface IUserExercise extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  exerciseId: mongoose.Schema.Types.ObjectId;
  completed: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Populated fields from aggregation
  exercise?: IExercise;
  user?: any; // User data if needed
}

// Extended interface for frontend use with populated data
export interface UserExerciseWithDetails {
  _id: string;
  userId: string;
  exerciseId: string;
  completed: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  exercise: IExercise;
  user?: any;
}
