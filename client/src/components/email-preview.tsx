import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Email } from "@shared/schema";

interface EmailPreviewProps {
  email: Email | null;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function EmailPreview({ email, onBack, showBackButton }: EmailPreviewProps) {
  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 border border-blue-200/50">
          <ArrowLeft className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground" data-testid="text-no-email-title">ایمیلی انتخاب نشده</h3>
        <p className="text-sm text-muted-foreground max-w-xs" data-testid="text-no-email-description">
          برای مشاهده محتوای ایمیل، یکی از ایمیل‌های لیست سمت راست را انتخاب کنید
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-blue-50/30">
      <div className="p-4 md:p-6 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 gap-2 hover:bg-blue-100/50"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست
          </Button>
        )}

        <h2
          className="text-2xl font-bold mb-4 text-foreground"
          data-testid="text-email-subject"
        >
          {email.subject || "(بدون موضوع)"}
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100/50">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground" data-testid="text-sender-name">
                {email.fromName || "فرستنده ناشناس"}
              </p>
              <p
                className="text-sm text-muted-foreground truncate"
                dir="ltr"
                data-testid="text-sender-email"
              >
                {email.from}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span data-testid="text-email-date">
              {format(new Date(email.receivedAt), "d MMMM yyyy، HH:mm", {
                locale: faIR,
              })}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {email.html ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dir="auto"
              dangerouslySetInnerHTML={{ __html: email.html }}
              data-testid="email-content-html"
            />
          ) : (
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed"
              dir="auto"
              data-testid="email-content-text"
            >
              {email.body}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
