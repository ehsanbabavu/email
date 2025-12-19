import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail: string;
  senderEmail?: string;
  onEmailSent?: () => void;
}

export function SendEmailDialog({
  open,
  onOpenChange,
  recipientEmail,
  senderEmail = "demo@example.com",
  onEmailSent,
}: SendEmailDialogProps) {
  const [formData, setFormData] = useState({
    from: senderEmail,
    fromName: "تست فرستنده",
    subject: "",
    body: "",
  });

  const { toast } = useToast();

  // Update sender email when it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      from: senderEmail,
    }));
  }, [senderEmail, open]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/demo/send-email", {
        to: recipientEmail,
        from: formData.from,
        fromName: formData.fromName,
        subject: formData.subject || "بدون موضوع",
        body: formData.body,
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "ایمیل ارسال شد",
        description: "ایمیل تست با موفقیت ارسال شد",
      });
      setFormData({
        from: "demo@example.com",
        fromName: "تست فرستنده",
        subject: "",
        body: "",
      });
      onOpenChange(false);
      onEmailSent?.();
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در ارسال ایمیل",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ارسال ایمیل تست</DialogTitle>
          <DialogDescription>
            ایمیل تستی را برای آدرس {recipientEmail} ارسال کنید
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">فرستنده</Label>
              <Input
                id="from"
                type="email"
                placeholder="from@example.com"
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromName">نام فرستنده</Label>
              <Input
                id="fromName"
                placeholder="نام فرستنده"
                value={formData.fromName}
                onChange={(e) =>
                  setFormData({ ...formData, fromName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">موضوع</Label>
            <Input
              id="subject"
              placeholder="موضوع ایمیل"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">متن پیام</Label>
            <Textarea
              id="body"
              placeholder="متن ایمیل را اینجا بنویسید..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={6}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              onClick={() => sendMutation.mutate()}
              disabled={sendMutation.isPending || !formData.body.trim()}
            >
              {sendMutation.isPending ? "در حال ارسال..." : "ارسال ایمیل"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
