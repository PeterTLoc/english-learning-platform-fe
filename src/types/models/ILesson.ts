import { LessonLength } from '../lesson/LessonLength';

export interface ILesson {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  length: LessonLength[];
  order: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
