import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import { storage } from "./storage";
import { log } from "./index";

const SMTP_PORT = parseInt(process.env.SMTP_PORT || "25", 10);
const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || "ariyabot.ir";

export function startSmtpServer(): SMTPServer {
  const server = new SMTPServer({
    authOptional: true,
    disabledCommands: ["AUTH"],
    allowInsecureAuth: true,
    disableReverseLookup: true,
    size: 10 * 1024 * 1024,
    
    onConnect(session, callback) {
      log(`SMTP: اتصال جدید از ${session.remoteAddress}`, "smtp");
      callback();
    },

    onMailFrom(address, session, callback) {
      log(`SMTP: ایمیل از ${address.address}`, "smtp");
      callback();
    },

    onRcptTo(address, session, callback) {
      const recipient = address.address.toLowerCase();
      log(`SMTP: گیرنده ${recipient}`, "smtp");
      
      if (!recipient.endsWith(`@${EMAIL_DOMAIN}`)) {
        log(`SMTP: دامنه نامعتبر برای ${recipient}`, "smtp");
        return callback(new Error(`دامنه نامعتبر. فقط ${EMAIL_DOMAIN} پذیرفته می‌شود.`));
      }
      
      callback();
    },

    async onData(stream, session, callback) {
      try {
        const chunks: Buffer[] = [];
        
        for await (const chunk of stream) {
          chunks.push(chunk as Buffer);
        }
        
        const emailBuffer = Buffer.concat(chunks);
        const parsed = await simpleParser(emailBuffer);
        
        const recipient = session.envelope.rcptTo[0]?.address?.toLowerCase();
        const sender = session.envelope.mailFrom 
          ? (typeof session.envelope.mailFrom === 'object' ? session.envelope.mailFrom.address : session.envelope.mailFrom)
          : parsed.from?.value[0]?.address || "unknown@unknown.com";
        
        if (!recipient) {
          log("SMTP: گیرنده مشخص نشده", "smtp");
          return callback(new Error("گیرنده مشخص نشده"));
        }

        log(`SMTP: پردازش ایمیل برای ${recipient}`, "smtp");
        
        const inbox = await storage.getInbox(recipient);
        
        if (!inbox) {
          log(`SMTP: صندوق ورودی ${recipient} یافت نشد یا منقضی شده`, "smtp");
          return callback(new Error("صندوق ورودی یافت نشد یا منقضی شده"));
        }

        const senderName = parsed.from?.value[0]?.name || "";
        
        await storage.addEmail(recipient, {
          from: sender,
          fromName: senderName,
          to: recipient,
          subject: parsed.subject || "(بدون موضوع)",
          body: parsed.text || "",
          html: parsed.html || undefined,
          receivedAt: new Date().toISOString(),
        });

        log(`SMTP: ایمیل ذخیره شد - از: ${sender} به: ${recipient} موضوع: ${parsed.subject}`, "smtp");
        callback();
        
      } catch (error) {
        log(`SMTP: خطا در پردازش ایمیل: ${error}`, "smtp");
        callback(new Error("خطا در پردازش ایمیل"));
      }
    },

    onClose(session) {
      log(`SMTP: اتصال بسته شد از ${session.remoteAddress}`, "smtp");
    },
  });

  server.listen(SMTP_PORT, "0.0.0.0", () => {
    log(`SMTP سرور روی پورت ${SMTP_PORT} شروع شد`, "smtp");
  });

  server.on("error", (err) => {
    if ((err as NodeJS.ErrnoException).code === "EACCES") {
      log(`SMTP: نیاز به دسترسی root برای پورت ${SMTP_PORT}. از پورت 2525 استفاده می‌شود.`, "smtp");
      server.listen(2525, "0.0.0.0", () => {
        log(`SMTP سرور روی پورت 2525 شروع شد (نیاز به ریدایرکت از پورت 25)`, "smtp");
      });
    } else {
      log(`SMTP: خطا در شروع سرور: ${err.message}`, "smtp");
    }
  });

  return server;
}
