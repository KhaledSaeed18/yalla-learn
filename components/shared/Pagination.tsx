import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Helper to generate page numbers array with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // If total pages are less than or equal to maxPagesToShow, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            // Calculate middle pages
            const leftSiblingIndex = Math.max(2, currentPage - 1);
            const rightSiblingIndex = Math.min(totalPages - 1, currentPage + 1);

            // Add ellipsis if needed on the left side
            if (leftSiblingIndex > 2) {
                pageNumbers.push(-1); // -1 represents ellipsis
            }

            // Add visible page numbers
            for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                if (i !== 1 && i !== totalPages) {
                    pageNumbers.push(i);
                }
            }

            // Add ellipsis if needed on the right side
            if (rightSiblingIndex < totalPages - 1) {
                pageNumbers.push(-2); // -2 represents ellipsis
            }

            // Always show last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((pageNumber, index) => {
                if (pageNumber < 0) {
                    // Render ellipsis
                    return <span key={`ellipsis-${index}`} className="px-2">...</span>;
                }

                return (
                    <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        onClick={() => onPageChange(pageNumber)}
                        className="w-10 h-10"
                    >
                        {pageNumber}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
