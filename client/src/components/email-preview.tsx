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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ArrowLeft className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2" data-testid="text-no-email-title">ایمیلی انتخاب نشده</h3>
        <p className="text-sm text-muted-foreground max-w-xs" data-testid="text-no-email-description">
          برای مشاهده محتوای ایمیل، یکی از ایمیل‌های لیست سمت راست را انتخاب کنید
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-border">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست
          </Button>
        )}

        <h2
          className="text-xl font-semibold mb-4"
          data-testid="text-email-subject"
        >
          {email.subject || "(بدون موضوع)"}
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium" data-testid="text-sender-name">
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

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
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
