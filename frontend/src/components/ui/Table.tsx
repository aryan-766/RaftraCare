"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  toolbarActions?: React.ReactNode;
  exportFilename?: string;
  className?: string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchPlaceholder = "Search records...",
  searchFilter,
  pageSize = 10,
  onRowClick,
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionLabel,
  toolbarActions,
  exportFilename,
  className,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    if (searchFilter) {
      return data.filter((item) => searchFilter(item, searchQuery));
    }
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      Object.values(item as Record<string, unknown>).some((val) =>
        String(val || "").toLowerCase().includes(q)
      )
    );
  }, [data, searchQuery, searchFilter]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      const cmp = valA < valB ? -1 : 1;
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else {
        setSortKey(null);
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columns.map((c) => `"${c.header}"`).join(",");
    const rows = sortedData.map((row) =>
      columns
        .map((c) => {
          const val = c.accessorKey ? row[c.accessorKey] : "";
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename || "hospitalos-export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-dark rounded-card border border-border dark:border-border-dark overflow-hidden flex flex-col shadow-subtle",
        className
      )}
    >
      {/* Toolbar */}
      {(searchable || toolbarActions || exportFilename) && (
        <div className="p-3.5 border-b border-border dark:border-border-dark flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            {searchable && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-foreground-muted dark:text-foreground-mutedDark" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-input bg-white dark:bg-surface-cardDark border border-border dark:border-border-dark text-foreground dark:text-foreground-dark placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {toolbarActions}
            {exportFilename && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Table View */}
      {paginatedData.length === 0 ? (
        <EmptyState
          title={emptyTitle || (searchQuery ? "No matching records" : "No records available")}
          description={
            emptyDescription ||
            (searchQuery
              ? "Try adjusting your search keywords."
              : "There are currently no records to display in this list.")
          }
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
          className="border-none rounded-none py-12"
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border dark:border-border-dark bg-slate-50/70 dark:bg-slate-900/50">
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      onClick={() => col.sortable && handleSort(col.accessorKey)}
                      className={cn(
                        "px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark select-none whitespace-nowrap",
                        col.sortable && "cursor-pointer hover:text-foreground dark:hover:text-foreground-dark",
                        col.className
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && col.accessorKey && (
                          <span className="flex flex-col">
                            {sortKey === col.accessorKey ? (
                              sortOrder === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-primary" />
                              )
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-border-dark/60 text-xs">
                {paginatedData.map((row) => {
                  const key = keyExtractor(row);
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={cn(
                        "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                        onRowClick && "cursor-pointer"
                      )}
                    >
                      {columns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          className={cn(
                            "px-4 py-3 text-foreground dark:text-foreground-dark whitespace-nowrap",
                            col.className
                          )}
                        >
                          {col.render
                            ? col.render(row)
                            : col.accessorKey
                            ? String(row[col.accessorKey] ?? "—")
                            : "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-2.5 border-t border-border dark:border-border-dark flex items-center justify-between text-xs text-foreground-muted dark:text-foreground-mutedDark bg-slate-50/40 dark:bg-slate-900/20">
            <div>
              Showing{" "}
              <span className="font-semibold text-foreground dark:text-foreground-dark">
                {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground dark:text-foreground-dark">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground dark:text-foreground-dark">
                {sortedData.length}
              </span>{" "}
              records
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded border border-border dark:border-border-dark hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded border border-border dark:border-border-dark hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
