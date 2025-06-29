import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  role: number;
  avatar: string;
  googleId: string;
  email: string;
  password: string;
  lastOnline: Date;
  onlineStreak: number;
  activeUntil: Date | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  resetPasswordPin: {
    value: string | null;
    expiresAt: Date | null;
    isVerified: boolean;
  };
  points: number;
}

export interface UserDetail extends IUser {
  stats?: {
    totalPoints: number;
    completedLessons: number;
    completedCourses: number;
    completedTests: number;
  };
  courses?: {
    total: number;
    completed: number;
    inProgress: number;
    list: {
      _id: string;
      title: string;
      progress: number;
      status: string;
    }[];
  };
  lessons?: {
    total: number;
    completed: number;
    inProgress: number;
    list: {
      _id: string;
      title: string;
      progress: number;
      status: string;
    }[];
  };
  tests?: {
    total: number;
    completed: number;
    averageScore: number;
    highestScore: number;
    list: {
      _id: string;
      title: string;
      score: number;
      dateTaken: string;
    }[];
  };
  achievements?: {
    total: number;
    list: {
      _id: string;
      title: string;
      description: string;
      dateAwarded: string;
    }[];
  };
  flashcards?: {
    total: number;
    mastered: number;
    learning: number;
    studying: number;
    list: {
      _id: string;
      term: string;
      definition: string;
      status: string;
    }[];
  };
}
