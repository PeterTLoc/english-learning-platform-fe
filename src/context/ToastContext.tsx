"use client";

import React, { createContext, useContext, useState } from 'react';
import Toast from '@/components/ui/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    show: boolean;
    duration: number;
  }>({
    message: '',
    type: 'info',
    show: false,
    duration: 3000,
  });

  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    setToast({
      message,
      type,
      show: true,
      duration,
    });
  };

  const handleClose = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        duration={toast.duration}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider; 