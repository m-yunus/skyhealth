import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center mt-6 text-gray-600">
      <span>
        Showing {currentPage} of {totalPages} entries
      </span>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`border border-gray-300 px-3 py-1 rounded transition ${
    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
  }`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`border px-3 py-1 rounded transition ${
    currentPage === index + 1
      ? "border-purple-600 bg-purple-600 text-white"
      : "border-gray-300 hover:bg-gray-200"
  }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border border-gray-300 px-3 py-1 rounded transition ${
    currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
  }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;