// ============================================================================
// ARTCONNECT CRM - SERVICES INDEX
// ============================================================================

// Export all services
export { artworksService } from './artworks.service';
export { contactsService } from './contacts.service';
export { salesService } from './sales.service';
export { pipelineService } from './pipeline.service';
export { userService } from './user.service';
export { activityService } from './activity.service';
export { notificationsService } from './notifications.service';
export { groqService } from './groq.service';
export { reportGeneratorService } from './report-generator.service';

// Export types from artworks service
export type {
  ArtworkFilters,
  ArtworkPagination,
} from './artworks.service';

// Export types from contacts service
export type {
  ContactFilters,
  ContactPagination,
} from './contacts.service';

// Export types from sales service
export type {
  SaleFilters,
  SalePagination,
  SalesStats,
  MonthlySalesData,
} from './sales.service';

// Export types from pipeline service
export type {
  PipelineColumn,
  PipelineData,
  PipelineSummary,
} from './pipeline.service';

// Export types from user service
export type {
  UserProfile,
  CreateUserParams,
} from './user.service';

// Export types from activity service
export type {
  FormattedActivity,
} from './activity.service';

// Export types from notifications service
export type {
  NotificationWithFormat,
  NotificationType,
  CreateNotificationParams,
} from './notifications.service';

// Export types from groq service
export type {
  GroqMessage,
  ReportData,
  FormattedReport,
  ReportSection,
  TableData,
  StatItem,
} from './groq.service';

// Export types from report generator service
export type {
  GenerateReportOptions,
  GeneratedReportResult,
} from './report-generator.service';

// Common types
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

