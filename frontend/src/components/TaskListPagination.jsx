import React from "react";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TaskListPagination = ({ hanldeNext, hanldePrev, hanldePageChange, page, totalPages }) => {
   const generatePage = () => {
      let pages = [];
      if (totalPages <= 4) {
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
         }
      } else {
         if (page <= 2) {
            pages = [1, 2, 3, "...", totalPages];
         } else if (page >= totalPages - 1) {
            pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
         } else {
            pages = [1, "...", page, "...", totalPages];
         }
      }
      return pages;
   };
   const pageToShow = generatePage();

   return (
      <div className="flex justify-center mt-4">
         <Pagination>
            <PaginationContent>
               {/* Trang trước */}
               <PaginationItem>
                  <PaginationPrevious
                     onClick={page === 1 ? undefined : hanldePrev}
                     className={cn(
                        "cursor-pointer",
                        page === 1 && "pointer-events-none opacity-50"
                     )}
                  />
               </PaginationItem>

               {pageToShow.map((pageNum, index) => (
                  <PaginationItem key={index}>
                     {pageNum === "..." ? (
                        <PaginationEllipsis />
                     ) : (
                        <PaginationLink
                           isActive={pageNum === page}
                           onClick={() => {
                              if (pageNum !== page) {
                                 hanldePageChange(pageNum);
                              }
                           }}
                           className="cursor-pointer"
                        >
                           {pageNum}
                        </PaginationLink>
                     )}
                  </PaginationItem>
               ))}

               <PaginationItem>
                  {/* Trang kế tiếp */}
                  <PaginationNext
                     onClick={page === totalPages ? undefined : hanldeNext}
                     className={cn(
                        "cursor-pointer",
                        page === totalPages && "pointer-events-none opacity-50"
                     )}
                  />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
};

export default TaskListPagination;
