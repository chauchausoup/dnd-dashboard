import React, { useCallback, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { truncateText } from "@/lib/utils";
import { 
  fetchAllSpells, 
  fetchSpellDetails, 
  selectPaginatedSpells, 
  selectMissingSpellIndexes,
  selectLoadingState,
  selectError,
  selectPagination,
  setPagination
} from "@/store/spellsSlice";

interface Spell {
  index: string;
  name: string;
  level: number;
  url: string;
}

interface SpellDetail {
  index: string;
  name: string;
  desc: string[];
  higher_level?: string[];
  range: string;
  components: string[];
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  school: {
    index: string;
    name: string;
    url: string;
  };
  classes: {
    index: string;
    name: string;
    url: string;
  }[];
  subclasses: {
    index: string;
    name: string;
    url: string;
  }[];
  url: string;
  updated_at: string;
}

interface SpellWithDetails extends Spell {
  details?: SpellDetail;
}

export const DashboardTable: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  
  const allSpells = useSelector((state: RootState) => state.spells.allSpells);
  const { pageIndex, rowCount } = useSelector(selectPagination);
  const loading = useSelector(selectLoadingState);
  const error = useSelector(selectError);
  
  const paginatedSpells = useSelector(selectPaginatedSpells);
  const missingSpellIndexes = useSelector(selectMissingSpellIndexes);

  // ref to track which spell details have been dispatched so we don't trigger duplicates.
  const dispatchedSpellDetailsRef = useRef<Set<string>>(new Set());

  // on mount: fetch all spells if not loaded
  useEffect(() => {
    if (allSpells.length === 0 && !loading.allSpells) {
      dispatch(fetchAllSpells());
    }
  }, [allSpells.length, loading.allSpells, dispatch]);

  // fetch missing spell details only once per spell
  useEffect(() => {
    if (!loading.spellDetails && missingSpellIndexes.length > 0) {
      missingSpellIndexes.forEach((spellIndex) => {
        if (!dispatchedSpellDetailsRef.current.has(spellIndex)) {
          dispatchedSpellDetailsRef.current.add(spellIndex);
          dispatch(fetchSpellDetails(spellIndex));
        }
      });
    }
  }, [missingSpellIndexes, loading.spellDetails, dispatch]);

  const columns = React.useMemo<ColumnDef<SpellWithDetails>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "level",
        header: "Level",
      },
      {
        id: "description",
        header: "Description",
        cell: ({ row }) =>
          truncateText(row.original.details?.desc?.join("\n") || "No description", 90),
      },
      {
        id: "casting_time",
        header: "Casting Time",
        cell: ({ row }) => truncateText(row.original.details?.casting_time || "N/A", 20),
      },
      {
        id: "range",
        header: "Range",
        cell: ({ row }) => truncateText(row.original.details?.range || "N/A", 20),
      },
      {
        id: "components",
        header: "Components",
        cell: ({ row }) =>
          truncateText(row.original.details?.components?.join(", ") || "N/A", 30),
      },
      {
        id: "ritual",
        header: "Ritual",
        cell: ({ row }) => (row.original.details?.ritual ? "Yes" : "No"),
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => truncateText(row.original.details?.duration || "N/A", 20),
      },
      {
        id: "concentration",
        header: "Concentration",
        cell: ({ row }) => (row.original.details?.concentration ? "Yes" : "No"),
      },
      {
        id: "school",
        header: "School",
        cell: ({ row }) =>
          truncateText(row.original.details?.school?.name || "N/A", 20),
      },
      {
        id: "classes",
        header: "Classes",
        cell: ({ row }) =>
          truncateText(
            row.original.details?.classes?.map((cls) => cls.name).join(", ") || "N/A",
            40
          ),
      },
    ],
    []
  );

  // Use useCallback for pagination handling
  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback((updater) => {
    const newPagination =
      typeof updater === "function"
        ? updater({ pageIndex, pageSize: rowCount })
        : updater;
    
    dispatch(setPagination({
      pageIndex: newPagination.pageIndex,
      rowCount: newPagination.pageSize,
    }));
  }, [dispatch, pageIndex, rowCount]);

  const table = useReactTable({
    data: paginatedSpells,
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

  if (loading.allSpells && allSpells.length === 0) {
    return <div>Loading spell list...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Label htmlFor="search">Search:</Label>
        <Input
          type="text"
          id="search"
          placeholder="Search..."
          className="max-w-sm"
          value={globalFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
        />
      </div>

      <Table>
        <TableCaption>A list of D&D 5e spells.</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No spells found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {loading.spellDetails && !row.original.details ? (
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
    </div>
  );
});