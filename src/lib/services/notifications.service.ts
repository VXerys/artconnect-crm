// ============================================================================
// ARTCONNECT CRM - NOTIFICATIONS SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  Notification,
  NewNotification,
  NotificationUpdate,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationWithFormat extends Notification {
  formattedDate: string;
  relativeTime: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message?: string;
  type?: NotificationType;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Baru saja';
  if (diffMins < 60) return `${diffMins}m lalu`;
  if (diffHours < 24) return `${diffHours}j lalu`;
  if (diffDays < 7) return `${diffDays}h lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

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
// NOTIFICATIONS SERVICE
// ============================================================================

export const notificationsService = {
  /**
   * Get all notifications for a user
   */
  async getAll(
    userId: string,
    limit: number = 50,
    includeRead: boolean = true,
    client: TypedSupabaseClient = supabase
  ): Promise<NotificationWithFormat[]> {
    let query = client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!includeRead) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return (data || []).map((n) => this.formatNotification(n));
  },

  /**
   * Get unread notifications
   */
  async getUnread(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<NotificationWithFormat[]> {
    return this.getAll(userId, 50, false, client);
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<number> {
    const { count, error } = await client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  },

  /**
   * Create a new notification
   */
  async create(
    params: CreateNotificationParams,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    const notification: NewNotification = {
      user_id: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      entity_type: params.entityType,
      entity_id: params.entityId,
      action_url: params.actionUrl,
    };

    const { data, error } = await client
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    const { data, error } = await client
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }

    return data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   */
  async delete(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<number> {
    const { data, error } = await client
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true)
      .select('id');

    if (error) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }

    return data?.length || 0;
  },

  /**
   * Delete old notifications
   */
  async cleanup(
    userId: string,
    daysToKeep: number = 30,
    client: TypedSupabaseClient = supabase
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await client
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true)
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }

    return data?.length || 0;
  },

  /**
   * Format notification with additional data
   */
  formatNotification(notification: Notification): NotificationWithFormat {
    const date = new Date(notification.created_at);
    return {
      ...notification,
      formattedDate: formatDate(date),
      relativeTime: getRelativeTime(date),
    };
  },

  // ========================================
  // Quick notification helpers
  // ========================================

  async notifyArtworkSold(
    userId: string,
    artworkTitle: string,
    amount: number,
    artworkId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    return this.create({
      userId,
      title: '🎉 Karya Terjual!',
      message: `${artworkTitle} terjual seharga Rp ${amount.toLocaleString('id-ID')}`,
      type: 'success',
      entityType: 'artwork',
      entityId: artworkId,
      actionUrl: `/artworks/${artworkId}`,
    }, client);
  },

  async notifyNewContact(
    userId: string,
    contactName: string,
    contactId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    return this.create({
      userId,
      title: 'Kontak Baru',
      message: `${contactName} ditambahkan ke daftar kontak`,
      type: 'info',
      entityType: 'contact',
      entityId: contactId,
      actionUrl: `/contacts`,
    }, client);
  },

  async notifyPaymentReceived(
    userId: string,
    amount: number,
    saleId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    return this.create({
      userId,
      title: '💰 Pembayaran Diterima',
      message: `Pembayaran Rp ${amount.toLocaleString('id-ID')} telah dikonfirmasi`,
      type: 'success',
      entityType: 'sale',
      entityId: saleId,
      actionUrl: `/reports`,
    }, client);
  },

  async notifyDueDateApproaching(
    userId: string,
    itemTitle: string,
    dueDate: string,
    itemId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    return this.create({
      userId,
      title: '⏰ Deadline Mendekat',
      message: `${itemTitle} memiliki deadline pada ${dueDate}`,
      type: 'warning',
      entityType: 'pipeline_item',
      entityId: itemId,
      actionUrl: `/pipeline`,
    }, client);
  },

  async notifyReportReady(
    userId: string,
    reportName: string,
    reportId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Notification> {
    return this.create({
      userId,
      title: '📊 Laporan Siap',
      message: `Laporan "${reportName}" telah selesai dibuat`,
      type: 'info',
      entityType: 'report',
      entityId: reportId,
      actionUrl: `/reports`,
    }, client);
  },
};

export default notificationsService;
