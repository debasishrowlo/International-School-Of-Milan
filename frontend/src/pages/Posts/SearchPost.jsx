import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchPost = ({ search, handleSearchChange, handleSearch }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex">
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Example Post Name"
        className="py-8 px-16 mr-20 w-full bg-gray-50 focus:outline-none focus:border"
      />
      <button
        onClick={handleSearch}
        className="bg-gray-800 px-16 py-8 text-gray-100 rounded-lg"
      >
        <IoSearch />
      </button>
    </div>
  );
};

export default SearchPost;
