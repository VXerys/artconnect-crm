import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationsService } from '@/lib/services/notifications.service';

// ============================================================================
// USE NOTIFICATIONS HOOK
// ============================================================================

/**
 * Hook to easily create notifications from anywhere in the app
 */
export const useNotifications = () => {
  const { user } = useAuth();

  /**
   * Create a generic notification
   */
  const notify = useCallback(async (
    title: string,
    message?: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionUrl?: string
  ) => {
    if (!user?.id) return null;
    
    try {
      return await notificationsService.create({
        userId: user.id,
        title,
        message,
        type,
        actionUrl,
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }, [user?.id]);

  /**
   * Notify when a new artwork is created
   */
  const notifyArtworkCreated = useCallback(async (
    artworkTitle: string,
    artworkId: string
  ) => {
    if (!user?.id) return null;
    
    return await notify(
      '🎨 Karya Baru Ditambahkan',
      `${artworkTitle} berhasil ditambahkan ke portfolio`,
      'success',
      `/artworks`
    );
  }, [user?.id, notify]);

  /**
   * Notify when an artwork is sold
   */
  const notifyArtworkSold = useCallback(async (
    artworkTitle: string,
    amount: number,
    artworkId: string
  ) => {
    if (!user?.id) return null;
    
    return await notificationsService.notifyArtworkSold(
      user.id,
      artworkTitle,
      amount,
      artworkId
    );
  }, [user?.id]);

  /**
   * Notify when a new contact is added
   */
  const notifyNewContact = useCallback(async (
    contactName: string,
    contactId: string
  ) => {
    if (!user?.id) return null;
    
    return await notificationsService.notifyNewContact(
      user.id,
      contactName,
      contactId
    );
  }, [user?.id]);

  /**
   * Notify when a payment is received
   */
  const notifyPaymentReceived = useCallback(async (
    amount: number,
    saleId: string
  ) => {
    if (!user?.id) return null;
    
    return await notificationsService.notifyPaymentReceived(
      user.id,
      amount,
      saleId
    );
  }, [user?.id]);

  /**
   * Notify when a due date is approaching
   */
  const notifyDueDateApproaching = useCallback(async (
    itemTitle: string,
    dueDate: string,
    itemId: string
  ) => {
    if (!user?.id) return null;
    
    return await notificationsService.notifyDueDateApproaching(
      user.id,
      itemTitle,
      dueDate,
      itemId
    );
  }, [user?.id]);

  /**
   * Notify when a sale is completed
   */
  const notifySaleCompleted = useCallback(async (
    saleTitle: string,
    amount: number,
    saleId: string
  ) => {
    if (!user?.id) return null;
    
    return await notify(
      '✅ Penjualan Selesai',
      `${saleTitle} telah selesai dengan total Rp ${amount.toLocaleString('id-ID')}`,
      'success',
      `/reports`
    );
  }, [user?.id, notify]);

  /**
   * Notify when status changes in pipeline
   */
  const notifyPipelineStatusChanged = useCallback(async (
    itemTitle: string,
    newStatus: string,
    itemId: string
  ) => {
    if (!user?.id) return null;
    
    const statusLabels: Record<string, string> = {
      concept: 'Konsep',
      wip: 'Dalam Pengerjaan',
      finished: 'Selesai',
      sold: 'Terjual',
    };
    
    return await notify(
      '🔄 Status Berubah',
      `${itemTitle} sekarang "${statusLabels[newStatus] || newStatus}"`,
      'info',
      `/pipeline`
    );
  }, [user?.id, notify]);

  /**
   * Notify welcome message for new users
   */
  const notifyWelcome = useCallback(async (userName: string) => {
    if (!user?.id) return null;
    
    return await notify(
      '👋 Selamat Datang di ArtConnect!',
      `Hai ${userName}! Mulai kelola karya seni dan kontak profesional Anda sekarang.`,
      'info',
      '/dashboard'
    );
  }, [user?.id, notify]);

  /**
   * Notify when report is generated
   */
  const notifyReportGenerated = useCallback(async (
    reportName: string,
    reportId: string
  ) => {
    if (!user?.id) return null;
    
    return await notificationsService.notifyReportReady(
      user.id,
      reportName,
      reportId
    );
  }, [user?.id]);

  return {
    notify,
    notifyArtworkCreated,
    notifyArtworkSold,
    notifyNewContact,
    notifyPaymentReceived,
    notifyDueDateApproaching,
    notifySaleCompleted,
    notifyPipelineStatusChanged,
    notifyWelcome,
    notifyReportGenerated,
  };
};

export default useNotifications;
