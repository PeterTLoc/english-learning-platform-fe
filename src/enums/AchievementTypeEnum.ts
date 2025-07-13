export const AchievementTypeEnum = {
  LoginStreak: "login_streak",
  CouseCompletion: "course_completion",
  LessonCompletion: "lesson_completion",
};
export type AchievementType =
  (typeof AchievementTypeEnum)[keyof typeof AchievementTypeEnum];
