import React from "react";
import {
  Button,
} from "@/components/ui/button";

interface TableState {
  pagination: {
    pageIndex: number;
  };
}

interface DashboardTablePaginationProps {
  loading: {
    spellDetails: boolean;
    [key: string]: boolean;
  };
  table: {
    previousPage: () => void;
    nextPage: () => void;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    getState: () => TableState;
    getPageCount: () => number;
  };
}
export const DashboardTablePagination: React.FC<DashboardTablePaginationProps> = ({loading, table}) => {
    return (
        <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>
        {loading.spellDetails && (
          <div className="text-sm text-gray-500">Loading spell details...</div>
        )}
      </div>
    );
};