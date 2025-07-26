"use client"

import React, { useState } from "react"

interface UserAvatarProps {
  username?: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const UserAvatar = ({
  username = '',
  avatarUrl,
  size = 'md',
  className = ''
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false)

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const sizeClass = sizeClasses[size]

  // Get first character of username for fallback
  const initial = username ? username.charAt(0).toUpperCase() : 'U'

  // Show initials if no avatar URL, avatar URL is invalid, or image failed to load
  const shouldShowInitials = !avatarUrl || imageError

  return shouldShowInitials ? (
    <div
      className={`rounded-full ${sizeClass} ${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}
    >
      {initial}
    </div>
  ) : (
    <img
      src={avatarUrl}
      alt={`${username}'s avatar`}
      className={`rounded-full ${sizeClass} ${className}`}
      onError={() => setImageError(true)}
    />
  )
}

export default UserAvatar 