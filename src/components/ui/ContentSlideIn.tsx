"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

interface ContentSlideInProps {
  children: ReactNode
  keyValue: string
  isLoading?: boolean
  loadingComponent?: ReactNode
  direction?: 'right' | 'bottom'
}

export default function ContentSlideIn({ 
  children, 
  keyValue, 
  isLoading = false,
  loadingComponent,
  direction = 'right'
}: ContentSlideInProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        {loadingComponent || (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4CC2FF]"></div>
        )}
      </div>
    )
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'bottom':
        return { opacity: 0, y: 50 }
      case 'right':
      default:
        return { x: 30 }
    }
  }

  const getAnimatePosition = () => {
    switch (direction) {
      case 'bottom':
        return { opacity: 1, y: 0 }
      case 'right':
      default:
        return { x: 0 }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={keyValue}
        initial={getInitialPosition()}
        animate={getAnimatePosition()}
        transition={{ 
          duration: 0.15
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} 