import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Filter, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface SuperAdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchField?: string;
  actionColumn?: {
    label: string;
    actions: (row: T) => {
      label: string;
      onClick: (row: T) => void;
      variant?: 'default' | 'destructive' | 'outline' | 'ghost';
    }[];
  };
  onRowClick?: (row: T) => void;
}

export function SuperAdminDataTable<T extends { id: string }>({
  data,
  columns,
  searchField,
  actionColumn,
  onRowClick
}: SuperAdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Filter data based on search query
  const filteredData = searchField && searchQuery
    ? data.filter((row) => {
        const field = row[searchField as keyof T];
        if (typeof field === 'string') {
          return field.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    : data;

  // Sort data based on sort config
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      })
    : filteredData;

  // Handle sort
  const handleSort = (key: string) => {
    if (sortConfig?.key === key) {
      setSortConfig(sortConfig.direction === 'asc'
        ? { key, direction: 'desc' }
        : null
      );
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  return (
    <div className="border border-gray-800 rounded-xl bg-gray-950/50 backdrop-blur-sm">
      {/* Table Header with Search and Filters */}
      {searchField && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-gray-900 border-gray-800 placeholder-gray-500 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-800">
                <Filter className="h-4 w-4 mr-2" />
                فلترة
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-800">
                    <ArrowDownAZ className="h-4 w-4 mr-2" />
                    ترتيب
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800">
                  <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  {columns
                    .filter(column => column.sortable)
                    .map(column => (
                      <DropdownMenuItem
                        key={column.key}
                        className="flex justify-between cursor-pointer"
                        onClick={() => handleSort(column.key)}
                      >
                        {column.header}
                        {sortConfig?.key === column.key && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpAZ className="h-4 w-4" /> 
                            : <ArrowDownAZ className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900/50">
              {columns.map(column => (
                <th 
                  key={column.key} 
                  className={`text-right px-4 py-3 text-sm font-medium text-gray-400 ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center justify-start gap-2">
                    {column.header}
                    {sortConfig?.key === column.key && (
                      sortConfig.direction === 'asc' 
                        ? <ArrowUpAZ className="h-3.5 w-3.5" /> 
                        : <ArrowDownAZ className="h-3.5 w-3.5" />
                    )}
                  </div>
                </th>
              ))}
              {actionColumn && (
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">
                  {actionColumn.label}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedData.length > 0 ? (
              sortedData.map(row => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-gray-900/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map(column => (
                    <td key={`${row.id}-${column.key}`} className="px-4 py-3 text-sm text-white">
                      {column.cell(row)}
                    </td>
                  ))}
                  {actionColumn && (
                    <td className="px-4 py-3 text-sm text-white">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                          <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          {actionColumn.actions(row).map((action, i) => (
                            <DropdownMenuItem
                              key={i}
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actionColumn ? 1 : 0)} 
                  className="px-4 py-8 text-center text-gray-500"
                >
                  لا توجد بيانات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination (simplified version) */}
      <div className="p-4 border-t border-gray-800 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {filteredData.length} عنصر
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-gray-800">
            السابق
          </Button>
          <Button variant="outline" size="sm" className="border-gray-800">
            1
          </Button>
          <Button variant="outline" size="sm" className="border-gray-800">
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDataTable;