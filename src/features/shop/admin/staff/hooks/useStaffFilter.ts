import { useCallback, useMemo, useState } from "react";
import {
  getStaffEmail,
  getStaffName,
  getStaffRevenue,
  getStaffStatus,
  PAGE_SIZE,
} from "../constants/staff";
import type {
  Staff,
  StaffRoleFilter,
  StaffSort,
  StaffStatusFilter,
  StaffViewMode,
} from "../types/staff";

export const useStaffFilter = (staffs: Staff[]) => {
  const [search, setSearchState] = useState("");
  const [role, setRoleState] = useState<StaffRoleFilter>("ALL");
  const [status, setStatusState] = useState<StaffStatusFilter>("ALL");
  const [sort, setSortState] = useState<StaffSort>("RECENT");
  const [pageState, setPageState] = useState(1);
  const [viewMode, setViewMode] = useState<StaffViewMode>("LIST");

  const filteredStaffs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return staffs
      .filter((staff) => {
        const matchesSearch =
          !query ||
          getStaffName(staff).toLocaleLowerCase().includes(query) ||
          getStaffEmail(staff).toLocaleLowerCase().includes(query) ||
          staff.user?.phone?.toLocaleLowerCase().includes(query);
        const matchesRole = role === "ALL" || staff.role === role;
        const matchesStatus =
          status === "ALL" || getStaffStatus(staff) === status;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((left, right) => {
        if (sort === "NAME_ASC") {
          return getStaffName(left).localeCompare(getStaffName(right));
        }
        if (sort === "NAME_DESC") {
          return getStaffName(right).localeCompare(getStaffName(left));
        }
        if (sort === "REVENUE") {
          return (getStaffRevenue(right) ?? 0) - (getStaffRevenue(left) ?? 0);
        }
        return (
          new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime()
        );
      });
  }, [role, search, sort, staffs, status]);

  const totalPages = Math.max(1, Math.ceil(filteredStaffs.length / PAGE_SIZE));
  const page = Math.min(pageState, totalPages);
  const paginatedStaffs = useMemo(
    () => filteredStaffs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredStaffs, page],
  );
  const rangeStart =
    filteredStaffs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredStaffs.length);

  const resetPage = useCallback(() => setPageState(1), []);
  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value);
      resetPage();
    },
    [resetPage],
  );
  const setRole = useCallback(
    (value: StaffRoleFilter) => {
      setRoleState(value);
      resetPage();
    },
    [resetPage],
  );
  const setStatus = useCallback(
    (value: StaffStatusFilter) => {
      setStatusState(value);
      resetPage();
    },
    [resetPage],
  );
  const setSort = useCallback(
    (value: StaffSort) => {
      setSortState(value);
      resetPage();
    },
    [resetPage],
  );
  const setPage = useCallback(
    (value: number) => {
      setPageState(Math.min(totalPages, Math.max(1, Math.trunc(value))));
    },
    [totalPages],
  );

  return {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    sort,
    setSort,
    page,
    setPage,
    viewMode,
    setViewMode,
    filteredStaffs,
    paginatedStaffs,
    totalPages,
    rangeStart,
    rangeEnd,
  };
};
