const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <tbody className="w-full shadow">
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
  );
};

export default TableSkeleton;

const Skeleton = ({ className = "", ...props }) => {
  return (
    <span
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  );
};
