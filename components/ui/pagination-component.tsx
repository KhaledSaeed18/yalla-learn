import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationComponentProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationComponent({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationComponentProps) {
    // Only show a limited number of page links to avoid cluttering
    const maxVisiblePages = 5;

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= maxVisiblePages) {
            // If we have few pages, show all of them
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // If we have many pages, show a subset
            if (currentPage <= 3) {
                // Near the beginning
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(-1); // -1 represents ellipsis
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near the end
                pageNumbers.push(1);
                pageNumbers.push(-1);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Somewhere in the middle
                pageNumbers.push(1);
                pageNumbers.push(-1);
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push(-1);
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null;

    return (
        <Pagination className="mt-6">
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => onPageChange(currentPage - 1)} />
                    </PaginationItem>
                )}

                {getPageNumbers().map((pageNumber, index) => {
                    if (pageNumber === -1) {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNumber);
                                }}
                                isActive={pageNumber === currentPage}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => onPageChange(currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
