import React, { useState, useEffect } from "react";
import {
  AchievementType,
  AchievementTypeEnum,
} from "@/enums/AchievementTypeEnum";
import { formatAchievementType } from "@/utils/formatUtils";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    type: AchievementType;
    goal: number;
  }) => void;
  initialValues?: {
    name?: string;
    description?: string;
    type?: AchievementType;
    goal?: number;
  };
  mode: "create" | "update";
  loading?: boolean;
}

export default function AchievementModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode,
  loading = false,
}: AchievementModalProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [type, setType] = useState<AchievementType>(
    initialValues?.type || AchievementTypeEnum.LoginStreak
  );
  const [goal, setGoal] = useState(initialValues?.goal || 1);

  useEffect(() => {
    if (isOpen) {
      setName(initialValues?.name || "");
      setDescription(initialValues?.description || "");
      setType(initialValues?.type || AchievementTypeEnum.LoginStreak);
      setGoal(initialValues?.goal || 1);
    }
  }, [isOpen, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, type, goal });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#202020] rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">
          {mode === "create" ? "Create Achievement" : "Update Achievement"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-[#2D2D2D] text-white border border-[#373737]"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-white mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-[#2D2D2D] text-white border border-[#373737]"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-white mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AchievementType)}
              className="w-full p-2 rounded bg-[#2D2D2D] text-white border border-[#373737]"
              required
              disabled={loading}
            >
              {Object.entries(AchievementTypeEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {formatAchievementType(value)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-1">Goal</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full p-2 rounded bg-[#2D2D2D] text-white border border-[#373737]"
              required
              min="1"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#373737] text-white rounded hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
