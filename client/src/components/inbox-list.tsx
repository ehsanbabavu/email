import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { Mail, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InboxListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (email: Email) => void;
}

export function InboxList({ emails, selectedId, onSelect }: InboxListProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onSelect(email)}
            className={cn(
              "w-full text-right p-4 rounded-lg transition-all duration-200 border",
              selectedId === email.id
                ? "bg-blue-50 border-blue-200 shadow-md"
                : "bg-card hover:bg-card/80 border-card-border hover:border-blue-200/50 hover:shadow-sm"
            )}
            data-testid={`button-email-item-${email.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {email.isRead ? (
                  <MailOpen className={cn("w-5 h-5", selectedId === email.id ? "text-blue-600" : "text-muted-foreground")} />
                ) : (
                  <Mail className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={cn(
                      "text-sm truncate",
                      !email.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                    )}
                    dir="ltr"
                  >
                    {email.fromName || email.from}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 bg-muted/50 px-2 py-1 rounded">
                    {formatDistanceToNow(new Date(email.receivedAt), {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm truncate font-medium",
                    !email.isRead ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {email.subject || "(بدون موضوع)"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-2">
                  {email.body.substring(0, 80)}...
                </p>
              </div>
              {!email.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-2 animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
