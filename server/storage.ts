import { randomUUID } from "crypto";
import type { Email, Inbox, InsertEmail } from "@shared/schema";

export interface IStorage {
  createInbox(email: string, expiresAt: Date): Promise<Inbox>;
  getInbox(email: string): Promise<Inbox | undefined>;
  addEmail(inboxEmail: string, email: InsertEmail): Promise<Email>;
  markEmailAsRead(emailId: string): Promise<void>;
  deleteExpiredInboxes(): Promise<void>;
}

export class MemStorage implements IStorage {
  private inboxes: Map<string, Inbox>;

  constructor() {
    this.inboxes = new Map();
    
    // Clean up expired inboxes every minute
    setInterval(() => {
      this.deleteExpiredInboxes();
    }, 60000);
  }

  async createInbox(email: string, expiresAt: Date): Promise<Inbox> {
    const inbox: Inbox = {
      email,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      emails: [],
    };
    this.inboxes.set(email, inbox);
    return inbox;
  }

  async getInbox(email: string): Promise<Inbox | undefined> {
    const inbox = this.inboxes.get(email);
    if (!inbox) return undefined;
    
    // Check if expired
    if (new Date(inbox.expiresAt) < new Date()) {
      this.inboxes.delete(email);
      return undefined;
    }
    
    return inbox;
  }

  async addEmail(inboxEmail: string, insertEmail: InsertEmail): Promise<Email> {
    const inbox = this.inboxes.get(inboxEmail);
    if (!inbox) {
      throw new Error("Inbox not found");
    }

    const email: Email = {
      id: randomUUID(),
      ...insertEmail,
      isRead: false,
    };

    inbox.emails.unshift(email);
    return email;
  }

  async markEmailAsRead(emailId: string): Promise<void> {
    for (const inbox of this.inboxes.values()) {
      const email = inbox.emails.find((e) => e.id === emailId);
      if (email) {
        email.isRead = true;
        return;
      }
    }
  }

  async deleteExpiredInboxes(): Promise<void> {
    const now = new Date();
    for (const [email, inbox] of this.inboxes.entries()) {
      if (new Date(inbox.expiresAt) < now) {
        this.inboxes.delete(email);
      }
    }
  }
}

export const storage = new MemStorage();
