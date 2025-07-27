"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { statisticService } from "@/services/statisticService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatsCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const getYearsList = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2000; y--) {
    years.push(y);
  }
  return years;
};

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

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
      change: "",
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
  const [userGrowthFilter, setUserGrowthFilter] = useState({
    time: "month",
    value: 12,
  });
  const [revenueFilter, setRevenueFilter] = useState({
    time: "month",
    value: 12,
  });
  const [userGrowthData, setUserGrowthData] = useState<
    { label: string; value: number }[]
  >([]);
  const [revenueData, setRevenueData] = useState<
    { label: string; value: number }[]
  >([]);
  const [userGrowthLoading, setUserGrowthLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [activeCourseCount, setActiveCourseCount] = useState<number>(0);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // New: filter type state
  const [userGrowthType, setUserGrowthType] = useState<"year" | "month">(
    "year"
  );
  const [userGrowthYear, setUserGrowthYear] = useState(currentYear);
  const [userGrowthMonth, setUserGrowthMonth] = useState(currentMonth);

  const [revenueType, setRevenueType] = useState<"year" | "month">("year");
  const [revenueYear, setRevenueYear] = useState(currentYear);
  const [revenueMonth, setRevenueMonth] = useState(currentMonth);

  const [userGrowthPeriod, setUserGrowthPeriod] = useState<any>(null);
  const [revenuePeriod, setRevenuePeriod] = useState<any>(null);
  const [userGrowthPercent, setUserGrowthPercent] = useState<number | null>(
    null
  );
  const [revenuePercent, setRevenuePercent] = useState<number | null>(null);

  // Use useEffect with a cleanup function to prevent double fetching
  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        const stats = await statisticService.getDashboardStats();
        const activeCourses = await statisticService.getActiveCourseCount();
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
            value: activeCourses.toLocaleString(),
            change: "",
            icon: <BookOpen className="w-8 h-8 text-[#4CC2FF]" />,
            trend: "up",
          },
          {
            title: "Completion Rate",
            value: `${stats.completionRate.toFixed(1)}%`,
            change: `${stats.completionTrend.toFixed(1)}%`,
            icon: <BarChart3 className="w-8 h-8 text-[#4CC2FF]" />,
            trend: stats.completionTrend >= 0 ? "up" : "down",
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
      .getNewUsersOverTime(userGrowthFilter.time, userGrowthFilter.value)
      .then((res) => {
        if (res.newUserOverTime) {
          setUserGrowthPeriod(res.newUserOverTime);
          // Calculate growth percent
          const curr = res.newUserOverTime.current.total;
          const prev = res.newUserOverTime.previous.total;
          let percent = null;
          if (prev === 0 && curr > 0) percent = 100;
          else if (prev === 0 && curr === 0) percent = 0;
          else percent = ((curr - prev) / Math.abs(prev)) * 100;
          setUserGrowthPercent(percent);
        } else {
          setUserGrowthPeriod(null);
          setUserGrowthPercent(null);
        }
      })
      .finally(() => setUserGrowthLoading(false));
  }, [userGrowthFilter]);

  // Fetch revenue data
  useEffect(() => {
    setRevenueLoading(true);
    statisticService
      .getRevenueOverTime(revenueFilter.time, revenueFilter.value)
      .then((res) => {
        if (res.revenue) {
          setRevenuePeriod(res.revenue);
          // Calculate growth percent
          const curr = res.revenue.current.total;
          const prev = res.revenue.previous.total;
          let percent = null;
          if (prev === 0 && curr > 0) percent = 100;
          else if (prev === 0 && curr === 0) percent = 0;
          else percent = ((curr - prev) / Math.abs(prev)) * 100;
          setRevenuePercent(percent);
        } else {
          setRevenuePeriod(null);
          setRevenuePercent(null);
        }
      })
      .finally(() => setRevenueLoading(false));
  }, [revenueFilter]);

  // Update filter logic for user growth
  useEffect(() => {
    if (userGrowthType === "year") {
      setUserGrowthFilter({ time: "year", value: userGrowthYear });
    } else {
      setUserGrowthFilter({ time: "month", value: userGrowthMonth });
    }
  }, [userGrowthType, userGrowthYear, userGrowthMonth]);

  // Update filter logic for revenue
  useEffect(() => {
    if (revenueType === "year") {
      setRevenueFilter({ time: "year", value: revenueYear });
    } else {
      setRevenueFilter({ time: "month", value: revenueMonth });
    }
  }, [revenueType, revenueYear, revenueMonth]);

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

      {/* Charts Section */}
      <div className="flex flex-col gap-4 mb-8">
        {/* User Growth Chart with Filters */}
        <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-white mb-3">User Growth</h4>
          <div className="flex gap-2 mb-4">
            {/* Select List A */}
            <select
              value={userGrowthType}
              onChange={(e) =>
                setUserGrowthType(e.target.value as "year" | "month")
              }
              className="bg-[#232323] text-white rounded px-2 py-1"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
            </select>
            {/* If year is selected, show Select List B and C */}
            {userGrowthType === "year" && (
              <>
                <select
                  value={userGrowthYear}
                  onChange={(e) => setUserGrowthYear(Number(e.target.value))}
                  className="bg-[#232323] text-white rounded px-2 py-1"
                >
                  {getYearsList().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={userGrowthMonth}
                  onChange={(e) => setUserGrowthMonth(Number(e.target.value))}
                  className="bg-[#232323] text-white rounded px-2 py-1"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {/* If month is selected, show only Select List C */}
            {userGrowthType === "month" && (
              <select
                value={userGrowthMonth}
                onChange={(e) => setUserGrowthMonth(Number(e.target.value))}
                className="bg-[#232323] text-white rounded px-2 py-1"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="w-full h-[500px] bg-[#373737] py-4 rounded-lg flex flex-col items-center justify-center">
            {userGrowthLoading ? (
              <div className="h-full">
                <LoadingSpinner size="medium" />
              </div>
            ) : userGrowthPeriod &&
              userGrowthPeriod.current.breakdown.length > 0 ? (
              <>
                <Line
                  style={{ width: "100%", height: "100%" }}
                  data={{
                    labels: userGrowthPeriod.current.breakdown.map(
                      (d: any) => d.Date
                    ),
                    datasets: [
                      {
                        label: "New Users",
                        data: userGrowthPeriod.current.breakdown.map(
                          (d: any) => d.newUsers
                        ),
                        borderColor: "#4CC2FF",
                        backgroundColor: "rgba(76,194,255,0.2)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      x: { ticks: { color: "#CFCFCF" } },
                      y: { ticks: { color: "#CFCFCF" } },
                    },
                  }}
                />
                <div className="mt-2 text-[#CFCFCF] text-sm">
                  <span>
                    Current: <b>{userGrowthPeriod.current.total}</b>
                  </span>
                  <span className="ml-4">
                    Previous: <b>{userGrowthPeriod.previous.total}</b>
                  </span>
                  <span className="ml-4">
                    Growth:{" "}
                    <b>
                      {userGrowthPercent !== null
                        ? userGrowthPercent.toFixed(1) + "%"
                        : "-"}
                    </b>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[#CFCFCF]">No data available</p>
            )}
          </div>
        </div>
        {/* Revenue Chart with Filters */}
        <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg shadow p-5">
          <h4 className="text-lg font-semibold text-white mb-3">
            Revenue Trends
          </h4>
          <div className="flex gap-2 mb-4">
            {/* Select List A */}
            <select
              value={revenueType}
              onChange={(e) =>
                setRevenueType(e.target.value as "year" | "month")
              }
              className="bg-[#232323] text-white rounded px-2 py-1"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
            </select>
            {/* If year is selected, show Select List B and C */}
            {revenueType === "year" && (
              <>
                <select
                  value={revenueYear}
                  onChange={(e) => setRevenueYear(Number(e.target.value))}
                  className="bg-[#232323] text-white rounded px-2 py-1"
                >
                  {getYearsList().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={revenueMonth}
                  onChange={(e) => setRevenueMonth(Number(e.target.value))}
                  className="bg-[#232323] text-white rounded px-2 py-1"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {/* If month is selected, show only Select List C */}
            {revenueType === "month" && (
              <select
                value={revenueMonth}
                onChange={(e) => setRevenueMonth(Number(e.target.value))}
                className="bg-[#232323] text-white rounded px-2 py-1"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="w-full min-w-0 h-[500px] bg-[#373737] rounded-lg flex flex-col items-center justify-center p-4">
            {revenueLoading ? (
              <LoadingSpinner />
            ) : revenuePeriod && revenuePeriod.current.breakdown.length > 0 ? (
              <>
                <Line
                  style={{ width: "100%", height: "100%" }}
                  data={{
                    labels: revenuePeriod.current.breakdown.map(
                      (d: any) => d.Date
                    ),
                    datasets: [
                      {
                        label: "Revenue",
                        data: revenuePeriod.current.breakdown.map(
                          (d: any) => d.Revenue
                        ),
                        borderColor: "#4CC2FF",
                        backgroundColor: "rgba(76,194,255,0.2)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      x: { ticks: { color: "#CFCFCF" } },
                      y: { ticks: { color: "#CFCFCF" } },
                    },
                  }}
                />
                <div className="mt-2 text-[#CFCFCF] text-sm">
                  <span>
                    Current:{" "}
                    <b>${revenuePeriod.current.total.toLocaleString()}</b>
                  </span>
                  <span className="ml-4">
                    Previous:{" "}
                    <b>${revenuePeriod.previous.total.toLocaleString()}</b>
                  </span>
                  <span className="ml-4">
                    Growth:{" "}
                    <b>
                      {revenuePercent !== null
                        ? revenuePercent.toFixed(1) + "%"
                        : "-"}
                    </b>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[#CFCFCF]">No data available</p>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
