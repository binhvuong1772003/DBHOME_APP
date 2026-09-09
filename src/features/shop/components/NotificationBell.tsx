import { useMemo, useState } from "react";
import { Bell, CheckCheck, ExternalLink, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useNotification } from "@/features/shop/hooks/useNotification";

interface NotificationBellProps {
  shopSlug?: string;
}

const targetForNotification = (shopSlug: string, type: string, title: string) => {
  const normalizedType = type.toLowerCase();
  const normalizedTitle = title.toLowerCase();
  // The current backend uses its existing OFF_DAY_REQUEST enum for persisted
  // appointment requests, so use the title as a compatibility fallback until
  // an appointment-specific notification type is introduced server-side.
  if (normalizedType === "appointment_request" || normalizedTitle.includes("appointment") || normalizedTitle.includes("đặt lịch")) {
    return `/shops/${shopSlug}/admin/appointments`;
  }
  if (normalizedType === "off_day_request" || normalizedTitle.includes("leave") || normalizedTitle.includes("nghỉ phép")) {
    return `/shops/${shopSlug}/admin/time-off`;
  }
  if (normalizedType === "off_day_response") return `/shops/${shopSlug}/workspace/time-off`;
  return null;
};

export const NotificationBell = ({ shopSlug: shopSlugProp }: NotificationBellProps) => {
  const { t, i18n } = useTranslation("navbar");
  const { shopSlug: routeShopSlug } = useParams();
  const shopSlug = shopSlugProp ?? routeShopSlug;
  const navigate = useNavigate();
  const [status, setStatus] = useState<"all" | "unread">("all");
  const { unreadCount, notifications, markRead, markAllRead, loading, error, retry } = useNotification(shopSlug);
  const filtered = useMemo(() => status === "unread" ? notifications.filter((item) => !item.isRead) : notifications, [notifications, status]);

  if (!shopSlug) return null;

  const formattedUnread = unreadCount > 99 ? "99+" : String(unreadCount);
  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(i18n.resolvedLanguage ?? "vi", { dateStyle: "medium", timeStyle: "short" }).format(date);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative min-h-11 min-w-11" aria-label={t("notifications.label")}>
          <Bell aria-hidden="true" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-destructive px-1 text-[10px] font-semibold leading-5 text-destructive-foreground" aria-label={`${formattedUnread} ${t("notifications.unread").toLowerCase()}`}>{formattedUnread}</span>}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw,26rem)] gap-0 p-0">
        <SheetHeader className="border-b border-border/70 px-5 py-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div><SheetTitle>{t("notifications.title")}</SheetTitle><SheetDescription>{t("notifications.description")}</SheetDescription></div>
            <SheetClose asChild><Button variant="ghost" size="icon" className="min-h-11 min-w-11" aria-label={t("notifications.close")}><X aria-hidden="true" /></Button></SheetClose>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant={status === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setStatus("all")}>{t("notifications.all")}</Button>
            <Button type="button" variant={status === "unread" ? "secondary" : "ghost"} size="sm" onClick={() => setStatus("unread")}>{t("notifications.unread")} {unreadCount > 0 && `(${formattedUnread})`}</Button>
            <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => void markAllRead()} disabled={loading || unreadCount === 0}><CheckCheck className="size-4" aria-hidden="true" />{t("notifications.markAll")}</Button>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" />{t("notifications.title")}…</div> : error ? <div className="flex flex-col items-center gap-3 px-5 py-12 text-center"><p className="text-sm text-destructive">{t("notifications.loadError")}</p><Button type="button" variant="outline" size="sm" onClick={retry}>{t("notifications.retry")}</Button></div> : filtered.length === 0 ? <p className="px-5 py-12 text-center text-sm text-muted-foreground">{status === "unread" ? t("notifications.emptyUnread") : t("notifications.empty")}</p> : <div>{filtered.map((notification) => { const target = targetForNotification(shopSlug, notification.type, notification.title); return <Card key={notification.id} className={`rounded-none border-x-0 border-t-0 border-border/70 py-0 ${notification.isRead ? "opacity-70" : "bg-primary/5"}`}><CardContent className="flex items-start gap-3 px-5 py-4"><div className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.isRead ? "bg-muted-foreground/30" : "bg-primary"}`} aria-hidden="true" /><div className="min-w-0 flex-1"><CardTitle className="text-sm">{notification.title}</CardTitle><CardDescription className="mt-1 text-xs leading-5">{notification.content}</CardDescription><div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><span>{formatTime(notification.createdAt)}</span>{!notification.isRead && <Button type="button" variant="link" size="sm" className="h-auto min-h-0 p-0 text-[11px]" onClick={() => void markRead(notification.id)}>{t("notifications.markRead")}</Button>}{target && <Button type="button" variant="link" size="sm" className="h-auto min-h-0 p-0 text-[11px]" onClick={() => { void markRead(notification.id); navigate(target); }}>{t("notifications.open")} <ExternalLink className="size-3" aria-hidden="true" /></Button>}</div></div></CardContent></Card>; })}</div>}
        </div>
      </SheetContent>
    </Sheet>
  );
};
