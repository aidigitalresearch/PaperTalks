/**
 * Supabase Database Types
 * 
 * These types should match your Supabase database schema.
 * Run `npx supabase gen types typescript` to auto-generate from your database.
 * 
 * For now, these are manually defined based on our planned schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          orcid_id: string | null;
          institution: string | null;
          department: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          orcid_id?: string | null;
          institution?: string | null;
          department?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          orcid_id?: string | null;
          institution?: string | null;
          department?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      papers: {
        Row: {
          id: string;
          doi: string;
          title: string;
          abstract: string | null;
          authors: Json | null;
          published_date: string | null;
          journal: string | null;
          researcher_id: string;
          citation_count: number;
          citations_updated_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          doi: string;
          title: string;
          abstract?: string | null;
          authors?: Json | null;
          published_date?: string | null;
          journal?: string | null;
          researcher_id: string;
          citation_count?: number;
          citations_updated_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          doi?: string;
          title?: string;
          abstract?: string | null;
          authors?: Json | null;
          published_date?: string | null;
          journal?: string | null;
          researcher_id?: string;
          citation_count?: number;
          citations_updated_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "papers_researcher_id_fkey";
            columns: ["researcher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      videos: {
        Row: {
          id: string;
          vri: string;
          paper_id: string | null;
          researcher_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          duration: number | null;
          status: "draft" | "processing" | "published" | "unlisted" | "archived";
          published_at: string | null;
          view_count: number;
          completion_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vri: string;
          paper_id?: string | null;
          researcher_id: string;
          title: string;
          description?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration?: number | null;
          status?: "draft" | "processing" | "published" | "unlisted" | "archived";
          published_at?: string | null;
          view_count?: number;
          completion_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vri?: string;
          paper_id?: string | null;
          researcher_id?: string;
          title?: string;
          description?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration?: number | null;
          status?: "draft" | "processing" | "published" | "unlisted" | "archived";
          published_at?: string | null;
          view_count?: number;
          completion_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "videos_paper_id_fkey";
            columns: ["paper_id"];
            isOneToOne: false;
            referencedRelation: "papers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "videos_researcher_id_fkey";
            columns: ["researcher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      teaching_scores: {
        Row: {
          researcher_id: string;
          overall_score: number;
          clarity_score: number;
          engagement_score: number;
          peer_rating_score: number;
          accessibility_score: number;
          video_count: number;
          total_views: number;
          last_updated: string;
        };
        Insert: {
          researcher_id: string;
          overall_score?: number;
          clarity_score?: number;
          engagement_score?: number;
          peer_rating_score?: number;
          accessibility_score?: number;
          video_count?: number;
          total_views?: number;
          last_updated?: string;
        };
        Update: {
          researcher_id?: string;
          overall_score?: number;
          clarity_score?: number;
          engagement_score?: number;
          peer_rating_score?: number;
          accessibility_score?: number;
          video_count?: number;
          total_views?: number;
          last_updated?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teaching_scores_researcher_id_fkey";
            columns: ["researcher_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      early_access_signups: {
        Row: {
          id: string;
          email: string;
          role: string | null;
          institution: string | null;
          signed_up_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string | null;
          institution?: string | null;
          signed_up_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string | null;
          institution?: string | null;
          signed_up_at?: string;
        };
        Relationships: [];
      };
      video_analytics: {
        Row: {
          id: string;
          video_id: string;
          event_type: string;
          viewer_id: string | null;
          timestamp: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          video_id: string;
          event_type: string;
          viewer_id?: string | null;
          timestamp?: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          video_id?: string;
          event_type?: string;
          viewer_id?: string | null;
          timestamp?: string;
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "video_analytics_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      video_status: "draft" | "processing" | "published" | "unlisted" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Paper = Database["public"]["Tables"]["papers"]["Row"];
export type PaperInsert = Database["public"]["Tables"]["papers"]["Insert"];
export type PaperUpdate = Database["public"]["Tables"]["papers"]["Update"];

export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];
export type VideoUpdate = Database["public"]["Tables"]["videos"]["Update"];

export type TeachingScore = Database["public"]["Tables"]["teaching_scores"]["Row"];

export type EarlyAccessSignup = Database["public"]["Tables"]["early_access_signups"]["Row"];
export type EarlyAccessSignupInsert = Database["public"]["Tables"]["early_access_signups"]["Insert"];

