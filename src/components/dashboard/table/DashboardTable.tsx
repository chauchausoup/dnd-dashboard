import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,

  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchAllSpells,
  fetchSpellDetails,
  selectPaginatedSpells,
  selectMissingSpellIndexes,
  selectLoadingState,
  selectError,
  selectPagination,
  setPagination,
} from "@/store/spellsSlice";

import { DashboardTableColumn } from "./DashboardTableColumn";
import { DashboardTablePagination } from "./DashboardTablePagination";
import { DashboardTableContent } from "./DashboardTableContent";

export const DashboardTable: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const [globalFilter, setGlobalFilter] =
    React.useState<string>("");

  const allSpells = useSelector(
    (state: RootState) => state.spells.allSpells
  );
  const { pageIndex, rowCount } = useSelector(
    selectPagination
  );
  const loading = useSelector(selectLoadingState);
  const error = useSelector(selectError);

  const paginatedSpells = useSelector(
    selectPaginatedSpells
  );
  const missingSpellIndexes = useSelector(
    selectMissingSpellIndexes
  );

  // ref to track which spell details have been dispatched so we don't trigger duplicates.
  const dispatchedSpellDetailsRef = useRef<Set<string>>(
    new Set()
  );

  // on mount: fetch all spells if not loaded
  useEffect(() => {
    if (allSpells.length === 0 && !loading.allSpells) {
      dispatch(fetchAllSpells());
    }
  }, [allSpells.length, loading.allSpells, dispatch]);

  // fetch missing spell details only once per spell
  useEffect(() => {
    if (
      !loading.spellDetails &&
      missingSpellIndexes.length > 0
    ) {
      missingSpellIndexes.forEach((spellIndex) => {
        if (
          !dispatchedSpellDetailsRef.current.has(spellIndex)
        ) {
          dispatchedSpellDetailsRef.current.add(spellIndex);
          dispatch(fetchSpellDetails(spellIndex));
        }
      });
    }
  }, [missingSpellIndexes, loading.spellDetails, dispatch]);

  const columns = useMemo(() => DashboardTableColumn(), []);

  // use useCallback for pagination handling
  const handlePaginationChange: OnChangeFn<PaginationState> =
    useCallback(
      (updater) => {
        const newPagination =
          typeof updater === "function"
            ? updater({ pageIndex, pageSize: rowCount })
            : updater;

        dispatch(
          setPagination({
            pageIndex: newPagination.pageIndex,
            rowCount: newPagination.pageSize,
          })
        );
      },
      [dispatch, pageIndex, rowCount]
    );

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
        <Input
          type="text"
          id="search"
          placeholder="Search..."
          className="max-w-sm"
          value={globalFilter}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) => setGlobalFilter(e.target.value)}
        />
      </div>

      <DashboardTableContent
        columns={columns}
        table={table}
        loading={loading}
      />

      <DashboardTablePagination
        table={table}
        loading={loading}
      />
    </div>
  );
});
