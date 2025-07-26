import mongoose, { Document } from "mongoose";
import { IUser } from "./IUser";
import { IMembership } from "./IMembership";

export interface IReceipt extends Document {
  amount: number;
  userId: mongoose.Schema.Types.ObjectId;
  membershipId: mongoose.Schema.Types.ObjectId;
  transactionId: string;
  paymentMethod: string;
  paymentGateway: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: IUser;
  membership?: IMembership;
}
