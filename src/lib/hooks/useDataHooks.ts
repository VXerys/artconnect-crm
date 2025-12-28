// ============================================================================
// ARTCONNECT CRM - DATA HOOKS (Entity-specific)
// ============================================================================

import { useCallback } from 'react';
import {
  useSupabaseQuery,
  useSupabaseMutation,
  useDebouncedSearch,
  usePagination,
} from './useSupabase';
import {
  artworksService,
  contactsService,
  salesService,
  pipelineService,
  activityService,
  notificationsService,
  type ArtworkFilters,
  type ContactFilters,
  type SaleFilters,
} from '../services';
import type {
  Artwork,
  NewArtwork,
  ArtworkUpdate,
  Contact,
  NewContact,
  ContactUpdate,
  Sale,
  NewSale,
  SaleUpdate,
  ArtworkStatus,
} from '../database.types';

// ============================================================================
// ARTWORKS HOOKS
// ============================================================================

export function useArtworksQuery(
  userId: string | undefined,
  filters?: ArtworkFilters,
  page: number = 1,
  limit: number = 20
) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({ data: [], count: 0, page: 1, limit: 20, totalPages: 0 });
      return artworksService.getAll(userId, filters, { page, limit });
    },
    [userId, JSON.stringify(filters), page, limit],
    { enabled: !!userId }
  );
}

export function useArtworkByIdQuery(artworkId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!artworkId) return Promise.resolve(null);
      return artworksService.getById(artworkId);
    },
    [artworkId],
    { enabled: !!artworkId }
  );
}

export function useArtworkStatusCounts(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({ concept: 0, wip: 0, finished: 0, sold: 0 });
      return artworksService.getCountByStatus(userId);
    },
    [userId],
    { enabled: !!userId }
  );
}

export function useRecentArtworks(userId: string | undefined, limit: number = 5) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return artworksService.getRecent(userId, limit);
    },
    [userId, limit],
    { enabled: !!userId }
  );
}

export function useCreateArtwork() {
  return useSupabaseMutation<Artwork, NewArtwork>(
    (artwork) => artworksService.create(artwork)
  );
}

export function useUpdateArtwork() {
  return useSupabaseMutation<Artwork, { id: string; updates: ArtworkUpdate }>(
    ({ id, updates }) => artworksService.update(id, updates)
  );
}

export function useDeleteArtwork() {
  return useSupabaseMutation<void, string>(
    (id) => artworksService.delete(id)
  );
}

// ============================================================================
// CONTACTS HOOKS
// ============================================================================

export function useContactsQuery(
  userId: string | undefined,
  filters?: ContactFilters,
  page: number = 1,
  limit: number = 20
) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({ data: [], count: 0, page: 1, limit: 20, totalPages: 0 });
      return contactsService.getAll(userId, filters, { page, limit });
    },
    [userId, JSON.stringify(filters), page, limit],
    { enabled: !!userId }
  );
}

export function useContactByIdQuery(contactId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!contactId) return Promise.resolve(null);
      return contactsService.getById(contactId);
    },
    [contactId],
    { enabled: !!contactId }
  );
}

export function useContactTypeCounts(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({ gallery: 0, collector: 0, museum: 0, curator: 0 });
      return contactsService.getCountByType(userId);
    },
    [userId],
    { enabled: !!userId }
  );
}

export function useRecentContacts(userId: string | undefined, limit: number = 5) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return contactsService.getRecent(userId, limit);
    },
    [userId, limit],
    { enabled: !!userId }
  );
}

export function useVipContacts(userId: string | undefined, limit?: number) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return contactsService.getVips(userId, limit);
    },
    [userId, limit],
    { enabled: !!userId }
  );
}

export function useContactSearch(userId: string | undefined, query: string, limit: number = 10) {
  const { debouncedTerm, isDebouncing } = useDebouncedSearch(300);
  
  const result = useSupabaseQuery(
    () => {
      if (!userId || !debouncedTerm) return Promise.resolve([]);
      return contactsService.search(userId, debouncedTerm, limit);
    },
    [userId, debouncedTerm, limit],
    { enabled: !!userId && debouncedTerm.length >= 2 }
  );

  return { ...result, isDebouncing };
}

export function useCreateContact() {
  return useSupabaseMutation<Contact, NewContact>(
    (contact) => contactsService.create(contact)
  );
}

export function useUpdateContact() {
  return useSupabaseMutation<Contact, { id: string; updates: ContactUpdate }>(
    ({ id, updates }) => contactsService.update(id, updates)
  );
}

export function useDeleteContact() {
  return useSupabaseMutation<void, string>(
    (id) => contactsService.delete(id)
  );
}

// ============================================================================
// SALES HOOKS
// ============================================================================

export function useSalesQuery(
  userId: string | undefined,
  filters?: SaleFilters,
  page: number = 1,
  limit: number = 20
) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({ data: [], count: 0, page: 1, limit: 20, totalPages: 0 });
      return salesService.getAll(userId, filters, { page, limit });
    },
    [userId, JSON.stringify(filters), page, limit],
    { enabled: !!userId }
  );
}

export function useSalesStats(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({
        totalSales: 0,
        totalRevenue: 0,
        averageSaleValue: 0,
        pendingAmount: 0,
        completedCount: 0,
        pendingCount: 0,
      });
      return salesService.getStats(userId);
    },
    [userId],
    { enabled: !!userId }
  );
}

