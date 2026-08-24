import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const changePage = (page) => {
    if (
      page >= 1 &&
      page <= totalPages &&
      page !== currentPage
    ) {
      onPageChange(page);
    }
  };

  const getPages = () => {
    const pages = [];

    let start = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );

    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(
        1,
        end - maxVisiblePages + 1
      );
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination">

      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        Previous
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => changePage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;
