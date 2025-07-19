import api from '@/lib/api'

interface RevenueData {
  Date: string
  Revenue: number
}

interface NewUsersData {
  Date: string
  newUsers: number
}

interface CompletionRateResponse {
  completionRate: number
  message: string
}

interface PeriodBreakdown<T> {
  breakdown: T[];
  total: number;
}

interface RevenuePeriod {
  current: PeriodBreakdown<RevenueData>;
  previous: PeriodBreakdown<RevenueData>;
}

interface NewUsersPeriod {
  current: PeriodBreakdown<NewUsersData>;
  previous: PeriodBreakdown<NewUsersData>;
}

// Time type enum to match backend
export const TimeType = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
} as const

export type TimeType = typeof TimeType[keyof typeof TimeType]

const statisticService = {
  getRevenueOverTime: async (time: string, value: number): Promise<{ revenue: RevenuePeriod; message: string }> => {
    const response = await api.get(`/api/statistics/revenue?time=${time}&value=${value}`);
    return response.data;
  },
  getNewUsersOverTime: async (time: string, value: number): Promise<{ newUserOverTime: NewUsersPeriod; message: string }> => {
    const response = await api.get(`/api/statistics/new-users?time=${time}&value=${value}`);
    return response.data;
  },

  getCompletionRate: async () => {
    const response = await api.get<CompletionRateResponse>('/api/statistics/completion-rate')
    return response.data
  },

  getActiveCourseCount: async (): Promise<number> => {
    const response = await api.get('/api/statistics/active-courses');
    return response.data.activeCourseCount;
  },

  getDashboardStats: async () => {
    // Get last 12 months data
    const [revenueResponse, usersResponse, completionResponse] = await Promise.all([
      api.get(`/api/statistics/revenue?time=${TimeType.MONTH}&value=12`),
      api.get(`/api/statistics/new-users?time=${TimeType.MONTH}&value=12`),
      api.get<CompletionRateResponse>('/api/statistics/completion-rate')
    ])

    const revenue = (revenueResponse.data as { revenue: RevenuePeriod }).revenue.current.breakdown;
    const users = (usersResponse.data as { newUserOverTime: NewUsersPeriod }).newUserOverTime.current.breakdown;

    // Calculate trends using the current period total vs previous period total
    const currentRevenue = (revenueResponse.data as { revenue: RevenuePeriod }).revenue.current.total;
    const previousRevenue = (revenueResponse.data as { revenue: RevenuePeriod }).revenue.previous.total;
    const revenueTrend = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const currentUsers = (usersResponse.data as { newUserOverTime: NewUsersPeriod }).newUserOverTime.current.total;
    const previousUsers = (usersResponse.data as { newUserOverTime: NewUsersPeriod }).newUserOverTime.previous.total;
    const usersTrend = previousUsers ? ((currentUsers - previousUsers) / previousUsers) * 100 : 0;

    const totalUsers = users.reduce((acc, curr) => acc + (curr.newUsers || 0), 0)
    const completionRate = completionResponse.data.completionRate

    return {
      currentRevenue,
      revenueTrend: isFinite(revenueTrend) ? revenueTrend : 0,
      totalUsers,
      usersTrend: isFinite(usersTrend) ? usersTrend : 0,
      completionRate,
      revenueHistory: revenue.map(r => r.Revenue),
      usersHistory: users.map(u => u.newUsers)
    }
  }
}

export { statisticService }; 