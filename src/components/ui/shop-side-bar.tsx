import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenu,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './button';
import { DropdownMenu, DropdownMenuTrigger } from './dropdown-menu';
import { useShops } from '@/hooks/useShops';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ModeToggle } from '../toggles/mode-toggles';
import { NotificationBell } from './notification-bell';
const items = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '' },
  { title: 'Lịch hẹn', icon: Calendar, path: '/appointments' },
  { title: 'Dịch vụ', icon: Scissors, path: '/services' },
  { title: 'Nhân viên', icon: Users, path: '/staff' },
  { title: 'Cài đặt', icon: Settings, path: '/settings' },
];
const financeItems = [
  { tittle: 'Thanh toán', icon: LayoutDashboard, path: '/payments' },
  { tittle: 'Lương & Hoa hồng', icon: LayoutDashboard, path: '/wage' },
];
export const ShopSideBar = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const { shops, currentShop, onSwitch } = useShops();
  const { user } = useAuth();

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="[&_[data-slot='sidebar-inner']]:bg-card"
      >
        <SidebarHeader className="p-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Button
              className="font-extrabold text-xl  group-data-[collapsible=icon]:hidden"
              onClick={() => navigate('/')}
            >
              SHN APP
            </Button>
            <SidebarTrigger className="m1-auto " />
          </div>
          <SidebarMenu>
            <SidebarMenuButton></SidebarMenuButton>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full"
                    tooltip={currentShop?.name}
                  >
                    {/* Icon luôn hiển thị */}
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-base flex-shrink-0">
                      💅
                    </div>
                    {/* Tên + chevron ẩn khi thu nhỏ */}
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium truncate">
                        {currentShop?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentShop?.type}
                      </p>
                    </div>
                    <ChevronsUpDown className="ml-auto w-4 h-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="space-y-1">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Shops
                  </DropdownMenuLabel>
                  {shops.map((shop) => (
                    <DropdownMenuItem
                      key={shop.id}
                      onClick={() => {
                        onSwitch(shop);
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Dropdown</Button>
                        </DropdownMenuTrigger>;
                      }}
                    >
                      {shop.name}
                      {shop.id === currentShop?.id && (
                        <Check className="w-4 h-4 ml-auto text-secondary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => navigate(`/shops/${shopSlug}${item.path}`)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Tài chính</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {financeItems.map((item) => (
                  <SidebarMenuItem key={item.tittle}>
                    <SidebarMenuButton
                      tooltip={item.tittle}
                      onClick={() => navigate(`/shops/${shopSlug}${item.path}`)}
                    >
                      <item.icon />
                      <span>{item.tittle}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <ModeToggle></ModeToggle>
            <NotificationBell></NotificationBell>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user?.name?.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <ChevronsUpDown className="ml-auto w-4 h-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-60">
                  <DropdownMenuItem>
                    <div>
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs truncate text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator></DropdownMenuSeparator>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                  <DropdownMenuSeparator></DropdownMenuSeparator>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
