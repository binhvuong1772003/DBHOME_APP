import { Route } from 'react-router-dom';
import CreateShopPage from '@/pages/shops/CreateShopPage';
import UpdateShopPage from '@/pages/shops/UpdateShopPage';
import DashboardPage from '@/pages/shops/DashBoardPage';
import ShopLayout from '@/components/layouts/ShopLayout';
import ManageServicePage from '@/pages/shops/services/ManageServicePage';
import CreateServicePage from '@/pages/shops/services/CreateServicePage';
export const shopRoutes = () => [
  <Route key="create-shop" path="/shops/create" element={<CreateShopPage />} />,
  <Route
    key="update-shop"
    path="/shops/:shopSlug/edit"
    element={<UpdateShopPage />}
  />,
  <Route key="shop-layout" element={<ShopLayout />}>
    <Route path="/shops/:shopSlug" element={<DashboardPage />} />
    <Route path="/shops/:shopSlug/services" element={<ManageServicePage />} />
    <Route
      path="/shops/:shopSlug/services/create"
      element={<CreateServicePage />}
    />
  </Route>,
];
