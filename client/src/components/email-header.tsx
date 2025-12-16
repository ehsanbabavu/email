import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface EmailHeaderProps {
  email: string;
  expiresAt: string;
  onRefresh: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
}

export function EmailHeader({
  email,
  expiresAt,
  onRefresh,
  onGenerate,
  isLoading,
  isRefreshing,
}: EmailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining("منقضی شده");
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast({
        title: "کپی شد!",
        description: "آدرس ایمیل در کلیپ‌بورد کپی شد",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "خطا",
        description: "کپی کردن ایمیل ممکن نشد",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card border-b border-card-border">
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold" data-testid="text-app-title">ایمیل موقت</h1>
                <p className="text-sm text-muted-foreground" data-testid="text-app-description">
                  ایمیل یک‌بار مصرف برای حفظ حریم خصوصی
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {timeRemaining && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  <span data-testid="text-timer">{timeRemaining}</span>
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-md p-3 border border-border">
              <span
                className="flex-1 font-mono text-base md:text-lg select-all truncate"
                dir="ltr"
                data-testid="text-email-address"
              >
                {email || "در حال ایجاد..."}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={copyToClipboard}
                disabled={!email}
                data-testid="button-copy-email"
                aria-label="کپی کردن ایمیل"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={isRefreshing || !email}
                data-testid="button-refresh"
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">بررسی ایمیل</span>
              </Button>
              <Button
                onClick={onGenerate}
                disabled={isLoading}
                data-testid="button-generate"
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>ایمیل جدید</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
