/**
 * Pagination Component
 */

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Pagination = ({ handlePageChange, currentPage, totalPages }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-1 rounded-md border-2 ${
          currentPage === 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "bg-white text-black border-gray-500"
        }`}
      >
        <FaChevronLeft
          className={`${
            currentPage === 1 ? "text-gray-400" : "text-gray-600"
          } text-xs`}
        />
      </button>

      <div className="text-sm">{currentPage}</div>
      <div className="text-sm text-gray-600">of</div>
      <div className="text-sm">{totalPages}</div>

      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-1 rounded-md border-2 ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "bg-white text-black border-gray-500"
        }`}
      >
        <FaChevronRight
          className={`${
            currentPage === totalPages ? "text-gray-400" : "text-gray-600"
          } text-xs`}
        />
      </button>
    </div>
  );
};

export { Pagination };
