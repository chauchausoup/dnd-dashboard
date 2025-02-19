import React, {
  FC,
  useState,
  memo,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
  fetchAllSpells,
  fetchSpellDetails,
} from "@/store/spellsSlice";

import { DashboardTableColumn } from "./DashboardTableColumn";
import { DashboardTablePagination } from "./DashboardTablePagination";
import { DashboardTableContent } from "./DashboardTableContent";
import { useDashboardTable } from "@/hooks/useDashboardTable";
import { useLocation, useNavigate } from "react-router";

export const DashboardTable: FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

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
    const dispatchedSpellDetailsRef = React.useRef<Set<string>>(new Set());
  
    // on mount: fetch all spells if not loaded
    useEffect(() => {
      if (allSpells.length === 0 && !loading.allSpells) {
        dispatch(fetchAllSpells());
      }
    }, [allSpells, loading.allSpells, dispatch]);
  
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

  const columns = useMemo(() => DashboardTableColumn(), []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlPageIndex = params.get("page");
    const urlRowSize = params.get("rowCount");

    if (urlPageIndex && urlRowSize) {
      const parsedPageIndex = parseInt(urlPageIndex, 10);
      const parsedRowSize = parseInt(urlRowSize, 10);

      if (!isNaN(parsedPageIndex) && !isNaN(parsedRowSize)) {
        dispatch(setPagination({ pageIndex: parsedPageIndex-1, rowCount: parsedRowSize }));
      }
    }
  }, [dispatch, location.search]);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      params.set("page", String(pageIndex + 1));
      params.set("rowCount", String(rowCount));
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [pageIndex, rowCount, location.pathname, navigate, location.search]);
  
    interface PaginationUpdater {
      pageIndex: number;
      pageSize: number;
    }
  
    type UpdaterFunction = (pagination: PaginationUpdater) => PaginationUpdater;

    
  // use useCallback for pagination handling
  const handlePaginationChange = useCallback(
    (updater: PaginationUpdater | UpdaterFunction) => {
      const newPagination =
        typeof updater === "function"
          ? (updater as UpdaterFunction)({ pageIndex, pageSize: rowCount })
          : (updater as PaginationUpdater);

      dispatch(setPagination({
        pageIndex: newPagination.pageIndex,
        rowCount: newPagination.pageSize,
      }));
    },
    [dispatch, rowCount, pageIndex]
  );

  const table = useDashboardTable(
    paginatedSpells,
    allSpells,
    columns,
    pageIndex,
    rowCount,
    globalFilter,
    setGlobalFilter,
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