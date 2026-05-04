import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          level: string;
          duration: string;
          price: number;
          summary: string;
          hero: string;
          outcomes: string[];
          modules: string[];
          format: "video" | "article" | "blended";
          featured: boolean;
          author_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["courses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      enrollments: {
        Row: {
          id: string;
          user_email: string;
          course_slug: string;
          created_at: string;
          status: "active" | "expired" | "cancelled";
        };
        Insert: Omit<
          Database["public"]["Tables"]["enrollments"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_id: string;
          user_email: string;
          course_slug: string;
          amount: number;
          status: "pending" | "paid" | "cancelled" | "expired";
          payment_type: string | null;
          midtrans_response: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      progress: {
        Row: {
          id: string;
          user_email: string;
          course_slug: string;
          module_index: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["progress"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["progress"]["Insert"]>;
      };
      materials: {
        Row: {
          id: string;
          course_slug: string;
          title: string;
          content: string | null;
          video_url: string | null;
          module_index: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["materials"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["materials"]["Insert"]>;
      };
    };
  };
};
