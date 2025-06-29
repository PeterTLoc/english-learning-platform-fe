"use client"

import React from "react"

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
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const sizeClass = sizeClasses[size]

  // Get first character of username for fallback
  const initial = username ? username.charAt(0).toUpperCase() : 'U'

  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={`${username}'s avatar`}
      className={`rounded-full ${sizeClass} ${className}`}
    />
  ) : (
    <div
      className={`rounded-full ${sizeClass} ${className} bg-[#373737] flex items-center justify-center text-white`}
    >
      {initial}
    </div>
  )
}

export default UserAvatar 