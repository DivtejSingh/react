import React from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, handleItemsPerPageChange }) => {
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination items-center bg-white p-4 fixed w-full left-0 bottom-0">
            <div className="flex items-center justify-center gap-2 pagination_number">
                <button onClick={goToPreviousPage} disabled={currentPage === 1} >
                    <KeyboardArrowLeftIcon sx={{ color: currentPage == 1 ? '#ccc' : '#000', cursor: currentPage == 1 ? 'not-allowed' : 'pointer' }} />
                </button>
                <span className="mx-3">
                    <span className="font-bold">{currentPage}</span> / {totalPages}
                </span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    <KeyboardArrowRightIcon sx={{ color: currentPage == totalPages ? '#ccc' : '#000', cursor: currentPage == totalPages ? 'not-allowed' : 'pointer' }} />

                </button>
            </div>
            <div className="items-per-page absolute right-52 top-4 items_per_page">
                <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="border rounded p-1">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
};

export default Pagination;
