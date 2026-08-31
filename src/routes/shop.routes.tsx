import { Outlet, Route } from "react-router-dom";
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
import {
  WorkspaceAccess,
  WorkspaceShell,
} from "@/features/shop/workspace/components/WorkspaceShell";
import {
  AttendancePage,
  PayrollPage,
  ProfilePage,
  SchedulePage,
  TimeOffPage,
  WorkspacePage,
  WorkSchedulePage,
} from "@/pages/shops/workspace";
import { ShopMembershipProvider } from "@/context/ShopMembershipContext";
import StaffSchedulePage from "@/pages/shops/admin/workforce/StaffSchedulePage";
import TimeOffManagementPage from "@/pages/shops/admin/workforce/TimeOffManagementPage";
import { ShopManagerRoute } from "@/components/common/routes/ShopManagerRoute";
import PayrollManagementPage from "@/pages/shops/admin/payroll/PayrollManagementPage";
import PayrollDetailPage from "@/pages/shops/admin/payroll/PayrollDetailPage";
import FinancialReportPage from "@/features/shop/admin/financial-report/pages/FinancialReportPage";
import StaffDetailPage from "@/pages/shops/admin/staff/StaffDetailPage";
import PaymentsPage from "@/pages/shops/admin/payments/PaymentsPage";
export const shopRoutes = () => [
  <Route key="create-shop" path="/shops/create" element={<CreateShopPage />} />,
  <Route
    key="shop-membership"
    path="/shops/:shopSlug"
    element={
      <ShopMembershipProvider>
        <Outlet />
      </ShopMembershipProvider>
    }
  >
    <Route element={<ShopAccessRoute />}>
      <Route path="edit" element={<UpdateShopPage />} />
      <Route path="admin">
        <Route element={<ShopLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="services" element={<ManageServicePage />} />
          <Route path="services/create" element={<CreateServicePage />} />
          <Route path="appointments" element={<ManageAppointmentsPage />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route element={<ShopManagerRoute />}>
            <Route path="staff/:staffId" element={<StaffDetailPage />} />
            <Route path="staff-schedule" element={<StaffSchedulePage />} />
            <Route path="time-off" element={<TimeOffManagementPage />} />
            <Route path="payroll" element={<PayrollManagementPage />} />
            <Route path="payroll/:payrollId" element={<PayrollDetailPage />} />
            <Route path="financial-report" element={<FinancialReportPage />} />
            <Route path="payments" element={<PaymentsPage />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="workspace">
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
      </Route>
    </Route>
  </Route>,
];
