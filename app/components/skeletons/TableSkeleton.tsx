const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="rounded-md border">
        <div className="overflow-hidden">
          <table className="w-full">
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="p-4 align-middle">
                      <Skeleton
                        className={`h-4 ${
                          colIndex === 0
                            ? "w-full max-w-[120px]"
                            : colIndex === 1
                              ? "w-full max-w-[80px]"
                              : colIndex === 2
                                ? "w-full max-w-[220px]"
                                : colIndex === 3
                                  ? "w-full max-w-[100px]"
                                  : "w-full max-w-[60px]"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional: Pagination Skeleton */}
      <div className="flex items-center justify-between px-2 py-4">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;

const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  );
};
