import { ModeToggle } from '@/components/common/ModeToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import mimoAvt from '@/assets/mimoAvt.png';
import { useShops } from '@/features/shop/hooks/useShops';

export const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { shops } = useShops();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const avatar = user?.avatarUrl ?? mimoAvt;

  return (
    <div className="w-full bg-card shadow py-1.5 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          className="font-extrabold text-xl"
          onClick={() => navigate('/')}
        >
          SHN APP
        </Button>
        {/* Shop Switcher */}
      </div>

      <div className="flex items-center gap-2 ">
        <LanguageSwitcher />
        <ModeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={avatar} alt={user?.name ?? 'avatar'} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/billing')}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-bold">
                  Shop của bạn
                </DropdownMenuLabel>
                {shops.map((shop) => (
                  <DropdownMenuItem
                    key={shop.id}
                    onClick={() => navigate(`/shops/${shop.slug}`)}
                  >
                    {shop.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={avatar} alt="avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/Auth')}>
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/Auth')}>
                  Sign Up
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
