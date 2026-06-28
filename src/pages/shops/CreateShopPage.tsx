import { CreateShopForm } from '@/components/shops/CreateShop';
import { Navbar } from '@/components/ui/Navbar';
export default function CreateShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1">
        <CreateShopForm />
      </div>
    </div>
  );
}
