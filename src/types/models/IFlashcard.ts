import { Document, Schema, Types } from "mongoose";

export interface IFlashcard extends Document {
  englishContent: string;
  vietnameseContent: string;
  flashcardSetId: Schema.Types.ObjectId | Types.ObjectId | string;
  order: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
