import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1))
  const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages))

  return (
    <div className={`flex gap-1 text-sm ${className}`}>
      {/* Previous button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`w-8 h-8 flex items-center justify-center rounded border ${
          currentPage === 1
            ? "subtext cursor-not-allowed border-transparent"
            : "border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-[5px] border ${
              currentPage === page
                ? "bg-[#2A2A2A] text-white border-[#303030]"
                : "bg-transparent text-gray-400 border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 flex items-center justify-center rounded border ${
          currentPage === totalPages
            ? "subtext cursor-not-allowed border-transparent"
            : "border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
} 