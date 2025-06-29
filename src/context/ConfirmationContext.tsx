"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface ConfirmationContextType {
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
}

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationContext = createContext<ConfirmationContextType>({
  showConfirmation: () => Promise.resolve(false),
});

export const useConfirmation = () => useContext(ConfirmationContext);

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: "",
    message: "",
  });
  const [resolveRef, setResolveRef] = useState<(value: boolean) => void>(() => () => {});

  const showConfirmation = (options: ConfirmationOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolveRef(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolveRef(false);
    setIsOpen(false);
  };

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      <ConfirmationModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationProvider; 