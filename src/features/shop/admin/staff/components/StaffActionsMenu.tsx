import {
  CalendarDays,
  Clock3,
  Eye,
  MoreHorizontal,
  Pencil,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStaffName } from "../constants/staff";
import type { Staff } from "../types/staff";
import { useTranslation } from "react-i18next";

interface StaffActionsMenuProps {
  staff: Staff;
  canEdit: boolean;
  canDeactivate: boolean;
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDeactivate: (staff: Staff) => void;
}

export function StaffActionsMenu({
  staff,
  canEdit,
  canDeactivate,
  onView,
  onEdit,
  onDeactivate,
}: StaffActionsMenuProps) {
  const { t } = useTranslation("staff");
  const staffName = getStaffName(staff);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("actions.label", { name: staffName })}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t("actions.title")}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onView(staff)}>
          <Eye aria-hidden="true" />
          {t("actions.viewProfile")}
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem onSelect={() => onEdit(staff)}>
            <Pencil aria-hidden="true" />
            {t("actions.edit")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => onView(staff)}>
          <CalendarDays aria-hidden="true" />
          {t("actions.viewSchedule")}
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem onSelect={() => onEdit(staff)}>
            <Clock3 aria-hidden="true" />
            {t("actions.availability")}
          </DropdownMenuItem>
        )}
        {canDeactivate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={!staff.isActive}
              onSelect={() => onDeactivate(staff)}
            >
              <UserX aria-hidden="true" />
              {t("actions.deactivate")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
