import React, {
  useCallback,
  useMemo,
} from "react";
import {
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
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
import { useFetchSpells } from "@/hooks/useFetchSpells";
import { useFetchSpellDetails } from "@/hooks/useFetchSpellDetails";
import { useDashboardTable } from "@/hooks/useDashboardTable";

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



  useFetchSpells(dispatch, allSpells, loading.allSpells);

  useFetchSpellDetails(
    dispatch,
    missingSpellIndexes,
    loading.spellDetails
  );

  const table = useDashboardTable(
    paginatedSpells,
    columns,
    pageIndex,
    rowCount,
    globalFilter,
    handlePaginationChange
  );

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