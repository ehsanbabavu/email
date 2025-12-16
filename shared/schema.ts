import { z } from "zod";

// Email message schema
export const emailSchema = z.object({
  id: z.string(),
  from: z.string(),
  fromName: z.string().optional(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  html: z.string().optional(),
  receivedAt: z.string(),
  isRead: z.boolean().default(false),
});

export type Email = z.infer<typeof emailSchema>;

// Inbox schema
export const inboxSchema = z.object({
  email: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
  emails: z.array(emailSchema),
});

export type Inbox = z.infer<typeof inboxSchema>;

// Insert email schema (for creating new emails)
export const insertEmailSchema = emailSchema.omit({ id: true, isRead: true });
export type InsertEmail = z.infer<typeof insertEmailSchema>;

// API response types
export interface GenerateEmailResponse {
  email: string;
  createdAt: string;
  expiresAt: string;
}

export interface InboxResponse {
  inbox: Inbox;
}
