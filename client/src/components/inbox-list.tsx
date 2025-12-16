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
      <div className="p-2 space-y-1">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onSelect(email)}
            className={cn(
              "w-full text-right p-3 rounded-md transition-colors hover-elevate active-elevate-2",
              selectedId === email.id
                ? "bg-accent"
                : "bg-transparent"
            )}
            data-testid={`button-email-item-${email.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {email.isRead ? (
                  <MailOpen className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Mail className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={cn(
                      "text-sm truncate",
                      !email.isRead && "font-semibold"
                    )}
                    dir="ltr"
                  >
                    {email.fromName || email.from}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(email.receivedAt), {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm truncate",
                    !email.isRead ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {email.subject || "(بدون موضوع)"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {email.body.substring(0, 80)}...
                </p>
              </div>
              {!email.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
