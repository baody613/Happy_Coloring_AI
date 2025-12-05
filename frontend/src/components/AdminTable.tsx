import React from "react";
import { Button } from "./ui/Button";
import { cn } from "@/utils/helpers";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRows?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  idKey?: keyof T;
  className?: string;
}

export function AdminTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  onRowClick,
  selectedRows,
  onSelectRow,
  onSelectAll,
  idKey = "id" as keyof T,
  className,
}: AdminTableProps<T>) {
  const hasSelection = !!selectedRows && !!onSelectRow;
  const allSelected =
    hasSelection &&
    data.length > 0 &&
    data.every((row) => selectedRows.has(String(row[idKey])));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {hasSelection && (
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  !column.align && "text-left"
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => {
            const rowId = String(row[idKey]);
            const isSelected = hasSelection && selectedRows.has(rowId);

            return (
              <tr
                key={rowId || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-gray-50 transition-colors",
                  onRowClick && "cursor-pointer",
                  isSelected && "bg-blue-50"
                )}
              >
                {hasSelection && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectRow(rowId);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const value = (
                    column.key.toString().includes(".")
                      ? column.key
                          .toString()
                          .split(".")
                          .reduce((obj, key) => obj?.[key], row as any)
                      : row[column.key as keyof T]
                  ) as T[keyof T];

                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-6 py-4 whitespace-nowrap text-sm",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        !column.align && "text-left"
                      )}
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Pagination component
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        {totalItems && itemsPerPage && (
          <span>
            Hiển thị{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            đến{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            trong tổng số <span className="font-medium">{totalItems}</span> kết
            quả
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </Button>
        {visiblePages.map((page, index) => (
          <React.Fragment key={page}>
            {index > 0 && visiblePages[index - 1] !== page - 1 && (
              <span className="px-3 py-1 text-gray-400">...</span>
            )}
            <Button
              variant={page === currentPage ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </React.Fragment>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
