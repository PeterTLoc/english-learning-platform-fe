/**
 * Formats achievement type by capitalizing and removing underscores
 * @param type - The achievement type string (e.g., "login_streak")
 * @returns Formatted achievement type (e.g., "Login Streak")
 */
export const formatAchievementType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}; 