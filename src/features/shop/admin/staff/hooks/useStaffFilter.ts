import { useCallback, useEffect, useState } from "react";
import type { StaffRoleFilter, StaffSort, StaffStatusFilter, StaffViewMode } from "../types/staff";

// Filtering and pagination are server-side. This hook only owns toolbar state.
export const useStaffFilter = () => {
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRoleState] = useState<StaffRoleFilter>("ALL");
  const [status, setStatusState] = useState<StaffStatusFilter>("ALL");
  const [sort, setSortState] = useState<StaffSort>("RECENT");
  const [page, setPageState] = useState(1);
  const [viewMode, setViewMode] = useState<StaffViewMode>("LIST");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const resetPage = useCallback(() => setPageState(1), []);
  const setSearch = useCallback((value: string) => { setSearchState(value); resetPage(); }, [resetPage]);
  const setRole = useCallback((value: StaffRoleFilter) => { setRoleState(value); resetPage(); }, [resetPage]);
  const setStatus = useCallback((value: StaffStatusFilter) => { setStatusState(value); resetPage(); }, [resetPage]);
  const setSort = useCallback((value: StaffSort) => { setSortState(value); resetPage(); }, [resetPage]);
  const setPage = useCallback((value: number) => setPageState(Math.max(1, Math.trunc(value))), []);

  return { search, debouncedSearch, setSearch, role, setRole, status, setStatus, sort, setSort, page, setPage, viewMode, setViewMode };
};
