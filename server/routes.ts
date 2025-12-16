import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

function generateRandomEmail(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";
  for (let i = 0; i < 10; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Using a local domain for demo - in production this would be your actual domain
  return `${username}@tempmail.local`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Generate new temporary email
  app.post("/api/generate", async (req, res) => {
    try {
      const email = generateRandomEmail();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      await storage.createInbox(email, expiresAt);
      
      res.json({
        email,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
    } catch (error) {
      console.error("Error generating email:", error);
      res.status(500).json({ error: "Failed to generate email" });
    }
  });

  // Get inbox for an email
  app.get("/api/inbox", async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const inbox = await storage.getInbox(email);
      
      if (!inbox) {
        return res.status(404).json({ error: "Inbox not found or expired" });
      }

      res.json(inbox);
    } catch (error) {
      console.error("Error fetching inbox:", error);
      res.status(500).json({ error: "Failed to fetch inbox" });
    }
  });

  // Mark email as read
  app.patch("/api/emails/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markEmailAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking email as read:", error);
      res.status(500).json({ error: "Failed to mark email as read" });
    }
  });

  // Demo endpoint to simulate receiving an email (for testing)
  const sendEmailSchema = z.object({
    to: z.string().email(),
    from: z.string().email().optional(),
    fromName: z.string().optional(),
    subject: z.string().optional(),
    body: z.string().optional(),
    html: z.string().optional(),
  });

  app.post("/api/demo/send-email", async (req, res) => {
    try {
      const parsed = sendEmailSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.errors 
        });
      }

      const { to, from, fromName, subject, body, html } = parsed.data;

      const inbox = await storage.getInbox(to);
      if (!inbox) {
        return res.status(404).json({ error: "Inbox not found" });
      }

      const email = await storage.addEmail(to, {
        from: from || "demo@example.com",
        fromName: fromName || "Demo Sender",
        to,
        subject: subject || "Test Email",
        body: body || "This is a test email.",
        html: html,
        receivedAt: new Date().toISOString(),
      });

      res.json(email);
    } catch (error) {
      console.error("Error sending demo email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  return httpServer;
}
