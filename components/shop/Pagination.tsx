"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
  if (totalPages <= 1) return null

  // Calculate visible page numbers (show up to 5 pages)
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage, "...", totalPages)
      }
    }
    return pages
  }

  const baseFontStyles = {
    fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  }

  return (
    <div className="mt-[var(--ef-section-padding)] flex justify-center items-center gap-[var(--ef-stack-md)]">
      {/* Previous */}
      <button
        disabled={currentPage === 1 || loading}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center border border-[var(--ef-outline-variant)] text-[var(--ef-on-surface)] hover:bg-[var(--ef-surface-container)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-[var(--ef-on-surface)]"
            style={baseFontStyles}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            disabled={loading}
            className={`w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              page === currentPage
                ? "border border-[var(--ef-primary)] bg-[var(--ef-primary)] text-[var(--ef-on-primary)]"
                : "border border-[var(--ef-outline-variant)] text-[var(--ef-on-surface)] hover:bg-[var(--ef-surface-container)]"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
            style={baseFontStyles}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages || loading}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center border border-[var(--ef-outline-variant)] text-[var(--ef-on-surface)] hover:bg-[var(--ef-surface-container)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Next page"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  )
}
