import { UpdateShopForm } from '@/features/shop/components/UpdateShopForm';
import { Navbar } from '@/components/common/Navbar';
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