export function useMonthlySales(userId: string | undefined, year?: number) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return salesService.getMonthlySales(userId, year);
    },
    [userId, year],
    { enabled: !!userId }
  );
}

export function useRecentSales(userId: string | undefined, limit: number = 5) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return salesService.getRecent(userId, limit);
    },
    [userId, limit],
    { enabled: !!userId }
  );
}

export function useCreateSale() {
  return useSupabaseMutation<Sale, NewSale>(
    (sale) => salesService.create(sale)
  );
}

export function useUpdateSale() {
  return useSupabaseMutation<Sale, { id: string; updates: SaleUpdate }>(
    ({ id, updates }) => salesService.update(id, updates)
  );
}

export function useCompleteSale() {
  return useSupabaseMutation<Sale, { id: string; paymentMethod?: string; paymentReference?: string }>(
    ({ id, paymentMethod, paymentReference }) => salesService.complete(id, paymentMethod, paymentReference)
  );
}

// ============================================================================
// PIPELINE HOOKS
// ============================================================================

export function usePipelineData(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({
        concept: { status: 'concept' as ArtworkStatus, title: 'Konsep', color: '', bgColor: '', items: [] },
        wip: { status: 'wip' as ArtworkStatus, title: 'Proses', color: '', bgColor: '', items: [] },
        finished: { status: 'finished' as ArtworkStatus, title: 'Selesai', color: '', bgColor: '', items: [] },
        sold: { status: 'sold' as ArtworkStatus, title: 'Terjual', color: '', bgColor: '', items: [] },
      });
      return pipelineService.getPipelineData(userId);
    },
    [userId],
    { enabled: !!userId }
  );
}

export function usePipelineSummary(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({
        totalItems: 0,
        totalValue: 0,
        byStatus: {
          concept: { count: 0, value: 0 },
          wip: { count: 0, value: 0 },
          finished: { count: 0, value: 0 },
          sold: { count: 0, value: 0 },
        },
      });
      return pipelineService.getSummary(userId);
    },
    [userId],
    { enabled: !!userId }
  );
}

export function useUpcomingPipelineItems(userId: string | undefined, days: number = 7) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return pipelineService.getUpcoming(userId, days);
    },
    [userId, days],
    { enabled: !!userId }
  );
}

export function useOverduePipelineItems(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return pipelineService.getOverdue(userId);
    },
    [userId],
    { enabled: !!userId }
  );
}

// ============================================================================
// ACTIVITY HOOKS
// ============================================================================

export function useRecentActivities(userId: string | undefined, limit: number = 10) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return activityService.getRecent(userId, limit);
    },
    [userId, limit],
    { enabled: !!userId }
  );
}

export function useActivityStats(userId: string | undefined, days: number = 30) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve({});
      return activityService.getStats(userId, days);
    },
    [userId, days],
    { enabled: !!userId }
  );
}

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

export function useNotifications(userId: string | undefined, limit: number = 50) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve([]);
      return notificationsService.getAll(userId, limit);
    },
    [userId, limit],
    { enabled: !!userId, refetchInterval: 60000 } // Refetch every minute
  );
}

export function useUnreadNotificationCount(userId: string | undefined) {
  return useSupabaseQuery(
    () => {
      if (!userId) return Promise.resolve(0);
      return notificationsService.getUnreadCount(userId);
    },
    [userId],
    { enabled: !!userId, refetchInterval: 30000 } // Refetch every 30 seconds
  );
}

export function useMarkNotificationAsRead() {
  return useSupabaseMutation<void, string>(
    (id) => notificationsService.markAsRead(id).then(() => {})
  );
}

export function useMarkAllNotificationsAsRead() {
  return useSupabaseMutation<void, string>(
    (userId) => notificationsService.markAllAsRead(userId)
  );
}

// ============================================================================
// COMBINED DASHBOARD HOOK
// ============================================================================

export function useDashboardData(userId: string | undefined) {
  const artworkStats = useArtworkStatusCounts(userId);
  const recentArtworks = useRecentArtworks(userId, 6);
  const recentContacts = useRecentContacts(userId, 5);
  const salesStats = useSalesStats(userId);
  const monthlySales = useMonthlySales(userId);
  const recentActivities = useRecentActivities(userId, 8);
  const unreadCount = useUnreadNotificationCount(userId);

  const isLoading = 
    artworkStats.isLoading ||
    recentArtworks.isLoading ||
    recentContacts.isLoading ||
    salesStats.isLoading ||
    monthlySales.isLoading ||
    recentActivities.isLoading;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      artworkStats.refetch(),
      recentArtworks.refetch(),
      recentContacts.refetch(),
      salesStats.refetch(),
      monthlySales.refetch(),
      recentActivities.refetch(),
      unreadCount.refetch(),
    ]);
  }, [artworkStats, recentArtworks, recentContacts, salesStats, monthlySales, recentActivities, unreadCount]);

  return {
    artworkStats: artworkStats.data,
    recentArtworks: recentArtworks.data,
    recentContacts: recentContacts.data,
    salesStats: salesStats.data,
    monthlySales: monthlySales.data,
    recentActivities: recentActivities.data,
    unreadNotificationCount: unreadCount.data,
    isLoading,
    refetchAll,
  };
}
