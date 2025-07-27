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

  getTotalUserCount: async (): Promise<number> => {
    const response = await api.get('/api/statistics/total-users');
    return response.data.totalUserCount;
  },

  getDashboardStats: async () => {
    try {
      // Get current month and last month data for comparison
      // Backend expects 0-based months (0-11), but subtracts 1 from the value we send
      // So we need to send currentMonth + 1 to get current month data
      const currentMonth = new Date().getMonth(); // 0-based
      const currentYear = new Date().getFullYear();
      
      // Calculate last month (0-based)
      let lastMonth = currentMonth - 1;
      let lastYear = currentYear;
      if (lastMonth === -1) {
        lastMonth = 11;
        lastYear = currentYear - 1;
      }

      // Fetch current month data (this API call returns both current and previous data)
      // Backend subtracts 1 from the value, so we send currentMonth + 1 to get current month
      const [currentRevenueResponse, currentUsersResponse] = await Promise.all([
        api.get(`/api/statistics/revenue?time=month&value=${currentMonth + 1}`),
        api.get(`/api/statistics/new-users?time=month&value=${currentMonth + 1}`)
      ]);

      // Get completion rate
      const completionResponse = await api.get('/api/statistics/completion-rate');

      // Get total user count
      const totalUsersResponse = await api.get('/api/statistics/total-users');

      // Extract data - the API returns both current and previous data
      const currentRevenue = Number(currentRevenueResponse.data.revenue.current.total);
      const lastRevenue = Number(currentRevenueResponse.data.revenue.previous.total); // Use previous from same API call
      const currentUsers = Number(currentUsersResponse.data.newUserOverTime.current.total);
      const lastUsers = Number(currentUsersResponse.data.newUserOverTime.previous.total); // Use previous from same API call
      const completionRate = completionResponse.data.completionRate;
      const completionTrend = completionResponse.data.completionTrend;
      const totalUsers = totalUsersResponse.data.totalUserCount;

      // Debug logging
      console.log('Revenue Debug:', {
        currentRevenue,
        lastRevenue,
        currentMonth: currentMonth + 1,
        requestedMonth: currentMonth + 1,
        calculation: lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0,
        apiUrl: `/api/statistics/revenue?time=month&value=${currentMonth + 1}`
      });

      // Calculate trends
      const revenueTrend = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
      const usersTrend = lastUsers > 0 ? ((currentUsers - lastUsers) / lastUsers) * 100 : 0;

      return {
        currentRevenue,
        revenueTrend: isFinite(revenueTrend) ? revenueTrend : 0,
        totalUsers,
        usersTrend: isFinite(usersTrend) ? usersTrend : 0,
        completionRate,
        completionTrend: isFinite(completionTrend) ? completionTrend : 0,
        revenueHistory: currentRevenueResponse.data.revenue.current.breakdown.map((r: any) => r.Revenue),
        usersHistory: currentUsersResponse.data.newUserOverTime.current.breakdown.map((u: any) => u.newUsers)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if API calls fail
      return {
        currentRevenue: 0,
        revenueTrend: 0,
        totalUsers: 0,
        usersTrend: 0,
        completionRate: 0,
        completionTrend: 0,
        revenueHistory: [],
        usersHistory: []
      };
    }
  }
}

export { statisticService }; 