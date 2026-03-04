import logo from '@/assets/logo.png';
import { ModeToggle } from '@/components/toggles/mode-toggles';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import mimoAvt from '@/assets/mimoAvt.png';
export const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const avatar = user?.avatarUrl ?? mimoAvt;
  return (
    <div className="absolute top-0 left-0 right-0 bg-card shadow px-6 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="min-w-12 min-h-12 flex items-center justify-center">
          <img src={logo} alt="logo" className="w-25 ml-40" />
        </div>
        <span className="font-extrabold text-xl text-foreground">SHN APP</span>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={avatar} alt={user?.name ?? 'avatar'} />{' '}
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
                  // ✅ Fix
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
