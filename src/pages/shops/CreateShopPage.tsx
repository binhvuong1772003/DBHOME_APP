import { CreateShopForm } from '@/features/shop/components/CreateShopForm';
import { Navbar } from '@/components/common/Navbar';
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
