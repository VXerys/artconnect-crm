// ============================================================================
// ARTCONNECT CRM - ACTIVITY SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  ActivityLog,
  NewActivityLog,
  ActivityType,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface FormattedActivity extends ActivityLog {
  formattedDate: string;
  relativeTime: string;
  icon: string;
  color: string;
}

// Activity type configuration
const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; color: string; label: string }> = {
  artwork_created: { icon: '🎨', color: 'text-blue-400', label: 'Karya Baru' },
  artwork_updated: { icon: '✏️', color: 'text-amber-400', label: 'Karya Diperbarui' },
  artwork_sold: { icon: '💰', color: 'text-emerald-400', label: 'Karya Terjual' },
  contact_added: { icon: '👤', color: 'text-purple-400', label: 'Kontak Baru' },
  contact_updated: { icon: '📝', color: 'text-cyan-400', label: 'Kontak Diperbarui' },
  sale_created: { icon: '📋', color: 'text-orange-400', label: 'Penjualan Baru' },
  sale_completed: { icon: '✅', color: 'text-green-400', label: 'Penjualan Selesai' },
  report_generated: { icon: '📊', color: 'text-indigo-400', label: 'Laporan Dibuat' },
  user_login: { icon: '🔑', color: 'text-gray-400', label: 'Login' },
  user_profile_updated: { icon: '⚙️', color: 'text-slate-400', label: 'Profil Diperbarui' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format relative time
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
  if (diffMonths < 12) return `${diffMonths} bulan lalu`;
  return `${Math.floor(diffMonths / 12)} tahun lalu`;
}

/**
 * Format date to Indonesian format
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================================
// ACTIVITY SERVICE
// ============================================================================

export const activityService = {
  /**
   * Get activity logs for a user with formatting
   */
  async getAll(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    client: TypedSupabaseClient = supabase
  ): Promise<FormattedActivity[]> {
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }

    return (data || []).map((activity) => this.formatActivity(activity));
  },

  /**
   * Get recent activities
   */
  async getRecent(
    userId: string,
    limit: number = 10,
    client: TypedSupabaseClient = supabase
  ): Promise<FormattedActivity[]> {
    return this.getAll(userId, limit, 0, client);
  },

  /**
   * Get activities by type
   */
  async getByType(
    userId: string,
    type: ActivityType,
    limit: number = 20,
    client: TypedSupabaseClient = supabase
  ): Promise<FormattedActivity[]> {
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type', type)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs by type:', error);
      throw error;
    }

    return (data || []).map((activity) => this.formatActivity(activity));
  },

  /**
   * Get activities for a specific entity
   */
  async getByEntity(
    userId: string,
    entityType: string,
    entityId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<FormattedActivity[]> {
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching entity activities:', error);
      throw error;
    }

    return (data || []).map((activity) => this.formatActivity(activity));
  },

  /**
   * Log a new activity
   */
  async log(
    activity: NewActivityLog,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    const { data, error } = await client
      .from('activity_logs')
      .insert(activity)
      .select()
      .single();

    if (error) {
      console.error('Error logging activity:', error);
      throw error;
    }

    return data;
  },

  /**
   * Quick log helpers
   */
  async logArtworkCreated(
    userId: string,
    artworkId: string,
    artworkTitle: string,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'artwork_created',
      title: `Karya baru dibuat: ${artworkTitle}`,
      entity_type: 'artwork',
      entity_id: artworkId,
      entity_title: artworkTitle,
    }, client);
  },

  async logArtworkUpdated(
    userId: string,
    artworkId: string,
    artworkTitle: string,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'artwork_updated',
      title: `Karya diperbarui: ${artworkTitle}`,
      entity_type: 'artwork',
      entity_id: artworkId,
      entity_title: artworkTitle,
    }, client);
  },

  async logArtworkSold(
    userId: string,
    artworkId: string,
    artworkTitle: string,
    amount?: number,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'artwork_sold',
      title: `Karya terjual: ${artworkTitle}`,
      description: amount ? `Total: Rp ${amount.toLocaleString('id-ID')}` : undefined,
      entity_type: 'artwork',
      entity_id: artworkId,
      entity_title: artworkTitle,
      metadata: amount ? { amount } : {},
    }, client);
  },

  async logContactAdded(
    userId: string,
    contactId: string,
    contactName: string,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'contact_added',
      title: `Kontak baru ditambahkan: ${contactName}`,
      entity_type: 'contact',
      entity_id: contactId,
      entity_title: contactName,
    }, client);
  },

  async logSaleCreated(
    userId: string,
    saleId: string,
    title: string,
    amount: number,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'sale_created',
      title: `Penjualan baru: ${title}`,
      description: `Total: Rp ${amount.toLocaleString('id-ID')}`,
      entity_type: 'sale',
      entity_id: saleId,
      entity_title: title,
      metadata: { amount },
    }, client);
  },

  async logSaleCompleted(
    userId: string,
    saleId: string,
    title: string,
    amount: number,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'sale_completed',
      title: `Penjualan selesai: ${title}`,
      description: `Total: Rp ${amount.toLocaleString('id-ID')}`,
      entity_type: 'sale',
      entity_id: saleId,
      entity_title: title,
      metadata: { amount },
    }, client);
  },

  async logUserLogin(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'user_login',
      title: 'Login berhasil',
    }, client);
  },

  async logReportGenerated(
    userId: string,
    reportType: string,
    format: string,
    filename: string,
    client: TypedSupabaseClient = supabase
  ): Promise<ActivityLog> {
    return this.log({
      user_id: userId,
      activity_type: 'report_generated',
      title: `Laporan dibuat: ${filename}`,
      description: `Tipe: ${reportType}, Format: ${format.toUpperCase()}`,
      metadata: { 
        filename,
        reportType,
        format 
      },
    }, client);
  },

  /**
   * Format activity with additional data
   */
  formatActivity(activity: ActivityLog): FormattedActivity {
    const date = new Date(activity.created_at);
    const config = ACTIVITY_CONFIG[activity.activity_type] || {
      icon: '📌',
      color: 'text-gray-400',
      label: 'Activity',
    };

    return {
      ...activity,
      formattedDate: formatDate(date),
      relativeTime: getRelativeTime(date),
      icon: config.icon,
      color: config.color,
    };
  },

  /**
   * Get activity stats
   */
  async getStats(
    userId: string,
    days: number = 30,
    client: TypedSupabaseClient = supabase
  ): Promise<Record<ActivityType, number>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await client
      .from('activity_logs')
      .select('activity_type')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching activity stats:', error);
      throw error;
    }

    const stats: Record<string, number> = {};
    data?.forEach((activity) => {
      stats[activity.activity_type] = (stats[activity.activity_type] || 0) + 1;
    });

    return stats as Record<ActivityType, number>;
  },

  /**
   * Delete old activity logs (cleanup)
   */
  async cleanup(
    userId: string,
    daysToKeep: number = 90,
    client: TypedSupabaseClient = supabase
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await client
      .from('activity_logs')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      console.error('Error cleaning up activity logs:', error);
      throw error;
    }

    return data?.length || 0;
  },
};

export default activityService;
