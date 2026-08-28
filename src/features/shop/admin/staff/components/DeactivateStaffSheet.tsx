import { UserX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getStaffName } from "../constants/staff";
import type { Staff } from "../types/staff";

interface DeactivateStaffSheetProps {
  staff: Staff | null;
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
}

export function DeactivateStaffSheet({
  staff,
  open,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: DeactivateStaffSheetProps) {
  if (!staff) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90dvh] rounded-t-xl sm:inset-x-0 sm:mx-auto sm:max-w-lg">
        <SheetHeader className="px-6 py-5 pr-14 text-left">
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <UserX className="size-5" aria-hidden="true" />
          </div>
          <SheetTitle>Deactivate staff member?</SheetTitle>
          <SheetDescription>
            {getStaffName(staff)} will remain in your staff history but will no
            longer be available for new appointments.
          </SheetDescription>
        </SheetHeader>
        <SheetClose asChild>
          <Button type="button" variant="ghost" size="icon-sm" className="absolute right-4 top-4 rounded-full" aria-label="Close confirmation">
            <X aria-hidden="true" />
          </Button>
        </SheetClose>
        <SheetFooter className="border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => void onConfirm()}
          >
            {isSubmitting ? "Deactivating..." : "Deactivate"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
