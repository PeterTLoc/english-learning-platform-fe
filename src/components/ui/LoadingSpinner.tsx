"use client"

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  fullScreen = false,
  className = '',
}) => {
  // Size mappings
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-2',
    large: 'h-16 w-16 border-4',
  }

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'
    : 'flex items-center justify-center'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-primary`}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

export default LoadingSpinner 