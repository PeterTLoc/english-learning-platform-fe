"use client";

import { statisticService, TimeType } from "@/services/statisticService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

interface StatsCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#4CC2FF]/20 rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <p className="text-[#CFCFCF] text-sm font-medium">{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[#4CC2FF] text-sm font-semibold">
            {`${entry.name}: ${
              formatter ? formatter(entry.value) : entry.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [statsCards, setStatsCards] = useState<StatsCard[]>([
    {
      title: "Users",
      value: "0",
      change: "0%",
      icon: <Users className="w-8 h-8 text-[#4CC2FF]" />,
      trend: "up",
    },
    {
      title: "Revenue",
      value: "0 VNĐ",
      change: "0%",
      icon: <DollarSign className="w-8 h-8 text-[#4CC2FF]" />,
      trend: "up",
    },
    {
      title: "Active Courses",
      value: "0",
      change: "0%",
      icon: <BookOpen className="w-8 h-8 text-[#4CC2FF]" />,
      trend: "up",
    },
    {
      title: "Completion Rate",
      value: "0%",
      change: "0%",
      icon: <BarChart3 className="w-8 h-8 text-[#4CC2FF]" />,
      trend: "up",
    },
  ]);

  const [revenueHistory, setRevenueHistory] = useState<number[]>([]);
  const [usersHistory, setUsersHistory] = useState<number[]>([]);

  // Chart filter state
  const [userGrowthFilter, setUserGrowthFilter] = useState({
    time: "month",
    value: 12,
  });
  const [revenueFilter, setRevenueFilter] = useState({
    time: "month",
    value: 12,
  });
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthLoading, setUserGrowthLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Use useEffect with a cleanup function to prevent double fetching
  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        const stats = await statisticService.getDashboardStats();

        if (!mounted) return;

        setStatsCards([
          {
            title: "Users",
            value: stats.totalUsers.toLocaleString(),
            change: `${stats.usersTrend.toFixed(1)}%`,
            icon: <Users className="w-8 h-8 text-[#4CC2FF]" />,
            trend: stats.usersTrend >= 0 ? "up" : "down",
          },
          {
            title: "Revenue",
            value: `${stats.currentRevenue.toLocaleString()} VND`,
            change: `${stats.revenueTrend.toFixed(1)}%`,
            icon: <DollarSign className="w-8 h-8 text-[#4CC2FF]" />,
            trend: stats.revenueTrend >= 0 ? "up" : "down",
          },
          {
            title: "Active Courses",
            value: "124", // TODO: Add API endpoint for course stats
            change: "+24%",
            icon: <BookOpen className="w-8 h-8 text-[#4CC2FF]" />,
            trend: "up",
          },
          {
            title: "Completion Rate",
            value: `${stats.completionRate.toFixed(1)}%`,
            change: "0%", // TODO: Add trend calculation for completion rate
            icon: <BarChart3 className="w-8 h-8 text-[#4CC2FF]" />,
            trend: "up",
          },
        ]);

        setRevenueHistory(stats.revenueHistory);
        setUsersHistory(stats.usersHistory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Fetch user growth data
  useEffect(() => {
    setUserGrowthLoading(true);
    statisticService
      .getNewUsers(userGrowthFilter.time as TimeType, userGrowthFilter.value)
      .then((res) => {
        // Map API data to chart format
        setUserGrowthData(
          (res.newUserOverTime || []).map((item: any) => ({
            label: item.Date,
            value: item.newUsers,
          }))
        );
      })
      .finally(() => setUserGrowthLoading(false));
  }, [userGrowthFilter]);

  // Fetch revenue data
  useEffect(() => {
    setRevenueLoading(true);
    statisticService
      .getRevenueOverTime(revenueFilter.time as TimeType, revenueFilter.value)
      .then((res) => {
        setRevenueData(
          (res.revenue || []).map((item: any) => ({
            label: item.Date,
            value: item.Revenue,
          }))
        );
      })
      .finally(() => setRevenueLoading(false));
  }, [revenueFilter]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <LoadingSpinner />
        <p className="text-[#CFCFCF]">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6">
      <h1 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-[#4CC2FF] to-[#66D9FF] bg-clip-text text-transparent">
        Dashboard Overview
      </h1>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#242424] to-[#1e1e1e] border border-[#333] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#4CC2FF]/30"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#CFCFCF] mb-2">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {card.value}
                </h3>
                <div className="flex items-center gap-2">
                  {card.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      card.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {card.change} from last month
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#4CC2FF]/20 to-[#66D9FF]/20 rounded-full p-3 backdrop-blur-sm">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-gradient-to-br from-[#242424] to-[#1e1e1e] border border-[#333] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-white">User Growth</h4>
            <div className="flex gap-3">
              <select
                value={userGrowthFilter.time}
                onChange={(e) => {
                  const newTime = e.target.value;
                  setUserGrowthFilter((f) => ({
                    time: newTime,
                    value:
                      newTime === "month"
                        ? new Date().getMonth() + 1
                        : currentYear,
                  }));
                }}
                className="bg-[#333] text-white rounded-lg px-3 py-2 text-sm border border-[#444] hover:border-[#4CC2FF]/50 transition-colors"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              {userGrowthFilter.time === "month" ? (
                <select
                  value={userGrowthFilter.value}
                  onChange={(e) =>
                    setUserGrowthFilter((f) => ({
                      ...f,
                      value: Number(e.target.value),
                    }))
                  }
                  className="bg-[#333] text-white rounded-lg px-3 py-2 text-sm border border-[#444] hover:border-[#4CC2FF]/50 transition-colors"
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={userGrowthFilter.value}
                  onChange={(e) =>
                    setUserGrowthFilter((f) => ({
                      ...f,
                      value: Number(e.target.value),
                    }))
                  }
                  className="bg-[#333] text-white rounded-lg px-3 py-2 text-sm border border-[#444] hover:border-[#4CC2FF]/50 transition-colors"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="w-full h-80 bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] rounded-lg p-4 border border-[#333]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={userGrowthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CC2FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4CC2FF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="label"
                  stroke="#CFCFCF"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#CFCFCF" }}
                />
                <YAxis
                  stroke="#CFCFCF"
                  allowDecimals={false}
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#CFCFCF" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4CC2FF"
                  strokeWidth={3}
                  fill="url(#userGradient)"
                  name="New Users"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4CC2FF"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#4CC2FF",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#4CC2FF",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gradient-to-br from-[#242424] to-[#1e1e1e] border border-[#333] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-semibold text-white">Revenue Trends</h4>
            <div className="flex gap-3">
              <select
                value={revenueFilter.time}
                onChange={(e) => {
                  const newTime = e.target.value;
                  setRevenueFilter((f) => ({
                    time: newTime,
                    value:
                      newTime === "month"
                        ? new Date().getMonth() + 1
                        : currentYear,
                  }));
                }}
                className="bg-[#333] text-white rounded-lg px-3 py-2 text-sm border border-[#444] hover:border-[#4CC2FF]/50 transition-colors"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              {revenueFilter.time === "month" ? (
                <select
                  value={revenueFilter.value}
                  onChange={(e) =>
                    setRevenueFilter((f) => ({
                      ...f,
                      value: Number(e.target.value),
                    }))
                  }
                  className="bg-[#333] text-white rounded-lg px-3 py-2 text-sm border border-[#444] hover:border-[#4CC2FF]/50 transition-colors"
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={revenueFilter.value}
                  onChange={(e) =>
                    setRevenueFilter((f) => ({
                      ...f,
                      value: Number(e.target.value),
                    }))
                  }
                  className="bg-[#333] text-white rounded-lg px-3 py-2 text-sm border border-[#444] hover:border-[#4CC2FF]/50 transition-colors"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="w-full h-80 bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] rounded-lg p-4 border border-[#333]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#66D9FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#66D9FF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="label"
                  stroke="#CFCFCF"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#CFCFCF" }}
                />
                <YAxis
                  stroke="#CFCFCF"
                  allowDecimals={false}
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#CFCFCF" }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      formatter={(value: number) =>
                        `${value.toLocaleString()} VND`
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#66D9FF"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#66D9FF"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#66D9FF",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#66D9FF",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="bg-gradient-to-br from-[#242424] to-[#1e1e1e] border border-[#333] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <h4 className="text-xl font-semibold text-white mb-6">
          Recent Activity
        </h4>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#CFCFCF]">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-[#4CC2FF]/20 to-[#66D9FF]/20 backdrop-blur-sm">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">
                  User
                </th>
                <th scope="col" className="px-6 py-4">
                  Activity
                </th>
                <th scope="col" className="px-6 py-4">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 rounded-tr-lg">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#222] border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  John Doe
                </th>
                <td className="px-6 py-4">Purchased Premium Membership</td>
                <td className="px-6 py-4">Today, 10:45 AM</td>
                <td className="px-6 py-4">
                  <span className="bg-green-500/20 text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/30">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="bg-[#222] border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  Mary Smith
                </th>
                <td className="px-6 py-4">Completed Advanced Grammar Course</td>
                <td className="px-6 py-4">Yesterday, 3:22 PM</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30">
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="bg-[#222] hover:bg-[#2a2a2a] transition-colors">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  Sam Johnson
                </th>
                <td className="px-6 py-4">Created a new account</td>
                <td className="px-6 py-4">Yesterday, 9:15 AM</td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-medium px-3 py-1 rounded-full border border-yellow-500/30">
                    New
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
