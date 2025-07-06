export const UserCourseStatus = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  DROPPED: "dropped",
} as const;

export type UserCourseStatusType = typeof UserCourseStatus[keyof typeof UserCourseStatus];

// Helper function to capitalize the first letter of status
export const capitalizeStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
}; 