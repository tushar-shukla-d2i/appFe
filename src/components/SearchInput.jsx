/**
 * Search Input Component
 */

import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchInput = ({ searchQuery, handleSearch }) => (
  <div className="relative mr-8">
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearch}
      className="p-2 border border-gray-500 rounded-lg w-full"
    />
    <div className="absolute top-3 right-2">
      {searchQuery ? (
        <FaTimes
          className="cursor-pointer text-gray-500"
          onClick={() => handleSearch({ target: { value: "" } })}
        />
      ) : (
        <FaSearch className="text-gray-500" />
      )}
    </div>
  </div>
);

export { SearchInput };
