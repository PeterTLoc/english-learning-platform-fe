import api from '@/lib/api'

interface RevenueData {
  Date: string
  Revenue: number
}

interface NewUsersData {
  Date: string
  Count: number
}

interface StatisticResponse {
  revenue: RevenueData[]
  message: string
}

interface NewUsersResponse {
  newUserOverTime: NewUsersData[]
  message: string
}

interface CompletionRateResponse {
  completionRate: number
  message: string
}

// Time type enum to match backend
export const TimeType = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
} as const

export type TimeType = typeof TimeType[keyof typeof TimeType]

export const statisticService = {
  getRevenueOverTime: async (time: TimeType, value: number) => {
    const response = await api.get<StatisticResponse>(`/api/statistics/revenue?time=${time}&value=${value}`)
    return response.data
  },

  getNewUsers: async (time: TimeType, value: number) => {
    const response = await api.get<NewUsersResponse>(`/api/statistics/new-users?time=${time}&value=${value}`)
    return response.data
  },

  getCompletionRate: async () => {
    const response = await api.get<CompletionRateResponse>('/api/statistics/completion-rate')
    return response.data
  },

  getDashboardStats: async () => {
    // Get last 30 days data
    const [revenueResponse, usersResponse, completionResponse] = await Promise.all([
      api.get<StatisticResponse>(`/api/statistics/revenue?time=${TimeType.DAY}&value=30`),
      api.get<NewUsersResponse>(`/api/statistics/new-users?time=${TimeType.DAY}&value=30`),
      api.get<CompletionRateResponse>('/api/statistics/completion-rate')
    ])

    const revenue = revenueResponse.data.revenue
    const users = usersResponse.data.newUserOverTime

    // Calculate trends
    const currentRevenue = revenue[revenue.length - 1]?.Revenue || 0
    const lastRevenue = revenue[revenue.length - 2]?.Revenue || 0
    const revenueTrend = lastRevenue ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

    const currentUsers = users[users.length - 1]?.Count || 0
    const lastUsers = users[users.length - 2]?.Count || 0
    const usersTrend = lastUsers ? ((currentUsers - lastUsers) / lastUsers) * 100 : 0

    const totalUsers = users.reduce((acc, curr) => acc + (curr.Count || 0), 0)
    const completionRate = completionResponse.data.completionRate

    return {
      currentRevenue,
      revenueTrend: isFinite(revenueTrend) ? revenueTrend : 0,
      totalUsers,
      usersTrend: isFinite(usersTrend) ? usersTrend : 0,
      completionRate,
      revenueHistory: revenue.map(r => r.Revenue),
      usersHistory: users.map(u => u.Count)
    }
  }
} 