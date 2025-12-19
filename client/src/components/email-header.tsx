import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw, Mail, Clock, Send } from "lucide-react";
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
  onSendEmail?: () => void;
}

export function EmailHeader({
  email,
  expiresAt,
  onRefresh,
  onGenerate,
  isLoading,
  isRefreshing,
  onSendEmail,
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
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 border-b border-blue-700/50">
      <div className="p-4 md:p-5">
        <div className="space-y-3">
          {/* Header Row: Title and Timer */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight" data-testid="text-app-title">
                  ایمیل موقت
                </h1>
                <p className="text-blue-100 text-xs mt-0.5" data-testid="text-app-description">
                  ایمیل یک‌بار مصرف برای حفظ حریم خصوصی
                </p>
              </div>
            </div>

            {timeRemaining && (
              <Badge className="gap-1.5 bg-white/25 backdrop-blur-sm text-white border border-white/40 hover:bg-white/35 flex-shrink-0 px-3 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span data-testid="text-timer" className="font-mono font-bold text-xs">{timeRemaining}</span>
              </Badge>
            )}
          </div>

          {/* Email Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-lg px-3 py-3 border border-white/30 hover:bg-white/20 transition-all duration-200">
              <span
                className="flex-1 font-mono text-sm select-all truncate text-white"
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
                className="text-white hover:bg-white/30 flex-shrink-0 h-8 w-8"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-300" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Button
              onClick={onSendEmail}
              disabled={!email}
              className="gap-1.5 bg-green-500 text-white hover:bg-green-600 font-semibold shadow-lg hover:shadow-xl transition-all py-3 px-4 rounded-lg md:flex-shrink-0"
              size="sm"
              aria-label="ارسال ایمیل تست"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">ارسال ایمیل</span>
            </Button>

            <Button
              onClick={onGenerate}
              disabled={isLoading}
              data-testid="button-generate"
              className="gap-1.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all py-3 px-4 rounded-lg md:flex-shrink-0"
              size="sm"
            >
              <Mail className="w-4 h-4" />
              <span>ایمیل جدید</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
