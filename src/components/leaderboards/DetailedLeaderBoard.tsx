"use client";
import React, { useEffect, useState } from "react";
import { Trophy, Medal, Award, User, Calendar, Flame } from "lucide-react";
import { IUser } from "@/types/models/IUser";
import UserService from "@/services/userService";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const userService = new UserService();
export default function DetailedLeaderboard() {
  const { showToast } = useToast();
  const [topUsers, setTopUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userService.getLeaderboard(10);
      setTopUsers(response.users);
      setLoading(false);
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Failed to fetch leaderboard data",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPositionColors = (position: number) => {
    switch (position) {
      case 1:
        return {
          text: "text-yellow-400",
          bg: "bg-yellow-400/10",
        };
      case 2:
        return {
          text: "text-gray-300",
          bg: "bg-gray-300/10",
        };
      case 3:
        return {
          text: "text-amber-400",
          bg: "bg-amber-400/10",
        };
      default:
        return {
          text: "text-gray-400",
          bg: "bg-transparent",
        };
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString: string | Date) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🏆 Leaderboard</h2>
            <p className="text-cyan-100 text-sm">
              Top performers in our community
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="text-cyan-100 hover:text-white text-sm font-medium hover:underline transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Streak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Last Online
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {topUsers.map((user, index) => {
              const position = index + 1;
              const colors = getPositionColors(position);

              return (
                <tr
                  key={user._id.toString()}
                  className={`hover:bg-gray-800 transition-colors duration-200 ${colors.bg}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`mr-2 ${colors.text}`}>
                        {getPositionIcon(position)}
                      </div>
                      <span className={`text-sm font-bold ${colors.text}`}>
                        #{position}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3 text-sm">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${colors.text}`}>
                      {user.points || 0}
                    </span>
                    <span className="text-gray-400 text-xs ml-1">pts</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-300">
                      <Flame className="w-4 h-4 text-orange-400 mr-1" />
                      <span>{user.onlineStreak || 0}</span>
                      <span className="text-gray-500 ml-1">days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.lastOnline ? getTimeAgo(user.lastOnline) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center text-sm text-gray-400">
          <span>Showing top {topUsers.length} users</span>
        </div>
      </div>
    </div>
  );
}
