"use client"

import { useState } from "react"
import Sidebar, { SidebarLink } from "@/components/ui/Sidebar"

interface CourseDetailProps {
  params: {
    courseId: string
  }
}

const sidebarLinks: SidebarLink[] = [
  { label: "Materials" },
  { label: "Vocabulary" },
  { label: "Grammar" },
  { label: "Exercises" },
  { label: "Test" },
]

export default function CoursePage({ params }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState("Materials")

  const renderContent = () => {
    switch (activeTab) {
      case "Materials":
        return <div>Material content for course {params.courseId}</div>
      case "Vocabulary":
        return <div>Vocabulary content</div>
      case "Grammar":
        return <div>Grammar content</div>
      case "Exercises":
        return <div>Exercises</div>
      case "Test":
        return <div>Test</div>
      default:
        return <div>Unknown tab</div>
    }
  }

  return (
    <div className="flex">
      <div className="px-5">
        <Sidebar
          links={sidebarLinks}
          selected={activeTab}
          onSelect={setActiveTab}
        />
      </div>

      <div className="px-5 flex-1">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="title mb-4">Course ID: {params.courseId}</h1>
          <div className="container">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
