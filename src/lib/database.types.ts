// ============================================================================
// ARTCONNECT CRM - DATABASE TYPES
// ============================================================================
// Auto-generated types from Supabase schema
// Last updated: 2024-12-28
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'admin' | 'artist' | 'collector' | 'user';
export type ArtworkStatus = 'concept' | 'wip' | 'finished' | 'sold';
export type ContactType = 'gallery' | 'collector' | 'museum' | 'curator';
export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type ActivityType = 
  | 'artwork_created'
  | 'artwork_updated'
  | 'artwork_sold'
  | 'contact_added'
  | 'contact_updated'
  | 'sale_created'
  | 'sale_completed'
  | 'report_generated'
  | 'user_login'
  | 'user_profile_updated';
export type ReportType = 'sales' | 'artworks' | 'contacts' | 'performance' | 'custom';
export type ReportFormat = 'pdf' | 'csv' | 'excel';
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

// ============================================================================
// DATABASE SCHEMA
// ============================================================================

export interface Database {
  public: {
    Tables: {
      // ========================================
      // USERS TABLE
      // ========================================
      users: {
        Row: {
          id: string;
          auth_id: string | null; // Supabase Auth user ID
          firebase_uid: string | null; // Deprecated - kept for migration
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: UserRole;
          business_name: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          currency: string;
          timezone: string;
          settings: Json;
          is_active: boolean;
          email_verified: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          firebase_uid?: string | null;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          business_name?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          currency?: string;
          timezone?: string;
          settings?: Json;
          is_active?: boolean;
          email_verified?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          firebase_uid?: string | null;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          business_name?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          currency?: string;
          timezone?: string;
          settings?: Json;
          is_active?: boolean;
          email_verified?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // ARTWORKS TABLE
      // ========================================
      artworks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          medium: string | null;
          dimensions: string | null;
          year: number | null;
          status: ArtworkStatus;
          price: number | null;
          currency: string;
          image_url: string | null;
          thumbnail_url: string | null;
          images: Json;
          category: string | null;
          tags: string[] | null;
          is_featured: boolean;
          is_archived: boolean;
          sold_at: string | null;
          sold_price: number | null;
          buyer_contact_id: string | null;
          notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          medium?: string | null;
          dimensions?: string | null;
          year?: number | null;
          status?: ArtworkStatus;
          price?: number | null;
          currency?: string;
          image_url?: string | null;
          thumbnail_url?: string | null;
          images?: Json;
          category?: string | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_archived?: boolean;
          sold_at?: string | null;
          sold_price?: number | null;
          buyer_contact_id?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          medium?: string | null;
          dimensions?: string | null;
          year?: number | null;
          status?: ArtworkStatus;
          price?: number | null;
          currency?: string;
          image_url?: string | null;
          thumbnail_url?: string | null;
          images?: Json;
          category?: string | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_archived?: boolean;
          sold_at?: string | null;
          sold_price?: number | null;
          buyer_contact_id?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // CONTACTS TABLE
      // ========================================
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: ContactType;
          email: string | null;
          phone: string | null;
          location: string | null;
          address: string | null;
          website: string | null;
          company: string | null;
          position: string | null;
          rating: number | null;
          notes: string | null;
          tags: string[] | null;
          social_media: Json;
          preferences: Json;
          total_purchases: number;
          purchase_count: number;
          last_contact_at: string | null;
          is_active: boolean;
          is_vip: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: ContactType;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          address?: string | null;
          website?: string | null;
          company?: string | null;
          position?: string | null;
          rating?: number | null;
          notes?: string | null;
          tags?: string[] | null;
          social_media?: Json;
          preferences?: Json;
          total_purchases?: number;
          purchase_count?: number;
          last_contact_at?: string | null;
          is_active?: boolean;
          is_vip?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: ContactType;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          address?: string | null;
          website?: string | null;
          company?: string | null;
          position?: string | null;
          rating?: number | null;
          notes?: string | null;
          tags?: string[] | null;
          social_media?: Json;
          preferences?: Json;
          total_purchases?: number;
          purchase_count?: number;
          last_contact_at?: string | null;
          is_active?: boolean;
          is_vip?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // SALES TABLE
      // ========================================
      sales: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string | null;
          contact_id: string | null;
          title: string;
          description: string | null;
          amount: number;
          currency: string;
          discount_amount: number;
          tax_amount: number;
          total_amount: number;
          status: SaleStatus;
          payment_method: string | null;
          payment_reference: string | null;
          paid_at: string | null;
          notes: string | null;
          invoice_number: string | null;
          invoice_url: string | null;
          sale_date: string;
          due_date: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id?: string | null;
          contact_id?: string | null;
          title: string;
          description?: string | null;
          amount: number;
          currency?: string;
          discount_amount?: number;
          tax_amount?: number;
          total_amount: number;
          status?: SaleStatus;
          payment_method?: string | null;
          payment_reference?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          invoice_number?: string | null;
          invoice_url?: string | null;
          sale_date?: string;
          due_date?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string | null;
          contact_id?: string | null;
          title?: string;
          description?: string | null;
          amount?: number;
          currency?: string;
          discount_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          status?: SaleStatus;
          payment_method?: string | null;
          payment_reference?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          invoice_number?: string | null;
          invoice_url?: string | null;
          sale_date?: string;
          due_date?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // ACTIVITY LOGS TABLE
      // ========================================
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          activity_type: ActivityType;
          title: string;
          description: string | null;
          entity_type: string | null;
          entity_id: string | null;
          entity_title: string | null;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: ActivityType;
          title: string;
          description?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          entity_title?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: ActivityType;
          title?: string;
          description?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          entity_title?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };

      // ========================================
      // REPORTS TABLE
      // ========================================
      reports: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: ReportType;
          format: ReportFormat;
          date_range_start: string | null;
          date_range_end: string | null;
          filters: Json;
          file_url: string | null;
          file_size: number | null;
          is_generated: boolean;
          generated_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: ReportType;
          format?: ReportFormat;
          date_range_start?: string | null;
          date_range_end?: string | null;
          filters?: Json;
          file_url?: string | null;
          file_size?: number | null;
          is_generated?: boolean;
          generated_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: ReportType;
          format?: ReportFormat;
          date_range_start?: string | null;
          date_range_end?: string | null;
          filters?: Json;
          file_url?: string | null;
          file_size?: number | null;
          is_generated?: boolean;
          generated_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // SCHEDULED REPORTS TABLE
      // ========================================
      scheduled_reports: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: ReportType;
          format: ReportFormat;
          frequency: ReportFrequency;
          day_of_week: number | null;
          day_of_month: number | null;
          time_of_day: string;
          filters: Json;
          email_recipients: string[] | null;
          is_active: boolean;
          last_run_at: string | null;
          next_run_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: ReportType;
          format?: ReportFormat;
          frequency: ReportFrequency;
          day_of_week?: number | null;
          day_of_month?: number | null;
          time_of_day?: string;
          filters?: Json;
          email_recipients?: string[] | null;
          is_active?: boolean;
          last_run_at?: string | null;
          next_run_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: ReportType;
          format?: ReportFormat;
          frequency?: ReportFrequency;
          day_of_week?: number | null;
          day_of_month?: number | null;
          time_of_day?: string;
          filters?: Json;
          email_recipients?: string[] | null;
          is_active?: boolean;
          last_run_at?: string | null;
          next_run_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // PIPELINE ITEMS TABLE
      // ========================================
      pipeline_items: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string | null;
          title: string;
          description: string | null;
          medium: string | null;
          status: ArtworkStatus;
          due_date: string | null;
          priority: number;
          position: number;
          estimated_price: number | null;
          currency: string;
          image_url: string | null;
          notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id?: string | null;
          title: string;
          description?: string | null;
          medium?: string | null;
          status?: ArtworkStatus;
          due_date?: string | null;
          priority?: number;
          position?: number;
          estimated_price?: number | null;
          currency?: string;
          image_url?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string | null;
          title?: string;
          description?: string | null;
          medium?: string | null;
          status?: ArtworkStatus;
          due_date?: string | null;
          priority?: number;
          position?: number;
          estimated_price?: number | null;
          currency?: string;
          image_url?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // TAGS TABLE
      // ========================================
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          usage_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          usage_count?: number;
          created_at?: string;
        };
      };

      // ========================================
      // NOTIFICATIONS TABLE
      // ========================================
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string | null;
          type: string;
          entity_type: string | null;
          entity_id: string | null;
          action_url: string | null;
          is_read: boolean;
          read_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message?: string | null;
          type?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          action_url?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string | null;
          type?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          action_url?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };

