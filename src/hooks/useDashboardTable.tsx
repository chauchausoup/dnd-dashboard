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
  allSpells:Spell[],
  columns: ColumnDef<Spell>[],
  pageIndex: number,
  rowCount: number,
  globalFilter: string,
  setGlobalFilter: OnChangeFn<string>,
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
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: handlePaginationChange,
    manualPagination: true,
    pageCount: Math.ceil(allSpells.length / rowCount),
  });

  return table;
}
