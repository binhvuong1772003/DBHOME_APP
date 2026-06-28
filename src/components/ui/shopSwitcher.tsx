import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface Shop {
  id: string;
  name: string;
  slug: string;
  logoURl?: string | null;
}
interface ShopSwitcherProps {
  shops: Shop[];
  currentShop: Shop;
  onSwitch: (shop: Shop) => void;
}
export const ShopSwitcher = ({
  shops,
  currentShop,
  onSwitch,
}: ShopSwitcherProps) => {
  const navigate = useNavigate();
  return (
    <Select
      value={currentShop?.slug}
      onValueChange={(slug) => {
        if (slug === 'create') {
          navigate('/shops/create');
          return;
        }
        const shop = shops.find((s) => s.slug === slug);
        if (shop) {
          onSwitch(shop);
          navigate(`/shops/${shop.slug}`);
        }
      }}
    >
      <SelectTrigger className="w-44 rounded-full border border-border bg-background px-4 focus:ring-0 text-sm font-medium text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl p-1">
        <p className="text-xs text-muted-foreground px-2 py-1">Shops của bạn</p>
        {shops.map((shop) => (
          <SelectItem
            key={shop.id}
            value={shop.slug}
            className="rounded-lg text-sm"
          >
            <span className="flex items-center gap-2">
              <span>{shop.name}</span>
            </span>
          </SelectItem>
        ))}
        <div className="h-px bg-border mx-2 my-1" />
        <SelectItem
          value="create"
          className="rounded-lg text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span>+</span>
            <span>Tạo shop mới</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
