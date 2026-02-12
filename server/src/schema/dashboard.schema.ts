import { z } from 'zod'

// Dashboard stats filters schema - for filtering dashboard statistics by date range and other parameters
export const dashboardStatsSchema = z.object({
  startDate: z.string().optional(), // ISO date string format
  endDate: z.string().optional(), // ISO date string format
  period: z.enum(['7d', '30d', '90d', '1y', 'all']).optional(), // Predefined date periods
})

// Dashboard video stats schema - for video-specific statistics
export const dashboardVideoStatsSchema = z.object({
  videoId: z.string().uuid('Invalid video ID format'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Validation helpers
export const validateDashboardStats = (data: unknown) => {
  return dashboardStatsSchema.safeParse(data)
}

export const validateDashboardVideoStats = (data: unknown) => {
  return dashboardVideoStatsSchema.safeParse(data)
}

// Type definitions
export type DashboardStatsInput = z.infer<typeof dashboardStatsSchema>
export type DashboardVideoStatsInput = z.infer<typeof dashboardVideoStatsSchema>
