"use client";

import { useState, useEffect } from "react";
import { IMembership } from "@/types/membership/membership";

interface MembershipModalProps {
  mode: "create" | "edit";
  membership?: IMembership | null;
  onClose: () => void;
  onCreate: (membershipData: Partial<IMembership>) => Promise<void>;
  onUpdate: (membershipId: string, membershipData: Partial<IMembership>) => Promise<void>;
}

const MembershipModal = ({ mode, membership, onClose, onCreate, onUpdate }: MembershipModalProps) => {
  const [formData, setFormData] = useState<Partial<IMembership>>({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    isDeleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && membership) {
      setFormData({
        name: membership.name,
        description: membership.description,
        price: membership.price,
        duration: membership.duration,
        isDeleted: membership.isDeleted,
      });
    }
  }, [mode, membership]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
      };

      if (mode === "create") {
        await onCreate(payload);
      } else if (mode === "edit" && membership) {
        await onUpdate(membership._id, payload);
      }
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1F1F1F] p-8 rounded-lg w-[500px]">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {mode === "edit" ? "Edit Membership" : "Create Membership"}
        </h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#CFCFCF] mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#2C2C2C] text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#CFCFCF] mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#2C2C2C] text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#CFCFCF] mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#2C2C2C] text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#CFCFCF] mb-1">Duration (days)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#2C2C2C] text-white rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipModal; 