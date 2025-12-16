import { Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyInboxProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function EmptyInbox({ onRefresh, isRefreshing }: EmptyInboxProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Inbox className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">صندوق ورودی خالی است</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6" data-testid="text-empty-description">
        هنوز ایمیلی دریافت نشده است. آدرس ایمیل بالا را کپی کنید و در جایی که
        نیاز دارید استفاده کنید
      </p>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="gap-2"
        data-testid="button-refresh-empty"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        بررسی ایمیل جدید
      </Button>

      <div className="mt-8 p-4 rounded-md bg-muted/50 max-w-sm">
        <h4 className="font-medium text-sm mb-2">راهنمای استفاده:</h4>
        <ul className="text-xs text-muted-foreground space-y-1 text-right">
          <li>۱. آدرس ایمیل بالا را کپی کنید</li>
          <li>۲. در هر وب‌سایتی که نیاز به ایمیل دارید استفاده کنید</li>
          <li>۳. ایمیل‌های دریافتی اینجا نمایش داده می‌شوند</li>
          <li>۴. ایمیل پس از ۱۵ دقیقه منقضی می‌شود</li>
        </ul>
      </div>
    </div>
  );
}