    Views: {
      dashboard_stats: {
        Row: {
          user_id: string;
          total_artworks: number;
          concept_count: number;
          wip_count: number;
          finished_count: number;
          sold_count: number;
          total_contacts: number;
          total_sales: number;
          total_revenue: number;
        };
      };
      monthly_sales_summary: {
        Row: {
          user_id: string;
          month: string;
          sale_count: number;
          total_amount: number;
          avg_amount: number;
        };
      };
    };

    Functions: {
      log_activity: {
        Args: {
          p_user_id: string;
          p_activity_type: ActivityType;
          p_title: string;
          p_description?: string;
          p_entity_type?: string;
          p_entity_id?: string;
          p_entity_title?: string;
          p_metadata?: Json;
        };
        Returns: string;
      };
    };

    Enums: {
      user_role: UserRole;
      artwork_status: ArtworkStatus;
      contact_type: ContactType;
      sale_status: SaleStatus;
      activity_type: ActivityType;
      report_type: ReportType;
      report_format: ReportFormat;
      report_frequency: ReportFrequency;
    };
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

// Generic table helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Shorthand types for Row
export type User = Tables<'users'>;
export type Artwork = Tables<'artworks'>;
export type Contact = Tables<'contacts'>;
export type Sale = Tables<'sales'>;
export type ActivityLog = Tables<'activity_logs'>;
export type Report = Tables<'reports'>;
export type ScheduledReport = Tables<'scheduled_reports'>;
export type PipelineItem = Tables<'pipeline_items'>;
export type Tag = Tables<'tags'>;
export type Notification = Tables<'notifications'>;

// Shorthand types for Insert
export type NewUser = InsertTables<'users'>;
export type NewArtwork = InsertTables<'artworks'>;
export type NewContact = InsertTables<'contacts'>;
export type NewSale = InsertTables<'sales'>;
export type NewActivityLog = InsertTables<'activity_logs'>;
export type NewReport = InsertTables<'reports'>;
export type NewScheduledReport = InsertTables<'scheduled_reports'>;
export type NewPipelineItem = InsertTables<'pipeline_items'>;
export type NewTag = InsertTables<'tags'>;
export type NewNotification = InsertTables<'notifications'>;

// Shorthand types for Update
export type UserUpdate = UpdateTables<'users'>;
export type ArtworkUpdate = UpdateTables<'artworks'>;
export type ContactUpdate = UpdateTables<'contacts'>;
export type SaleUpdate = UpdateTables<'sales'>;
export type ActivityLogUpdate = UpdateTables<'activity_logs'>;
export type ReportUpdate = UpdateTables<'reports'>;
export type ScheduledReportUpdate = UpdateTables<'scheduled_reports'>;
export type PipelineItemUpdate = UpdateTables<'pipeline_items'>;
export type TagUpdate = UpdateTables<'tags'>;
export type NotificationUpdate = UpdateTables<'notifications'>;

// View types
export type DashboardStats = Database['public']['Views']['dashboard_stats']['Row'];
export type MonthlySalesSummary = Database['public']['Views']['monthly_sales_summary']['Row'];

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Artwork with relations
export interface ArtworkWithContact extends Artwork {
  buyer_contact?: Contact | null;
}

// Sale with relations
export interface SaleWithRelations extends Sale {
  artwork?: Artwork | null;
  contact?: Contact | null;
}

// Contact with stats
export interface ContactWithStats extends Contact {
  artworks_purchased?: Artwork[];
}

// Activity log with formatted date
export interface FormattedActivityLog extends ActivityLog {
  formatted_date?: string;
  relative_time?: string;
}
