import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { EmailHeader } from "@/components/email-header";
import { InboxList } from "@/components/inbox-list";
import { EmailPreview } from "@/components/email-preview";
import { EmptyInbox } from "@/components/empty-inbox";
import {
  HeaderSkeleton,
  EmailListSkeleton,
  EmailPreviewSkeleton,
} from "@/components/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Email, Inbox, GenerateEmailResponse } from "@shared/schema";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { toast } = useToast();

  const { data: inbox, isLoading: isLoadingInbox, refetch: refetchInbox, isFetching } = useQuery<Inbox>({
    queryKey: ["/api/inbox", currentEmail],
    queryFn: async () => {
      const res = await fetch(`/api/inbox?email=${encodeURIComponent(currentEmail)}`);
      if (!res.ok) throw new Error("Failed to fetch inbox");
      return res.json();
    },
    enabled: !!currentEmail,
    refetchInterval: 10000,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate");
      return await response.json() as GenerateEmailResponse;
    },
    onSuccess: (data) => {
      setCurrentEmail(data.email);
      setExpiresAt(data.expiresAt);
      setSelectedEmail(null);
      setShowMobilePreview(false);
      localStorage.setItem("tempEmail", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
      toast({
        title: "ایمیل جدید ایجاد شد",
        description: "آدرس ایمیل موقت جدید آماده استفاده است",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "ایجاد ایمیل جدید ممکن نشد",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (emailId: string) => {
      await apiRequest("PATCH", `/api/emails/${emailId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inbox", currentEmail] });
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("tempEmail");
    if (saved) {
      try {
        const data = JSON.parse(saved) as GenerateEmailResponse;
        const expiry = new Date(data.expiresAt).getTime();
        // Check if email has at least 1 minute remaining
        if (expiry > Date.now() + 60000) {
          setCurrentEmail(data.email);
          setExpiresAt(data.expiresAt);
          return;
        } else {
          // Clear expired data
          localStorage.removeItem("tempEmail");
        }
      } catch (e) {
        localStorage.removeItem("tempEmail");
      }
    }
    generateMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-generate new email when current one expires
  useEffect(() => {
    if (!expiresAt) return;

    const checkExpiry = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      
      if (now >= expiry) {
        setSelectedEmail(null);
        generateMutation.mutate();
      }
    };

    // Check immediately
    checkExpiry();
    
    // Check every second
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, generateMutation]);

  const handleSelectEmail = useCallback((email: Email) => {
    setSelectedEmail(email);
    setShowMobilePreview(true);
    if (!email.isRead) {
      markAsReadMutation.mutate(email.id);
    }
  }, [markAsReadMutation]);

  const handleRefresh = useCallback(() => {
    refetchInbox();
  }, [refetchInbox]);

  const handleGenerate = useCallback(() => {
    generateMutation.mutate();
  }, [generateMutation]);

  const handleBackToList = useCallback(() => {
    setShowMobilePreview(false);
  }, []);

  const emails = inbox?.emails || [];

  if (!currentEmail && generateMutation.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderSkeleton />
        <div className="flex h-[calc(100vh-180px)]">
          <div className="w-full md:w-96 border-l border-border">
            <EmailListSkeleton />
          </div>
          <div className="hidden md:block flex-1">
            <EmailPreviewSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <EmailHeader
        email={currentEmail}
        expiresAt={expiresAt}
        onRefresh={handleRefresh}
        onGenerate={handleGenerate}
        isLoading={generateMutation.isPending}
        isRefreshing={isFetching}
      />

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "w-full md:w-96 border-l border-border bg-card flex-shrink-0 overflow-hidden",
            showMobilePreview && "hidden md:block"
          )}
        >
          {isLoadingInbox ? (
            <EmailListSkeleton />
          ) : emails.length === 0 ? (
            <EmptyInbox onRefresh={handleRefresh} isRefreshing={isFetching} />
          ) : (
            <InboxList
              emails={emails}
              selectedId={selectedEmail?.id || null}
              onSelect={handleSelectEmail}
            />
          )}
        </div>

        <div
          className={cn(
            "flex-1 bg-background overflow-hidden",
            !showMobilePreview && "hidden md:block"
          )}
        >
          <EmailPreview
            email={selectedEmail}
            onBack={handleBackToList}
            showBackButton={showMobilePreview}
          />
        </div>
      </div>
    </div>
  );
}
