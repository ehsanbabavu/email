import { Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyInboxProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function EmptyInbox({ onRefresh, isRefreshing }: EmptyInboxProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-blue-50/50 to-transparent">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 border-2 border-blue-200/50">
        <Inbox className="w-12 h-12 text-blue-400" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-foreground" data-testid="text-empty-title">صندوق ورودی خالی است</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-8" data-testid="text-empty-description">
        هنوز ایمیلی دریافت نشده است. آدرس ایمیل بالا را کپی کنید و در جایی که
        نیاز دارید استفاده کنید
      </p>
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all mb-8"
        data-testid="button-refresh-empty"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        بررسی ایمیل جدید
      </Button>

      <div className="w-full max-w-sm p-5 rounded-xl bg-gradient-to-br from-blue-50/80 to-white border border-blue-200/50">
        <h4 className="font-bold text-sm mb-3 text-foreground">راهنمای استفاده:</h4>
        <ul className="text-xs text-muted-foreground space-y-2 text-right">
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 flex-shrink-0">۱</span>
            <span>آدرس ایمیل بالا را کپی کنید</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 flex-shrink-0">۲</span>
            <span>در هر وب‌سایتی که نیاز به ایمیل دارید استفاده کنید</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 flex-shrink-0">۳</span>
            <span>ایمیل‌های دریافتی اینجا نمایش داده می‌شوند</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 flex-shrink-0">۴</span>
            <span>ایمیل پس از ۱۵ دقیقه منقضی می‌شود</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
