import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    onItemsPerPageChange(newItemsPerPage);
    onPageChange(1); // Reset to first page when items per page changes
  };

  return (
    <div className="flex gap-3 justify-between items-center fixed bottom-0 w-full left-0 paginaiton_shadow py-3" style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>
      {/* Pagination buttons */}
      <div className="flex items-center pl-28 sm:pl-1 md:pl-20">
        <IoIosArrowBack className={`text-xl cursor-pointer ${currentPage === 1 ? 'text-gray-400 opacity-50 cursor-not-allowed' : ''}`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        <span className="px-4 py-2 mx-1 cursor-pointer sm:px-0 sm:py-0 sm:text-sm">
          Page : {currentPage} / {totalPages}
        </span>
        <IoIosArrowForward className={`text-xl cursor-pointer ${currentPage === totalPages ? 'text-gray-400 opacity-50 cursor-not-allowed' : ''}`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </div>

      <div className="flex items-center pr-8 md:pr-3 ">
        <span className="mr-2 text-sm">Items per page:</span>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="px-2 py-1 border border-gray-300 rounded-md outline-none focus:outline-none sm:text-sm">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
