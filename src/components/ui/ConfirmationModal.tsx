"use client";

import React from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger"
}) => {
  if (!isOpen) return null;
  
  const getButtonStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600";
      case "info":
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center mb-4">
          {variant === "danger" && <AlertCircle className="w-14 h-14 text-red-500 mb-2" />}
          {variant === "warning" && <AlertTriangle className="w-14 h-14 text-amber-400 mb-2" />}
          {variant === "info" && <Info className="w-14 h-14 text-blue-400 mb-2" />}
          <h2 className="text-xl font-bold text-white text-center mt-2">{title}</h2>
        </div>
        <p className="text-[#CFCFCF] mb-6 text-center">{message}</p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#373737] hover:bg-[#2D2D2D] text-white rounded"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 