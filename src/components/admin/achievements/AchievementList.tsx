import React from "react";
import { IAchievement } from "@/types/models/IAchievement";
import AchievementRow from "./AchievementRow";

export default function AchievementList({
  achievements,
  onEdit,
  onDelete,
}: {
  achievements: IAchievement[];
  onEdit: (achievement: IAchievement) => void;
  onDelete: (id: string) => void;
}) {
  if (achievements.length === 0) {
    return (
      <div className="bg-[#232323] rounded-xl py-10 px-6 text-center mt-4">
        <span className="text-[#CFCFCF] text-base">
          No achievements found. Try adjusting your search criteria.
        </span>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-md text-left text-[#CFCFCF]">
        <thead className="text-sm uppercase bg-[#373737] text-white">
          <tr>
            <th className="px-6 py-3 text-center">Name</th>
            <th className="px-6 py-3 text-center">Description</th>
            <th className="px-6 py-3 text-center">Type</th>
            <th className="px-6 py-3 text-center">Goal</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((achievement) => (
            <AchievementRow
              key={String(achievement._id)}
              achievement={achievement}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
