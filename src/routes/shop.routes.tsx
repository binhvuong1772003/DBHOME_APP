import { Route } from "react-router-dom";
import CreateShopPage from "@/pages/shops/CreateShopPage";
import UpdateShopPage from "@/pages/shops/UpdateShopPage";
import DashboardPage from "@/pages/shops/DashBoardPage";
import ShopLayout from "@/components/layouts/ShopLayout";
import ManageServicePage from "@/pages/shops/services/ManageServicePage";
import CreateServicePage from "@/pages/shops/services/CreateServicePage";
import ManageAppointmentsPage from "@/pages/shops/admin/appointments/ManageApointments";
import StaffManagement from "@/features/shop/admin/staff/components/StaffManagement";
import SettingsPage from "@/pages/shops/admin/settings/SettingsPage";
export const shopRoutes = () => [
  <Route key="create-shop" path="/shops/create" element={<CreateShopPage />} />,
  <Route
    key="update-shop"
    path="/shops/:shopSlug/edit"
    element={<UpdateShopPage />}
  />,
  <Route
    key="shop-layout"
    path="/shops/:shopSlug/admin"
    element={<ShopLayout />}
  >
    <Route index element={<DashboardPage />} />
    <Route path="services" element={<ManageServicePage />} />
    <Route path="services/create" element={<CreateServicePage />} />
    <Route path="appointments" element={<ManageAppointmentsPage />} />
    <Route path="staff" element={<StaffManagement />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>,
];
