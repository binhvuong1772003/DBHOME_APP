import { SidebarProvider } from "@/components/ui/sidebar";
import { ShopSideBar } from "../ui/shop-side-bar";
import { Outlet } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { useOffDayNotification } from "@/hooks/useOffDayNotification";
import { useParams } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";
import { useAppointmentNotification } from "@/hooks/useAppointmentNoti";
import { useMemo } from "react";
export default function ShopLayout() {
  const { shopSlug } = useParams();
  const { shops } = useShopContext();
  const currentShop = useMemo(
    () => shops.find((s) => s.slug === shopSlug),
    [shops, shopSlug],
  );
  useSocket(currentShop?.id);
  useOffDayNotification();
  useAppointmentNotification();
  return (
    <SidebarProvider>
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1 overflow-hidden">
          <ShopSideBar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
