import { ChevronDown, ChevronRight } from "lucide-react";

import React from "react";

export default function Section({
  courseId,
  key,
  title,
  icon,
  content,
  expandedSections,
  toggleSection,
}: {
  courseId: string;
  key: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  expandedSections: Record<string, boolean>;
  toggleSection: (courseId: string, key: string) => void;
}) {
  const isExpanded = expandedSections[`${courseId}_${key}`];
  return (
    <div className="mb-4 sm:mb-6">
      <div
        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-750 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => toggleSection(courseId, key)}
      >
        <div className="text-blue-400">{icon}</div>
        <h2 className="text-lg sm:text-xl font-semibold text-white flex-1">
          {title}
        </h2>
        <div className="text-gray-400">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>
      </div>
      {isExpanded && <div className="mt-3 sm:mt-4">{content}</div>}
    </div>
  );
}
