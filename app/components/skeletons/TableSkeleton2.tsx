import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";

function TableSkeleton2() {
  return (
    <TableBody className="w-full space-y-">
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i.toString()}>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableCell key={i.toString()}>
              <Skeleton className="h-6 w-[90%]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default TableSkeleton2;
