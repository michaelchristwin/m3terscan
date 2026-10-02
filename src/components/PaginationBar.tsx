import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { getPageItems } from "~/lib/pagination";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationBarProps) {
  const goTo = (p: number) =>
    onPageChange(Math.min(Math.max(p, 1), totalPages));
  const disabled = "pointer-events-none opacity-50";

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page === 1}
            className={page === 1 ? disabled : ""}
            onClick={(e) => {
              e.preventDefault();
              goTo(page - 1);
            }}
          />
        </PaginationItem>

        {getPageItems(page, totalPages).map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={page === item}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === totalPages}
            className={page === totalPages ? disabled : ""}
            onClick={(e) => {
              e.preventDefault();
              goTo(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
