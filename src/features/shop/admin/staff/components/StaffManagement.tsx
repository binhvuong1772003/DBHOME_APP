import { DeactivateStaffSheet } from "./DeactivateStaffSheet";
import { StaffDirectory } from "./StaffDirectory";
import { StaffFormSheet } from "./StaffFormSheet";
import { StaffManagementHeader } from "./StaffManagementHeader";
import { StaffStats } from "./StaffStats";
import { StaffScheduleSheet } from "./StaffScheduleSheet";
import { StaffToolbar } from "./StaffToolbar";
import { useStaffManagement } from "../hooks/useStaffManagement";
import { useNavigate, useParams } from "react-router-dom";

export default function StaffManagement() {
  const navigate = useNavigate();
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const {
    pagination,
    paginatedStaffs,
    stats,
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
    totalPages,
    rangeStart,
    rangeEnd,
    isLoading,
    isActionLoading,
    error,
    reload,
    canInvite,
    canChangeRole,
    canEditStaff,
    mode,
    selectedStaff,
    openCreate,
    openEdit,
    openSchedule,
    openDeactivate,
    closeDialog,
    handleInvite,
    handleEdit,
    handleDeactivate,
  } = useStaffManagement();

  const handleOpenChange = (open: boolean) => {
    if (!open) closeDialog();
  };

  return (
    <main className="min-h-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <StaffManagementHeader
          canAddStaff={canInvite}
          onAddStaff={openCreate}
        />

        <StaffStats stats={stats} />

        <StaffToolbar
          search={search}
          role={role}
          status={status}
          sort={sort}
          viewMode={viewMode}
          onSearchChange={setSearch}
          onRoleChange={setRole}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onViewModeChange={setViewMode}
        />

        <StaffDirectory
          staffs={paginatedStaffs}
          totalStaffs={pagination.total}
          filteredCount={pagination.total}
          isLoading={isLoading}
          error={error}
          viewMode={viewMode}
          canAdd={canInvite}
          canEdit={canEditStaff}
          canDeactivate={canEditStaff}
          page={page}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onPageChange={setPage}
          onAddStaff={openCreate}
          onRetry={() => void reload()}
          onView={(staff) => navigate(`/shops/${shopSlug}/admin/staff/${staff.id}`)}
          onViewSchedule={openSchedule}
          onEdit={openEdit}
          onDeactivate={openDeactivate}
        />
      </div>

      {(mode === "CREATE" || mode === "EDIT") && (
        <StaffFormSheet
          mode={mode}
          staff={selectedStaff}
          open
          canChangeRole={canChangeRole}
          isSubmitting={isActionLoading}
          onOpenChange={handleOpenChange}
          onInvite={handleInvite}
          onUpdate={handleEdit}
        />
      )}

      <StaffScheduleSheet
        staff={selectedStaff}
        open={mode === "SCHEDULE"}
        onOpenChange={handleOpenChange}
      />

      <DeactivateStaffSheet
        staff={selectedStaff}
        open={mode === "DEACTIVATE"}
        isSubmitting={isActionLoading}
        onOpenChange={handleOpenChange}
        onConfirm={handleDeactivate}
      />
    </main>
  );
}
