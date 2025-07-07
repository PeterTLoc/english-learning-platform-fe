"use client";

import { useState, useEffect } from "react";
import { Course, CourseLevelEnum, CourseTypeEnum } from "@/types/course/course";
import { useToast } from "@/context/ToastContext";

interface CourseModalProps {
  mode: "create" | "edit";
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function CourseModal({
  mode,
  course,
  isOpen,
  onClose,
  onSubmit,
}: CourseModalProps) {
  const [formState, setFormState] = useState<Partial<Course>>(course || {});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  useEffect(() => {
    if (mode === "edit" && course) {
      setFormState(course);
      setImagePreview(course.coverImage || "");
    }
  }, [mode, course]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setShouldDeleteImage(false);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview("");
    setShouldDeleteImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (imageFile) {
        formData.append("courseCover", imageFile);
      }
      if (shouldDeleteImage) {
        formData.append("deleteCoverImage", "true");
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const getLevelLabel = (level: CourseLevelEnum) => {
    const labels = {
      A1: "Beginner (A1)",
      A2: "Elementary (A2)",
      B1: "Intermediate (B1)",
      B2: "Upper Intermediate (B2)",
      C1: "Advanced (C1)",
      C2: "Mastery (C2)",
    };
    return labels[level];
  };

  const getTypeLabel = (type: CourseTypeEnum) => {
    const labels = {
      free: "Free Course",
      membership: "Premium Course",
    };
    return labels[type];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg flex flex-col w-full max-w-lg max-h-[90vh]">
        <div className="p-6 border-b border-[#1D1D1D]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {mode === "edit" ? "Edit Course" : "Create Course"}
            </h2>
            <button onClick={onClose} className="text-[#CFCFCF] hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#CFCFCF] mb-1">Name</label>
              <input
                type="text"
                value={formState.name || ''}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                required
              />
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">Description</label>
              <textarea
                value={formState.description || ''}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-32"
                required
              />
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">Level</label>
              <select
                value={formState.level || ''}
                onChange={(e) => setFormState({ ...formState, level: e.target.value as CourseLevelEnum })}
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                required
              >
                <option value="">Select Level</option>
                <option value="A1">Beginner (A1)</option>
                <option value="A2">Elementary (A2)</option>
                <option value="B1">Intermediate (B1)</option>
                <option value="B2">Upper Intermediate (B2)</option>
                <option value="C1">Advanced (C1)</option>
                <option value="C2">Mastery (C2)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">Type</label>
              <select
                value={formState.type || ''}
                onChange={(e) => setFormState({ ...formState, type: e.target.value as CourseTypeEnum })}
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                required
              >
                <option value="">Select Type</option>
                <option value="free">Free Course</option>
                <option value="membership">Premium Course</option>
              </select>
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">Cover Image</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="block w-full text-sm text-[#CFCFCF] file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-sm file:bg-[#4CC2FF] file:text-black hover:file:bg-[#3AA0DB] cursor-pointer bg-[#2D2D2D] rounded-[5px] border border-[#1D1D1D]"
                  required={mode === "create"}
                />
              </div>
              {imagePreview && (
                <div className="mt-2 relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded border border-[#1D1D1D]"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-[#1D1D1D] flex justify-end gap-2">
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
            form="courseForm"
            className="px-4 py-2 bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
