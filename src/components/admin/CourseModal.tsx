"use client";

import { useState, useEffect } from "react";
import { Course, CourseLevelEnum, CourseTypeEnum } from "@/types/course/course";

interface CourseModalProps {
  mode: "create" | "edit";
  course?: Course | null;
  onClose: () => void;
  onCreate: (courseData: Partial<Course>) => Promise<void>;
  onUpdate: (courseId: string, courseData: Partial<Course>) => Promise<void>;
}

const CourseModal = ({ mode, course, onClose, onCreate, onUpdate }: CourseModalProps) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    name: "",
    description: "",
    level: "A1",
    type: "free",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && course) {
      setFormData({
        name: course.name,
        description: course.description,
        level: course.level,
        type: course.type,
        coverImage: course.coverImage,
      });
    }
  }, [mode, course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        await onCreate(formData);
      } else if (mode === "edit" && course) {
        await onUpdate(course._id, formData);
      }
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getLevelLabel = (level: CourseLevelEnum) => {
    const labels = {
      'A1': 'Beginner (A1)',
      'A2': 'Elementary (A2)',
      'B1': 'Intermediate (B1)',
      'B2': 'Upper Intermediate (B2)',
      'C1': 'Advanced (C1)',
      'C2': 'Mastery (C2)'
    };
    return labels[level];
  };

  const getTypeLabel = (type: CourseTypeEnum) => {
    const labels = {
      'free': 'Free Course',
      'membership': 'Premium Course'
    };
    return labels[type];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202020] rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {mode === "create" ? "Create New Course" : "Edit Course"}
        </h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#CFCFCF] mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full p-2"
              required
            />
          </div>

          <div>
            <label className="block text-[#CFCFCF] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full p-2 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-[#CFCFCF] mb-1">Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevelEnum })}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
              required
            >
              <option value="A1">{getLevelLabel('A1')}</option>
              <option value="A2">{getLevelLabel('A2')}</option>
              <option value="B1">{getLevelLabel('B1')}</option>
              <option value="B2">{getLevelLabel('B2')}</option>
              <option value="C1">{getLevelLabel('C1')}</option>
              <option value="C2">{getLevelLabel('C2')}</option>
            </select>
          </div>

          <div>
            <label className="block text-[#CFCFCF] mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CourseTypeEnum })}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
              required
            >
              <option value="free">{getTypeLabel('free')}</option>
              <option value="membership">{getTypeLabel('membership')}</option>
            </select>
          </div>

          <div>
            <label className="block text-[#CFCFCF] mb-1">Cover Image URL</label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="input w-full p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#CFCFCF] hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : mode === "create" ? "Create Course" : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal; 