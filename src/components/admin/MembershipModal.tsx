"use client";

import { useState } from "react";
import { IMembership } from "@/types/membership/membership";
import { useToast } from "@/context/ToastContext";
import { parseAxiosError } from "@/utils/apiErrors";

interface MembershipModalProps {
  membership?: IMembership;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function MembershipModal({
  membership,
  isOpen,
  onClose,
  onSubmit,
}: MembershipModalProps) {
  const [formState, setFormState] = useState<Partial<IMembership>>(
    membership || {}
  );
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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

      await onSubmit(formData);
      onClose();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg flex flex-col w-full max-w-lg max-h-[90vh]">
        <div className="p-6 border-b border-[#1D1D1D]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {membership ? "Edit" : "Create"} Membership
            </h2>
            <button
              onClick={onClose}
              className="text-[#CFCFCF] hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            id="membershipForm"
          >
            <div>
              <label className="block text-[#CFCFCF] mb-1">Name</label>
              <input
                type="text"
                value={formState.name || ""}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                required
              />
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">Description</label>
              <textarea
                value={formState.description || ""}
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-32"
                required
              />
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">Price</label>
              <input
                type="number"
                value={formState.price || ""}
                onChange={(e) =>
                  setFormState({ ...formState, price: Number(e.target.value) })
                }
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-[#CFCFCF] mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={formState.duration || ""}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    duration: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                min="1"
                required
              />
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
                form="membershipForm"
                className="px-4 py-2 bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : membership ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
