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

  const btnBase: React.CSSProperties = {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--ef-outline-variant)",
    color: "var(--ef-on-surface)",
    fontFamily: "var(--font-hanken-grotesk), 'Hanken Grotesk', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
    background: "transparent",
  }

  const activeBtnStyle: React.CSSProperties = {
    ...btnBase,
    borderColor: "var(--ef-primary)",
    backgroundColor: "var(--ef-primary)",
    color: "var(--ef-on-primary)",
  }

  return (
    <div className="flex justify-center items-center gap-[var(--ef-stack-md)]" style={{ marginTop: "var(--ef-section-padding)" }}>
      {/* Previous */}
      <button
        style={btnBase}
        disabled={currentPage === 1 || loading}
        onClick={() => onPageChange(currentPage - 1)}
        className="hover:bg-[var(--ef-surface-container)] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          chevron_left
        </span>
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            style={{ ...btnBase, border: "none", cursor: "default" }}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            style={page === currentPage ? activeBtnStyle : btnBase}
            onClick={() => onPageChange(page as number)}
            disabled={loading}
            className={page !== currentPage ? "hover:bg-[var(--ef-surface-container)]" : ""}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        style={btnBase}
        disabled={currentPage === totalPages || loading}
        onClick={() => onPageChange(currentPage + 1)}
        className="hover:bg-[var(--ef-surface-container)] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          chevron_right
        </span>
      </button>
    </div>
  )
}
