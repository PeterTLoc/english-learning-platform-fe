import mongoose, { Document } from "mongoose";
import { IUser } from "./IUser";

export interface IFlashcardSet extends Document {
  name: string;
  description: string;
  userId: mongoose.Schema.Types.ObjectId;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  flashcardCount?: number;
  user?: IUser;
}
