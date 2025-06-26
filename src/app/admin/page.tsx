"use client"

import { useState, useEffect } from 'react'
import { BarChart3, DollarSign, Users, BookOpen } from 'lucide-react'

interface StatsCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down'
}

export default function AdminDashboard() {
  const [statsCards, setStatsCards] = useState<StatsCard[]>([
    {
      title: 'Users',
      value: '0',
      change: '0%',
      icon: <Users className="w-8 h-8 text-blue-600" />,
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: '$0',
      change: '0%',
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      trend: 'up',
    },
    {
      title: 'Active Courses',
      value: '0',
      change: '0%',
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      trend: 'up',
    },
    {
      title: 'Completion Rate',
      value: '0%',
      change: '0%',
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      trend: 'up',
    },
  ])

  // Simulate loading data from API
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setTimeout(() => {
      setStatsCards([
        {
          title: 'Users',
          value: '2,340',
          change: '+12%',
          icon: <Users className="w-8 h-8 text-blue-600" />,
          trend: 'up',
        },
        {
          title: 'Revenue',
          value: '$45,672',
          change: '+8.5%',
          icon: <DollarSign className="w-8 h-8 text-green-600" />,
          trend: 'up',
        },
        {
          title: 'Active Courses',
          value: '124',
          change: '+24%',
          icon: <BookOpen className="w-8 h-8 text-purple-600" />,
          trend: 'up',
        },
        {
          title: 'Completion Rate',
          value: '64%',
          change: '-2.5%',
          icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
          trend: 'down',
        },
      ])
    }, 1000)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
              </div>
              <div className="self-center rounded-full p-3 bg-gray-100 dark:bg-gray-700">
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-xs font-semibold ${
                card.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {card.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User Growth</h4>
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart will render here</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Revenue Trends</h4>
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart will render here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h4>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Activity</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  John Doe
                </th>
                <td className="px-6 py-4">Purchased Premium Membership</td>
                <td className="px-6 py-4">Today, 10:45 AM</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Mary Smith
                </th>
                <td className="px-6 py-4">Completed Advanced Grammar Course</td>
                <td className="px-6 py-4">Yesterday, 3:22 PM</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Sam Johnson
                </th>
                <td className="px-6 py-4">Created a new account</td>
                <td className="px-6 py-4">Yesterday, 9:15 AM</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
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