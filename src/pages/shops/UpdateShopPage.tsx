import { UpdateShopForm } from '@/components/shops/UpdateShop';
import { Navbar } from '@/components/ui/Navbar';
export default function CreateShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1">
        <UpdateShopForm />
      </div>
    </div>
  );
}
