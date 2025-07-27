export const AchievementTypeEnum = {
  LoginStreak: "login_streak",
  CourseCompletion: "course_completion",
  LessonCompletion: "lesson_completion",
};
export type AchievementType =
  (typeof AchievementTypeEnum)[keyof typeof AchievementTypeEnum];
