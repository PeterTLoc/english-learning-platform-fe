"use client";

import UserService, { User, UserDetail } from "@/services/userService";
import { UserRole } from "@/components/guards";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDisable: (userId: string) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onDisable,
}) => {
  const { showConfirmation } = useConfirmation();
  const { showToast } = useToast();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "tests" | "flashcards" | "achievements">("overview");
  const [loading, setLoading] = useState<boolean>(false);
  const userService = new UserService();
  
  useEffect(() => {
    const fetchUserDetail = async () => {
      if (isOpen && user) {
        setLoading(true);
        try {
          const detail = await userService.getUserDetailById(user._id);
          setUserDetail(detail);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          showToast("Failed to load complete user details. Showing available information.", "warning");
          // Still set the basic user info
          setUserDetail(user as UserDetail);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserDetail();
  }, [isOpen, user, showToast]);
  
  if (!isOpen || !user) return null;

  const getRoleName = (role: number) => {
    switch (role) {
      case UserRole.USER:
        return "User";
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.GUEST:
        return "Guest";
      default:
        return "Unknown";
    }
  };

  const handleDisable = async () => {
    const confirmed = await showConfirmation({
      title: "Disable User",
      message: `Are you sure you want to disable ${user.username}? This action cannot be undone.`,
      confirmText: "Disable",
      cancelText: "Cancel",
      variant: "danger"
    });
    
    if (confirmed) {
      onDisable(user._id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg flex flex-col w-full max-w-4xl max-h-[90vh]">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button onClick={onClose} className="text-[#CFCFCF] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User Header */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#2B2B2B] rounded-lg">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-[#373737] rounded-full flex items-center justify-center text-2xl text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                <p className="text-[#CFCFCF] mb-2">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === UserRole.ADMIN 
                      ? "bg-[#373737] text-[#4CC2FF]" 
                      : user.role === UserRole.USER
                      ? "bg-[#373737] text-white"
                      : "bg-[#373737] text-[#CFCFCF]"
                  }`}>
                    {getRoleName(user.role)}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isDeleted 
                      ? "bg-red-900 text-red-300"
                      : "bg-[#373737] text-[#4CC2FF]"
                  }`}>
                    {user.isDeleted ? "Disabled" : "Active"}
                  </span>
                  
                  {userDetail?.points !== undefined && (
                    <span className="px-2 py-1 bg-[#373737] rounded-full text-xs text-[#FFD700]">
                      {userDetail.points} Points
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#1D1D1D] mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2 px-1 ${
                    activeTab === "overview"
                      ? "border-b-2 border-[#4CC2FF] text-[#4CC2FF]"
                      : "text-[#CFCFCF] hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`pb-2 px-1 ${
                    activeTab === "courses"
                      ? "border-b-2 border-[#4CC2FF] text-[#4CC2FF]"
                      : "text-[#CFCFCF] hover:text-white"
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab("tests")}
                  className={`pb-2 px-1 ${
                    activeTab === "tests"
                      ? "border-b-2 border-[#4CC2FF] text-[#4CC2FF]"
                      : "text-[#CFCFCF] hover:text-white"
                  }`}
                >
                  Tests & Lessons
                </button>
                <button
                  onClick={() => setActiveTab("flashcards")}
                  className={`pb-2 px-1 ${
                    activeTab === "flashcards"
                      ? "border-b-2 border-[#4CC2FF] text-[#4CC2FF]"
                      : "text-[#CFCFCF] hover:text-white"
                  }`}
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`pb-2 px-1 ${
                    activeTab === "achievements"
                      ? "border-b-2 border-[#4CC2FF] text-[#4CC2FF]"
                      : "text-[#CFCFCF] hover:text-white"
                  }`}
                >
                  Achievements
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {loading ? (
              <div className="flex flex-col gap-4 justify-center items-center py-12">
                <LoadingSpinner />
                <span className="ml-2 text-[#CFCFCF]">Loading user details...</span>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-[#2B2B2B] p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Basic Information</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[#CFCFCF] text-sm">Email</p>
                            <p className="text-white">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-[#CFCFCF] text-sm">Account Created</p>
                            <p className="text-white">{new Date(user.createdAt).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[#CFCFCF] text-sm">Last Online</p>
                            <p className="text-white">{new Date(user.lastOnline).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[#CFCFCF] text-sm">Online Streak</p>
                            <p className="text-white">{user.onlineStreak || 0} days</p>
                          </div>
                          {user.activeUntil && (
                            <div>
                              <p className="text-[#CFCFCF] text-sm">Premium Until</p>
                              <p className="text-white">{new Date(user.activeUntil).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {userDetail?.stats ? (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Learning Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center bg-[#373737] p-3 rounded-lg">
                              <p className="text-sm text-[#CFCFCF]">Total Points</p>
                              <p className="text-xl text-[#FFD700] font-bold">{userDetail.stats.totalPoints || 0}</p>
                            </div>
                            <div className="text-center bg-[#373737] p-3 rounded-lg">
                              <p className="text-sm text-[#CFCFCF]">Lessons Completed</p>
                              <p className="text-xl text-[#4CC2FF] font-bold">{userDetail.stats.completedLessons || 0}</p>
                            </div>
                            <div className="text-center bg-[#373737] p-3 rounded-lg">
                              <p className="text-sm text-[#CFCFCF]">Courses Completed</p>
                              <p className="text-xl text-[#4CC2FF] font-bold">{userDetail.stats.completedCourses || 0}</p>
                            </div>
                            <div className="text-center bg-[#373737] p-3 rounded-lg">
                              <p className="text-sm text-[#CFCFCF]">Tests Taken</p>
                              <p className="text-xl text-[#4CC2FF] font-bold">{userDetail.stats.completedTests || 0}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Learning Statistics</h4>
                          <div className="text-center p-4 text-yellow-500">
                            <p>Statistics API not available yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {userDetail?.courses ? (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Course Progress</h4>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Enrolled:</span>
                            <span className="text-white">{userDetail.courses.total || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Completed:</span>
                            <span className="text-[#4CC2FF]">{userDetail.courses.completed || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">In Progress:</span>
                            <span className="text-[#FFD700]">{userDetail.courses.inProgress || 0}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Course Progress</h4>
                          <div className="text-center p-4 text-yellow-500">
                            <p>Courses API not available yet</p>
                          </div>
                        </div>
                      )}
                      
                      {userDetail?.achievements ? (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Achievements</h4>
                          <div className="text-center p-4">
                            <span className="text-3xl text-[#FFD700] font-bold">
                              {userDetail.achievements.total || 0}
                            </span>
                            <p className="text-[#CFCFCF]">Total Achievements</p>
                          </div>
                          {userDetail.achievements.list && userDetail.achievements.list.length > 0 && (
                            <div className="mt-2">
                              <p className="text-[#CFCFCF] mb-1">Recent Achievements:</p>
                              {userDetail.achievements.list.slice(0, 3).map((achievement) => (
                                <div key={achievement._id} className="flex items-center gap-2 mb-1">
                                  <span className="text-[#FFD700]">•</span>
                                  <span className="text-white">{achievement.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Achievements</h4>
                          <div className="text-center p-4 text-yellow-500">
                            <p>Achievements API not available yet</p>
                          </div>
                        </div>
                      )}
                      
                      {userDetail?.flashcards ? (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Flashcards</h4>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Total:</span>
                            <span className="text-white">{userDetail.flashcards.total || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Mastered:</span>
                            <span className="text-green-400">{userDetail.flashcards.mastered || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Learning:</span>
                            <span className="text-[#FFD700]">{userDetail.flashcards.learning || 0}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Flashcards</h4>
                          <div className="text-center p-4 text-yellow-500">
                            <p>Flashcards API not available yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Courses Tab */}
                {activeTab === "courses" && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Enrolled Courses</h3>
                    {userDetail?.courses?.list && userDetail.courses.list.length > 0 ? (
                      <div className="space-y-3">
                        {userDetail.courses.list.map((course) => (
                          <div key={course._id} className="bg-[#2B2B2B] p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <h4 className="text-white">{course.name || "Unknown"}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                course.status === "completed" 
                                  ? "bg-green-800 text-green-200" 
                                  : "bg-[#373737] text-[#FFD700]"
                              }`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1) || "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-[#373737] rounded-full h-2">
                                <div 
                                  className="bg-[#4CC2FF] h-2 rounded-full" 
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-[#CFCFCF] text-xs">{course.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#2B2B2B] p-8 rounded-lg text-center">
                        {userDetail?.courses ? (
                          <p className="text-[#CFCFCF]">No courses enrolled</p>
                        ) : (
                          <p className="text-yellow-500">Courses API not available yet</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tests & Lessons Tab */}
                {activeTab === "tests" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Tests</h3>
                      {userDetail?.tests ? (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Total Tests:</span>
                              <span className="text-white">{userDetail.tests.total || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Completed:</span>
                              <span className="text-white">{userDetail.tests.completed || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Average Score:</span>
                              <span className="text-[#4CC2FF]">{userDetail.tests.averageScore || 0}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Highest Score:</span>
                              <span className="text-[#4CC2FF]">{userDetail.tests.highestScore || 0}%</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <div className="text-center p-4 text-yellow-500">
                            <p>Tests API not available yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Lessons</h3>
                      {userDetail?.lessons ? (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Total Lessons:</span>
                              <span className="text-white">{userDetail.lessons.total || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Completed:</span>
                              <span className="text-white">{userDetail.lessons.completed || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">In Progress:</span>
                              <span className="text-[#FFD700]">{userDetail.lessons.inProgress || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CFCFCF]">Completion Rate:</span>
                              <span className="text-[#4CC2FF]">
                                {userDetail.lessons.total ? Math.round((userDetail.lessons.completed / userDetail.lessons.total) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#2B2B2B] p-4 rounded-lg">
                          <div className="text-center p-4 text-yellow-500">
                            <p>Lessons API not available yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Flashcards Tab */}
                {activeTab === "flashcards" && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Flashcards Progress</h3>
                    {userDetail?.flashcards ? (
                      <div className="bg-[#2B2B2B] p-4 rounded-lg">
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Total Flashcards:</span>
                            <span className="text-white">{userDetail.flashcards.total || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Mastered:</span>
                            <span className="text-green-400">{userDetail.flashcards.mastered || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Learning:</span>
                            <span className="text-[#FFD700]">{userDetail.flashcards.learning || 0}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-[#CFCFCF]">Studying:</span>
                            <span className="text-[#4CC2FF]">{userDetail.flashcards.studying || 0}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-white font-medium mb-2">Mastery Progress</h4>
                          <div className="w-full bg-[#373737] rounded-full h-4 mb-1">
                            <div 
                              className="bg-green-500 h-4 rounded-full" 
                              style={{ width: `${userDetail.flashcards.total ? Math.round((userDetail.flashcards.mastered / userDetail.flashcards.total) * 100) : 0}%` }}
                            ></div>
                          </div>
                          <div className="text-right text-xs text-[#CFCFCF]">
                            {userDetail.flashcards.total ? Math.round((userDetail.flashcards.mastered / userDetail.flashcards.total) * 100) : 0}% mastered
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#2B2B2B] p-4 rounded-lg">
                        <div className="text-center p-4 text-yellow-500">
                          <p>Flashcards API not available yet</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Achievements Tab */}
                {activeTab === "achievements" && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">User Achievements</h3>
                    {userDetail?.achievements && userDetail.achievements.list && userDetail.achievements.list.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userDetail.achievements.list.map((achievement) => (
                          <div key={achievement._id} className="bg-[#2B2B2B] p-4 rounded-lg">
                            <h4 className="text-[#FFD700] font-medium">{achievement.title}</h4>
                            <p className="text-[#CFCFCF] text-sm mt-1">{achievement.description}</p>
                            <div className="mt-2 text-xs text-[#CFCFCF]">
                              Awarded on: {new Date(achievement.dateAwarded).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#2B2B2B] p-8 rounded-lg text-center">
                        {userDetail?.achievements ? (
                          <p className="text-[#CFCFCF]">No achievements earned yet</p>
                        ) : (
                          <p className="text-yellow-500">Achievements API not available yet</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="flex justify-end gap-2 p-4 border-t border-[#1D1D1D]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#CFCFCF] hover:text-white transition-colors"
          >
            Close
          </button>
          {!user.isDeleted && (
            <button
              onClick={handleDisable}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Disable User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal; 