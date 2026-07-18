import { useAppDispatch } from "../store/hooks";
import { setPage } from "../store";
import "./Pagination.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
}

export function Pagination({ page, totalPages, total }: PaginationProps) {
  const dispatch = useAppDispatch();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => {
      if (totalPages <= 7) return true;
      return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
    });

  return (
    <div className="pagination fade-in">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => dispatch(setPage(page - 1))}
      >
        Previous
      </button>

      {pages.map((p, i) => {
        const showEllipsis = i > 0 && p - pages[i - 1] > 1;
        return (
          <span key={p} style={{ display: "contents" }}>
            {showEllipsis && (
              <span className="pagination-info">...</span>
            )}
            <button
              className={`pagination-btn ${p === page ? "active" : ""}`}
              onClick={() => dispatch(setPage(p))}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => dispatch(setPage(page + 1))}
      >
        Next
      </button>

      <span className="pagination-info">
        {total} task{total !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
