"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface ServerPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
}

export default function ServerPagination({
  currentPage,
  totalPages,
  pageSize,
}: ServerPaginationProps) {
  const searchParams = useSearchParams()

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    params.set("size", pageSize.toString())
    return `?${params.toString()}`
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (startPage > 1) pages.push(1)
    if (startPage > 2) pages.push("...")
    for (let i = startPage; i <= endPage; i++) pages.push(i)
    if (endPage < totalPages - 1) pages.push("...")
    if (endPage < totalPages) pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex justify-center items-center p-5 sm:px-0">
      <nav aria-label="Page navigation">
        <ul className="flex flex-wrap gap-1 sm:inline-flex text-sm">
          {/* Previous Button */}
          <li>
            <Link
              href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
              className={`w-8 h-8 flex items-center justify-center rounded border ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed border-transparent"
                  : "border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
              }`}
              aria-disabled={currentPage === 1}
            >
              {"<"}
            </Link>
          </li>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <li key={typeof page === "number" ? page : `${page}-${index}`}>
              {page === "..." ? (
                <span className="flex items-center justify-center px-3 sm:px-4 w-8 h-8 sm:h-10 leading-tight text-[#CFCFCF] border border-[#1D1D1D]">
                  ...
                </span>
              ) : (
                <Link
                  href={currentPage === page ? "#" : getPageUrl(page as number)}
                  aria-disabled={currentPage === page}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`w-8 h-8 flex items-center justify-center rounded border ${
                    currentPage === page
                      ? "bg-[#2A2A2A] text-white border-[#303030]"
                      : "bg-transparent text-gray-400 border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
                  }`}
                >
                  {page}
                </Link>
              )}
            </li>
          ))}

          {/* Next Button */}
          <li>
            <Link
              href={
                currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"
              }
              className={`w-8 h-8 flex items-center justify-center rounded border ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed border-transparent"
                  : "border-transparent hover:bg-[#2A2A2A] hover:border-[#303030]"
              }`}
              aria-disabled={currentPage === totalPages}
            >
              {">"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
