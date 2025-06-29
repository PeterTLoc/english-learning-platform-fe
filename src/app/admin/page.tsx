"use client"

import { useState, useEffect } from 'react'
import { BarChart3, DollarSign, Users, BookOpen } from 'lucide-react'
import { statisticService } from '@/services/statisticService'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface StatsCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down'
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [statsCards, setStatsCards] = useState<StatsCard[]>([
    {
      title: 'Users',
      value: '0',
      change: '0%',
      icon: <Users className="w-8 h-8 text-[#4CC2FF]" />,
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: '$0',
      change: '0%',
      icon: <DollarSign className="w-8 h-8 text-[#4CC2FF]" />,
      trend: 'up',
    },
    {
      title: 'Active Courses',
      value: '0',
      change: '0%',
      icon: <BookOpen className="w-8 h-8 text-[#4CC2FF]" />,
      trend: 'up',
    },
    {
      title: 'Completion Rate',
      value: '0%',
      change: '0%',
      icon: <BarChart3 className="w-8 h-8 text-[#4CC2FF]" />,
      trend: 'up',
    },
  ])

  const [revenueHistory, setRevenueHistory] = useState<number[]>([])
  const [usersHistory, setUsersHistory] = useState<number[]>([])

  // Use useEffect with a cleanup function to prevent double fetching
  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        const stats = await statisticService.getDashboardStats()
        
        if (!mounted) return;

        setStatsCards([
          {
            title: 'Users',
            value: stats.totalUsers.toLocaleString(),
            change: `${stats.usersTrend.toFixed(1)}%`,
            icon: <Users className="w-8 h-8 text-[#4CC2FF]" />,
            trend: stats.usersTrend >= 0 ? 'up' : 'down',
          },
          {
            title: 'Revenue',
            value: `$${stats.currentRevenue.toLocaleString()}`,
            change: `${stats.revenueTrend.toFixed(1)}%`,
            icon: <DollarSign className="w-8 h-8 text-[#4CC2FF]" />,
            trend: stats.revenueTrend >= 0 ? 'up' : 'down',
          },
          {
            title: 'Active Courses',
            value: '124', // TODO: Add API endpoint for course stats
            change: '+24%',
            icon: <BookOpen className="w-8 h-8 text-[#4CC2FF]" />,
            trend: 'up',
          },
          {
            title: 'Completion Rate',
            value: `${stats.completionRate.toFixed(1)}%`,
            change: '0%', // TODO: Add trend calculation for completion rate
            icon: <BarChart3 className="w-8 h-8 text-[#4CC2FF]" />,
            trend: 'up',
          },
        ])

        setRevenueHistory(stats.revenueHistory)
        setUsersHistory(stats.usersHistory)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
    }
  }, []) // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-[#202020] border border-[#1D1D1D] rounded-lg shadow p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-[#CFCFCF]">{card.title}</p>
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
              </div>
              <div className="self-center rounded-full p-3 bg-[#373737]">
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-xs font-semibold ${
                card.trend === 'up' ? 'text-[#4CC2FF]' : 'text-red-500'
              }`}>
                {card.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-white mb-3">User Growth</h4>
          <div className="w-full h-64 bg-[#373737] rounded-lg flex items-center justify-center">
            {/* TODO: Add chart component using usersHistory data */}
            <p className="text-[#CFCFCF]">Chart will render here</p>
          </div>
        </div>

        <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-white mb-3">Revenue Trends</h4>
          <div className="w-full h-64 bg-[#373737] rounded-lg flex items-center justify-center">
            {/* TODO: Add chart component using revenueHistory data */}
            <p className="text-[#CFCFCF]">Chart will render here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg shadow p-5">
        <h4 className="text-lg font-semibold text-white mb-3">Recent Activity</h4>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#CFCFCF]">
            <thead className="text-xs text-white uppercase bg-[#373737]">
              <tr>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Activity</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: Add API endpoint for recent activity */}
              <tr className="bg-[#202020] border-b border-[#1D1D1D]">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  John Doe
                </th>
                <td className="px-6 py-4">Purchased Premium Membership</td>
                <td className="px-6 py-4">Today, 10:45 AM</td>
                <td className="px-6 py-4">
                  <span className="bg-[#373737] text-[#4CC2FF] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="bg-[#202020] border-b border-[#1D1D1D]">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  Mary Smith
                </th>
                <td className="px-6 py-4">Completed Advanced Grammar Course</td>
                <td className="px-6 py-4">Yesterday, 3:22 PM</td>
                <td className="px-6 py-4">
                  <span className="bg-[#373737] text-[#4CC2FF] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="bg-[#202020]">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  Sam Johnson
                </th>
                <td className="px-6 py-4">Created a new account</td>
                <td className="px-6 py-4">Yesterday, 9:15 AM</td>
                <td className="px-6 py-4">
                  <span className="bg-[#373737] text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    New
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}