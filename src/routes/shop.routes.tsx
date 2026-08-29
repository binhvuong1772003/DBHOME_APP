import { Route } from "react-router-dom";
import CreateShopPage from "@/pages/shops/CreateShopPage";
import UpdateShopPage from "@/pages/shops/UpdateShopPage";
import DashboardPage from "@/pages/shops/DashBoardPage";
import ShopLayout from "@/features/shop/components/ShopLayout";
import ManageServicePage from "@/pages/shops/services/ManageServicePage";
import CreateServicePage from "@/pages/shops/services/CreateServicePage";
import ManageAppointmentsPage from "@/pages/shops/admin/appointments/ManageApointments";
import StaffManagement from "@/features/shop/admin/staff/components/StaffManagement";
import SettingsPage from "@/pages/shops/admin/settings/SettingsPage";
import { ShopAccessRoute } from "@/components/common/routes/ShopAccessRoute";
import { WorkspaceAccess, WorkspaceShell } from "@/features/shop/workspace/components/WorkspaceShell";
import {
  AttendancePage,
  PayrollPage,
  ProfilePage,
  SchedulePage,
  TimeOffPage,
  WorkspacePage,
  WorkSchedulePage,
} from "@/pages/shops/workspace";
export const shopRoutes = () => [
  <Route key="create-shop" path="/shops/create" element={<CreateShopPage />} />,
  <Route
    key="update-shop"
    path="/shops/:shopSlug/edit"
    element={
      <ShopAccessRoute>
        <UpdateShopPage />
      </ShopAccessRoute>
    }
  />,
  <Route
    key="shop-layout"
    path="/shops/:shopSlug/admin"
    element={<ShopAccessRoute />}
  >
    <Route element={<ShopLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="services" element={<ManageServicePage />} />
      <Route path="services/create" element={<CreateServicePage />} />
      <Route path="appointments" element={<ManageAppointmentsPage />} />
      <Route path="staff" element={<StaffManagement />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Route>,
  <Route key="shop-workspace" path="/shops/:shopSlug/workspace" element={<ShopAccessRoute />}>
    <Route element={<WorkspaceAccess />}>
      <Route element={<WorkspaceShell />}>
        <Route index element={<WorkspacePage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="work-schedule" element={<WorkSchedulePage />} />
        <Route path="working-hours" element={<WorkSchedulePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="time-off" element={<TimeOffPage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Route>
  </Route>,
];
