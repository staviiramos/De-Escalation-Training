import "server-only";
import { createClient } from "@supabase/supabase-js";

// Minimal hand-written schema (no generated types) — just enough for the
// one table this app touches. Keep in sync with supabase/schema.sql.
export interface Database {
  public: {
    Tables: {
      completions: {
        Row: {
          id: string;
          learner_name: string;
          learner_email: string;
          language: string;
          pre_score: number;
          post_score: number;
          passed: boolean;
          duration_seconds: number | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          learner_name: string;
          learner_email: string;
          language?: string;
          pre_score: number;
          post_score: number;
          passed: boolean;
          duration_seconds?: number | null;
          completed_at?: string;
        };
        Update: Partial<{
          id: string;
          learner_name: string;
          learner_email: string;
          language: string;
          pre_score: number;
          post_score: number;
          passed: boolean;
          duration_seconds: number | null;
          completed_at: string;
        }>;
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          learner_name: string | null;
          learner_email: string;
          assigned_at: string;
          last_reminded_at: string | null;
          reminder_count: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          learner_name?: string | null;
          learner_email: string;
          assigned_at?: string;
          last_reminded_at?: string | null;
          reminder_count?: number;
          completed_at?: string | null;
        };
        Update: Partial<{
          id: string;
          learner_name: string | null;
          learner_email: string;
          assigned_at: string;
          last_reminded_at: string | null;
          reminder_count: number;
          completed_at: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// Service-role client — server-only (the "server-only" import above makes
// bundling this into a client component a build error). Never expose
// SUPABASE_SERVICE_ROLE_KEY to the browser; it bypasses row-level security.
let client: ReturnType<typeof createClient<Database>> | null = null;

export function supabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example)."
    );
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
