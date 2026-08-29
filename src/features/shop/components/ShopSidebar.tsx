import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useShops } from "@/features/shop/hooks/useShops";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ModeToggle } from "@/components/common/ModeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NotificationBell } from "@/features/shop/components/NotificationBell";

const items = [
  { title: "Dashboard", icon: LayoutDashboard, path: "" },
  { title: "Lịch hẹn", icon: Calendar, path: "/appointments" },
  { title: "Dịch vụ", icon: Scissors, path: "/services" },
  { title: "Nhân viên", icon: Users, path: "/staff" },
  { title: "Cài đặt", icon: Settings, path: "/settings" },
];

const financeItems = [
  { title: "Thanh toán", icon: Wallet, path: "/payments" },
  { title: "Lương & Hoa hồng", icon: Wallet, path: "/wage" },
];

// Nút menu: chữ xám mảnh khi thường, hồng đậm + nền hồng nhạt + thanh trái
// khi active — khớp đúng bản HTML mockup (font 13.5px/450, không phải mặc
// định của SidebarMenuButton).
const menuButtonClass =
  "h-auto py-2.5 min-w-0 text-[13.5px] font-[450] tracking-tight !text-muted-foreground " +
  "data-[active=true]:!text-primary data-[active=true]:bg-primary/10 data-[active=true]:font-semibold " +
  "relative data-[active=true]:before:content-[''] data-[active=true]:before:absolute " +
  "data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 " +
  "data-[active=true]:before:w-[3px] data-[active=true]:before:bg-primary data-[active=true]:before:rounded-r-full";

// Icon luôn giữ màu đen/foreground cố định — KHÔNG ăn theo màu hồng của
// item active, đúng như bản HTML mockup cuối cùng (icon đen, chỉ chữ+thanh đổi màu).
const iconClass = "text-foreground shrink-0";

export const ShopSideBar = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { shops, currentShop, setCurrentShop } = useShops();
  const { user } = useAuth();

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="overflow-x-hidden [&_[data-slot='sidebar-inner']]:bg-card"
      >
        <SidebarHeader className="p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {/* Logo mark — thay cho <Button> chữ cũ, khớp mockup: icon
                gradient hồng + chữ tên app màu primary */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                S
              </div>
              <span className="text-[17px] font-extrabold tracking-wide text-primary group-data-[collapsible=icon]:hidden">
                SHN APP
              </span>
            </button>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full"
                    tooltip={currentShop?.name}
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-base flex-shrink-0">
                      💅
                    </div>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium truncate">
                        {currentShop?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Nail salon
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
                        setCurrentShop(shop);
                        navigate(`/shops/${shop.slug}/admin`);
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

        <SidebarContent className="px-2 overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                  const fullPath = `/shops/${shopSlug}/admin${item.path}`;
                  const isActive = location.pathname === fullPath;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className={menuButtonClass}
                        onClick={() => navigate(fullPath)}
                      >
                        <item.icon strokeWidth={2.25} className={iconClass} />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-3.5 mx-1" />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {financeItems.map((item) => {
                  const fullPath = `/shops/${shopSlug}${item.path}`;
                  const isActive = location.pathname === fullPath;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className={menuButtonClass}
                        onClick={() => navigate(fullPath)}
                      >
                        <item.icon strokeWidth={2.25} className={iconClass} />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t pt-2">
          <div className="flex items-center gap-2 px-1">
            <LanguageSwitcher />
            <ModeToggle />
            <NotificationBell />
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        user?.name?.slice(0, 2).toUpperCase()
                      )}
                    </div>
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
