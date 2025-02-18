import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  PaginationState,
  OnChangeFn,
  ColumnDef,
} from "@tanstack/react-table";

interface Spell {
  index: string;
  name: string;
  level: number;
  url: string;
  [key: string]: any;
}

export function useDashboardTable(
  data: Spell[],
  columns: ColumnDef<Spell>[],
  pageIndex: number,
  rowCount: number,
  globalFilter: string,
  handlePaginationChange: OnChangeFn<PaginationState>
) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize: rowCount,
      },
    },
    onGlobalFilterChange: (updater) => {
      if (typeof updater === "function") {
        console.log(
          "It is a function to update the data. Must call that function."
        );
      } else {
        console.log("It isn't a function.");
      }
    },
    onPaginationChange: handlePaginationChange,
    manualPagination: true,
    pageCount: 100,
  });

  return table;
}
