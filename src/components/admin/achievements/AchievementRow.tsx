import React from "react";
import { IAchievement } from "@/types/models/IAchievement";
import { ObjectId } from "mongoose";
import { formatAchievementType } from "@/utils/formatUtils";

export default function AchievementRow({
  achievement,
  onEdit,
  onDelete,
  isDeleting,
}: {
  achievement: IAchievement;
  onEdit: (achievement: IAchievement) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <tr className="border-b bg-[#202020] border-[#1D1D1D] hover:bg-[#2D2D2D] transition-colors">
      <td className="px-6 py-4 text-left">
        <div className="max-w-xs truncate" title={achievement.name}>
          <span className="font-semibold text-white">{achievement.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="max-w-md truncate" title={achievement.description}>
          <span className="text-white">{achievement.description}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">{formatAchievementType(achievement.type)}</td>
      <td className="px-6 py-4 text-center">{achievement.goal}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <button
            className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onEdit(achievement)}
            disabled={isDeleting}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onDelete((achievement._id as ObjectId).toString())}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
