import Link from "next/link";

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export default function ServerPagination({
  currentPage,
  totalPages,
  pageSize,
}: ServerPaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", pageSize.toString());
    return `?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) pages.push(1);
    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (endPage < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex justify-center items-center py-6">
      <nav aria-label="Page navigation">
        <ul className="inline-flex -space-x-px text-sm">
          {/* Previous Button */}
          <li>
            <Link
              href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
              className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight border border-[#1D1D1D] rounded-l-lg bg-[#2B2B2B] text-[#4CC2FF] hover:bg-[#373737] hover:text-white transition-colors duration-200 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
                <span className="flex items-center justify-center px-4 h-10 leading-tight text-[#CFCFCF] bg-[#2B2B2B] border border-[#1D1D1D]">
                  ...
                </span>
              ) : (
                <Link
                  href={currentPage === page ? "#" : getPageUrl(page as number)}
                  aria-disabled={currentPage === page}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`flex items-center justify-center px-4 h-10 leading-tight border border-[#1D1D1D] bg-[#2B2B2B] text-[#4CC2FF] hover:bg-[#373737] hover:text-white transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-[#373737] text-white font-semibold opacity-50 cursor-not-allowed"
                      : ""
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
              className={`flex items-center justify-center px-4 h-10 leading-tight border border-[#1D1D1D] rounded-r-lg bg-[#2B2B2B] text-[#4CC2FF] hover:bg-[#373737] hover:text-white transition-colors duration-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-disabled={currentPage === totalPages}
            >
              {">"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
