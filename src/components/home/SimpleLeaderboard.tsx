"use client";
import { IUser } from "@/types/models/IUser";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import UserService from "@/services/userService";
import { Award, Flame, Medal, Trophy, User as UserIcon } from "lucide-react";
import Link from "next/link";

const userService = new UserService();

type PodiumUser = IUser & { position: number };

export default function SimpleLeaderboard() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [top3, setTop3] = useState<PodiumUser[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userService.getLeaderboard(3);
      setTop3(getPodiumOrder(response.users) || []);

      setLoading(false);
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Failed to fetch leaderboard data",
        "error"
      );
      setLoading(false);
    }
  };

  // Get podium order: 2nd, 1st, 3rd
  const getPodiumOrder = (users: IUser[]) => {
    if (!users || !Array.isArray(users) || users.length === 0) return [];
    const sortedUsers = [...users].sort(
      (a, b) => (b.points || 0) - (a.points || 0)
    );
    const podiumOrder = [];
    if (sortedUsers[1]) podiumOrder.push({ ...sortedUsers[1], position: 2 });
    if (sortedUsers[0]) podiumOrder.push({ ...sortedUsers[0], position: 1 });
    if (sortedUsers[2]) podiumOrder.push({ ...sortedUsers[2], position: 3 });
    return podiumOrder;
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <UserIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPositionColors = (position: number) => {
    switch (position) {
      case 1:
        return {
          bg: "bg-gradient-to-t from-yellow-500/20 to-yellow-400/30",
          border: "border-yellow-400/50",
          text: "text-yellow-400",
          glow: "shadow-yellow-400/20",
        };
      case 2:
        return {
          bg: "bg-gradient-to-t from-gray-500/20 to-gray-400/30",
          border: "border-gray-400/50",
          text: "text-gray-300",
          glow: "shadow-gray-400/20",
        };
      case 3:
        return {
          bg: "bg-gradient-to-t from-amber-500/20 to-amber-400/30",
          border: "border-amber-400/50",
          text: "text-amber-400",
          glow: "shadow-amber-400/20",
        };
      default:
        return {
          bg: "bg-gradient-to-t from-blue-500/20 to-blue-400/30",
          border: "border-blue-400/50",
          text: "text-blue-400",
          glow: "shadow-blue-400/20",
        };
    }
  };

  const getBarHeight = (position: number) => {
    switch (position) {
      case 1:
        return "h-32";
      case 2:
        return "h-24";
      case 3:
        return "h-20";
      default:
        return "h-16";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          🏆 Top Performers
        </h2>
        <p className="text-gray-400 text-sm">Leading the leaderboard</p>
      </div>

      <div
        className="
          flex items-end justify-evenly mb-6
          flex-wrap
          gap-2 sm:gap-4 md:gap-6
        "
      >
        {top3 && top3.length > 0 ? (
          top3.map((user) => {
            const colors = getPositionColors(user.position);
            const height = getBarHeight(user.position);

            return (
              <div
                key={user._id.toString()}
                className="
                  flex flex-col items-center
                  w-4/5 xs:w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4
                  max-w-[200px] min-w-[120px]
                  mb-4
                "
              >
                {/* User Card */}
                <div
                  className={`
                    bg-gray-800 rounded-lg shadow-lg ${colors.glow} shadow-lg p-3 mb-3
                    transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                    border ${colors.border}
                    w-full
                  `}
                >
                  {/* Position Badge */}
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className={`
                        ${colors.bg} rounded-full p-2 shadow-lg
                        flex items-center justify-center border ${colors.border}
                      `}
                    >
                      {getPositionIcon(user.position)}
                    </div>
                  </div>

                  {/* User Avatar */}
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-sm text-white truncate">
                      {user.username}
                    </h3>
                    <p className={`text-lg font-bold ${colors.text}`}>
                      {user.points || 0} pts
                    </p>

                    {/* Streak */}
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>{user.onlineStreak || 0} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Podium Bar */}
                <div
                  className={`
                    ${colors.bg} ${height} w-full rounded-t-lg shadow-lg
                    flex items-end justify-center pb-2
                    border ${colors.border} border-b-0
                    relative overflow-hidden
                  `}
                >
                  {/* Podium Number */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md border border-gray-600">
                      {user.position}
                    </div>
                  </div>

                  {/* Animated Sparkles for winner */}
                  {user.position === 1 && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
                      <div className="absolute top-4 right-2 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse delay-150"></div>
                      <div className="absolute bottom-8 left-2 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-center w-full py-8">
            No leaderboard data yet.
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <Link href={"/leaderboard"}>
          <button
            disabled={loading}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium hover:underline transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "View Full Leaderboard →"}
          </button>
        </Link>
      </div>
    </div>
  );
}
