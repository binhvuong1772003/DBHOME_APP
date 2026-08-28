import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffManagementHeaderProps {
  canAddStaff: boolean;
  onAddStaff: () => void;
}

export function StaffManagementHeader({
  canAddStaff,
  onAddStaff,
}: StaffManagementHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <Users className="size-3.5" aria-hidden="true" />
          Team workspace
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Staff</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Manage your nail technicians, receptionists, and salon team.
        </p>
      </div>
      {canAddStaff && (
        <Button
          type="button"
          className="h-10 w-full rounded-lg px-4 sm:w-auto"
          onClick={onAddStaff}
        >
          <Plus aria-hidden="true" />
          Add Staff
        </Button>
      )}
    </header>
  );
}
