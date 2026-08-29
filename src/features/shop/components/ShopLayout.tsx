import { SidebarProvider } from "@/components/ui/sidebar";
import { ShopSideBar } from "@/features/shop/components/ShopSidebar";
import { Outlet } from "react-router-dom";
import { useSocket } from "@/features/shop/hooks/useSocket";
import { useOffDayNotification } from "@/features/shop/hooks/useOffDayNotification";
import { useParams } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";
import { useAppointmentNotification } from "@/features/shop/hooks/useAppointmentNotification";
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
