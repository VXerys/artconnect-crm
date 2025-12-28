// ============================================================================
// ARTCONNECT CRM - HOOKS INDEX
// ============================================================================

// Export Supabase hooks
export {
  useSupabaseQuery,
  useSupabaseMutation,
  useRealtimeSubscription,
  useSupabaseConnection,
  useOptimisticUpdate,
  usePagination,
  useDebouncedSearch,
} from './useSupabase';

// Export data hooks
export {
  // Artworks
  useArtworksQuery,
  useArtworkByIdQuery,
  useArtworkStatusCounts,
  useRecentArtworks,
  useCreateArtwork,
  useUpdateArtwork,
  useDeleteArtwork,
  // Contacts
  useContactsQuery,
  useContactByIdQuery,
  useContactTypeCounts,
  useRecentContacts,
  useVipContacts,
  useContactSearch,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  // Sales
  useSalesQuery,
  useSalesStats,
  useMonthlySales,
  useRecentSales,
  useCreateSale,
  useUpdateSale,
  useCompleteSale,
  // Pipeline
  usePipelineData,
  usePipelineSummary,
  useUpcomingPipelineItems,
  useOverduePipelineItems,
  // Activity
  useRecentActivities,
  useActivityStats,
  // Notifications
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  // Dashboard
  useDashboardData,
} from './useDataHooks';

// Export types
export type {
  UseSupabaseQueryOptions,
  UseSupabaseQueryResult,
  UseMutationResult,
} from './useSupabase';
