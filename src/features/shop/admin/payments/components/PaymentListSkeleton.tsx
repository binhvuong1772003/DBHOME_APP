import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentListSkeleton() {
  return (
    <Card className="gap-0 py-0 shadow-sm">
      <CardContent className="space-y-3 p-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-4 border-b py-3 last:border-b-0">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="ml-auto h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
