"use client";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useParams } from "next/navigation";
import { User as UserType } from "@/services/userService";
import { IFlashcardSet } from "@/types/models/IFlashcardSet";
import UserService from "@/services/userService";
import FlashcardSetService from "@/services/flashcardSetService";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  BookOpen,
  Calendar,
  Mail,
  Edit2,
  Save,
  GraduationCap,
  Layers,
  Star,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import FlashcardSetCard from "@/components/flashcard-sets/FlashcardSetCard";
import { ObjectId } from "mongoose";
import Sidebar from "@/components/layout/Sidebar";
import { getAllUserCourses, UserCourse } from "@/services/userCourseService";
import { Course } from "@/types/course/course";
import { getUserLessons, UserLesson } from "@/services/userLessonService";
import { getUserTests, UserTest } from "@/services/userTestService";
import { Lesson } from "@/types/course/lesson";
import { Test } from "@/types/course/test";
import { capitalizeStatus } from "@/enums/UserCourseStatusEnum";
import { useAuth } from "@/context/AuthContext";

const userService = new UserService();
const flashcardSetService = new FlashcardSetService();

const SIDEBAR_LINKS = [
  { label: "Overview", icon: User },
  { label: "Courses", icon: GraduationCap },
  { label: "Tests & Lessons", icon: Layers },
  { label: "Flashcards", icon: BookOpen },
  { label: "Achievements", icon: Star },
  { label: "Change Password", icon: KeyRound },
];

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<UserType | null>(null);
  const [flashcardSets, setFlashcardSets] = useState<IFlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [selectedSection, setSelectedSection] = useState("Overview");

  const [editUsername, setEditUsername] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [userLessons, setUserLessons] = useState<UserLesson[]>([]);
  const [userTests, setUserTests] = useState<UserTest[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingTests, setLoadingTests] = useState(false);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const currentPwRef = useRef<HTMLInputElement>(null);
  const newPwRef = useRef<HTMLInputElement>(null);
  const confirmPwRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userResponse = await userService.getUserById(userId);
        setUser(userResponse.user);

        // Fetch user's flashcard sets
        const flashcardSetsResponse =
          await flashcardSetService.getFlashcardSets(
            1,
            100,
            "",
            "createdAt",
            "desc",
            userId
          );
        setFlashcardSets(flashcardSetsResponse.data);
        setLoading(false);
      } catch (error) {
        showToast(
          error instanceof AxiosError
            ? error.response?.data.message
            : "Failed to fetch user data",
          "error"
        );
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      setEditUsername(user.username);
      setEditAvatar(user.avatar || null);
      setOriginalUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (selectedSection === "Courses") {
      setLoadingCourses(true);
      getAllUserCourses(userId)
        .then((data) => setUserCourses(data))
        .catch(() => setUserCourses([]))
        .finally(() => setLoadingCourses(false));
    }
  }, [selectedSection, userId]);

  useEffect(() => {
    if (selectedSection === "Tests & Lessons") {
      setLoadingLessons(true);
      setLoadingTests(true);
      getUserLessons(userId)
        .then((data) => setUserLessons(data.data || data))
        .catch(() => setUserLessons([]))
        .finally(() => setLoadingLessons(false));
      getUserTests(userId)
        .then((data) => setUserTests(data.data || data))
        .catch(() => setUserTests([]))
        .finally(() => setLoadingTests(false));
    }
  }, [selectedSection, userId]);

  useEffect(() => {
    if (
      selectedSection === "Flashcards" ||
      selectedSection === "Achievements"
    ) {
      setLoadingUserDetail(true);
      userService
        .getUserDetailById(userId)
        .then((data) => setUserDetail(data))
        .catch(() => setUserDetail(null))
        .finally(() => setLoadingUserDetail(false));
    }
  }, [selectedSection, userId]);

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  const handleSaveProfile = async () => {
    setSaveProfileLoading(true);
    try {
      const profileData: { username?: string; avatarFile?: File } = {};

      if (editUsername !== originalUsername) {
        profileData.username = editUsername;
      }

      if (avatarFile) {
        profileData.avatarFile = avatarFile;
      }

      if (Object.keys(profileData).length > 0) {
        const response = await userService.updateUserProfile(
          userId,
          profileData
        );
        // Update local user state with the response data
        setUser((prev) => (prev ? { ...prev, ...response.user } : null));
        setOriginalUsername(editUsername);
        setAvatarFile(null); // Clear the file after successful upload
      }

      setHasChanges(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to update profile"
          : "Failed to update profile",
        "error"
      );
    } finally {
      setSaveProfileLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditUsername(originalUsername);
    setEditAvatar(user?.avatar || null);
    setAvatarFile(null);
    setHasChanges(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setEditUsername(newUsername);
    setHasChanges(newUsername !== originalUsername || avatarFile !== null);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setEditAvatar(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  // Password requirement check functions
  const checkPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8 && password.length <= 50,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Show password requirements when user starts typing
    if (value.length > 0) {
      setShowPasswordRequirements(true);
    } else {
      setShowPasswordRequirements(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwLoading(true);

    try {
      const currentPassword = currentPwRef.current?.value || "";
      const newPassword = newPwRef.current?.value || "";
      const confirmPassword = confirmPwRef.current?.value || "";

      if (newPassword !== confirmPassword) {
        showToast("New passwords do not match.", "error");
        setChangePwLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters long.", "error");
        setChangePwLoading(false);
        return;
      }

      await userService.changePassword(userId, {
        oldPassword: currentPassword,
        newPassword,
      });

      showToast(
        "Password changed successfully! You will be logged out.",
        "success"
      );

      // Clear the form
      if (currentPwRef.current) currentPwRef.current.value = "";
      if (newPwRef.current) newPwRef.current.value = "";
      if (confirmPwRef.current) confirmPwRef.current.value = "";

      // Logout after successful password change
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to change password"
          : "Failed to change password",
        "error"
      );
    } finally {
      setChangePwLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[100vh]">
        <LoadingSpinner />
        <p className="text-white">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[#202020] py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-white mb-4">
              User Not Found
            </h1>
            <p className="text-gray-400">
              The user you&aposre looking for doesn&apost exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#202020] py-8 px-2 sm:px-4">
      <div className="w-full max-w-6xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: user?.username || "Profile", href: `/profile/${userId}` },
          ]}
        />
      </div>
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
        {/* Sidebar */}
        <aside className="md:w-[260px] w-full mb-6 md:mb-0">
          <Sidebar
            links={SIDEBAR_LINKS.map((l) => ({ label: l.label }))}
            selected={selectedSection}
            onSelect={setSelectedSection}
          />
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {selectedSection === "Overview" && (
            <div className="mb-6">
              <div className="flex flex-col md:flex-row items-start gap-12">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative w-[200px] h-[200px] rounded-lg border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden group">
                    {editAvatar ? (
                      <Image
                        src={editAvatar}
                        alt={editUsername}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-full h-full text-gray-800" />
                    )}

                    {/* Hover overlay for image upload */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <label className="text-white text-sm font-medium cursor-pointer flex flex-col items-center gap-2">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  </div>

                  {avatarFile && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-400">
                        {avatarFile.name}
                      </span>
                    </div>
                  )}
                </div>
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      Profile
                    </h1>
                  </div>

                  <div className="space-y-4">
                    {/* Username Field */}
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#4CC2FF]" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editUsername}
                          onChange={handleUsernameChange}
                          className="w-full bg-[#232323] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#4CC2FF] transition-colors"
                          placeholder="Enter username"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#4CC2FF]" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-300">{user.email}</span>
                      </div>
                    </div>

                    {/* Join Date Field */}
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#4CC2FF]" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-300">
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                    {/* Membership Field */}
                    {user.activeUntil && (
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <span className="text-yellow-300 font-semibold">
                            Premium Member
                          </span>
                          <span className="text-gray-300 ml-2">
                            until {formatDate(user.activeUntil)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Save/Cancel Buttons - Only show when there are changes */}
                  {hasChanges && (
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-600 justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-[#4CC2FF] hover:bg-[#48B2E9] text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-60"
                        disabled={!hasChanges || saveProfileLoading}
                      >
                        {saveProfileLoading ? (
                          <div className="flex gap-2 items-center">
                            <LoadingSpinner size="small" />
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Card */}
              <div className="mt-8">
                <div className="rounded-xl shadow-lg bg-gradient-to-br from-[#232b3b] to-[#1a1a1a] border border-[#333] p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20">
                    <Star className="w-10 h-10 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-yellow-300 mb-1">
                      {user.activeUntil
                        ? "Premium Membership"
                        : "No Membership"}
                    </h3>
                    {user.activeUntil ? (
                      <>
                        <p className="text-gray-200">
                          Status:{" "}
                          <span className="font-semibold text-green-400">
                            Active
                          </span>
                        </p>
                        <p className="text-gray-400">
                          Expires on:{" "}
                          <span className="text-white">
                            {formatDate(user.activeUntil)}
                          </span>
                        </p>
                        <p className="text-gray-300 mt-2">
                          Enjoy unlimited access to all courses, premium
                          content, and exclusive features designed to accelerate
                          your English learning journey.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400 mb-2">
                          You are not a premium member yet.
                        </p>
                        <p className="text-gray-300 mb-2">
                          Upgrade to premium to unlock all courses, advanced
                          exercises, and special member-only resources!
                        </p>
                        <Link
                          href="/membership"
                          className="inline-block mt-2 px-4 py-2 bg-[#4CC2FF] hover:bg-[#48B2E9] text-black font-semibold rounded-lg transition"
                        >
                          Upgrade to Premium
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedSection === "Courses" && (
            <div className="mb-6 min-h-[300px]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <GraduationCap className="w-7 h-7 text-blue-400" /> Courses
              </h2>
              {loadingCourses ? (
                <div className="flex flex-col items-center gap-4 justify-center py-12">
                  <LoadingSpinner />
                  <span className="ml-2 text-[#CFCFCF]">
                    Loading courses...
                  </span>
                </div>
              ) : userCourses.length === 0 ? (
                <div className="text-center py-8 bg-[#2b2b2b] rounded-lg">
                  <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    No courses found
                  </h3>
                  <p className="text-slate-400 text-base">
                    You are not enrolled in any courses yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCourses.map((uc) => (
                    <Link
                      href={`/courses/${uc.courseId.toString()}/enroll`}
                      key={uc._id}
                    >
                      <div
                        key={uc._id}
                        className="bg-[#2b2b2b] hover:scale-105 rounded-lg shadow p-5 flex flex-col gap-4"
                      >
                        {uc.course?.coverImage && (
                          <div className="w-full h-36 rounded-md overflow-hidden mb-2">
                            <Image
                              src={uc.course.coverImage}
                              alt={uc.course.name}
                              width={400}
                              height={144}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-2 flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {uc.course?.name || "Unknown Course"}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
                              {uc.course?.level || "Unknown Level"}
                            </span>
                            <span className="bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">
                              {uc.course?.type || "Unknown type"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                            <span>Progress:</span>
                            <span className="font-semibold text-white">
                              {uc.lessonFinished} /{" "}
                              {uc.course?.totalLessons || 0} lessons
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold ${
                                uc.status === "completed"
                                  ? "bg-green-700 text-green-200"
                                  : uc.status === "ongoing"
                                  ? "bg-yellow-700 text-yellow-200"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {capitalizeStatus(uc.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {selectedSection === "Tests & Lessons" && (
            <div className="mb-6 min-h-[300px]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Layers className="w-7 h-7 text-purple-400" /> Tests & Lessons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lessons */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">
                    Lessons
                  </h3>
                  {loadingLessons ? (
                    <div className="flex flex-col items-center gap-4 justify-center py-8">
                      <LoadingSpinner />
                      <span className="ml-2 text-[#CFCFCF]">
                        Loading lessons...
                      </span>
                    </div>
                  ) : userLessons.length === 0 ? (
                    <div className="bg-[#2b2b2b] rounded-lg p-4 text-gray-400">
                      No lessons found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userLessons.map((ul) => (
                        <div
                          key={ul._id}
                          className="bg-[#2b2b2b] rounded-lg p-4 flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {ul.lesson?.name || "Unknown Lesson"}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${
                                ul.status === "completed"
                                  ? "bg-green-700 text-green-200"
                                  : ul.status === "in-progress"
                                  ? "bg-yellow-700 text-yellow-200"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {capitalizeStatus(ul.status)}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm">
                            Last updated: {formatDate(ul.updatedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Tests */}
                <div>
                  <h3 className="text-xl font-semibold text-pink-300 mb-4">
                    Tests
                  </h3>
                  {loadingTests ? (
                    <div className="flex flex-col items-center gap-4 justify-center py-8">
                      <LoadingSpinner />
                      <span className="ml-2 text-[#CFCFCF]">
                        Loading tests...
                      </span>
                    </div>
                  ) : userTests.length === 0 ? (
                    <div className="bg-[#2b2b2b] rounded-lg p-4 text-gray-400">
                      No tests found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userTests.map((ut) => (
                        <div
                          key={ut._id}
                          className="bg-[#2b2b2b] rounded-lg p-4 flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {ut.test?.name || "Unknown Test"}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${
                                ut.status === "completed"
                                  ? "bg-green-700 text-green-200"
                                  : ut.status === "in-progress"
                                  ? "bg-yellow-700 text-yellow-200"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {capitalizeStatus(ut.status)}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm">
                            Score:{" "}
                            <span className="text-white font-semibold">
                              {ut.score}
                            </span>{" "}
                            | Last updated: {formatDate(ut.updatedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {selectedSection === "Flashcards" && (
            <div className="mb-6 min-h-[300px]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-pink-400" /> Flashcards
              </h2>
              {loadingUserDetail ? (
                <div className="flex flex-col items-center gap-4 justify-center py-12">
                  <LoadingSpinner />
                  <span className="ml-2 text-[#CFCFCF]">
                    Loading flashcard sets...
                  </span>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Your Flashcard Sets
                  </h3>
                  {flashcardSets.length === 0 ? (
                    <div className="bg-[#2b2b2b] rounded-lg p-4 text-gray-400">
                      No flashcard sets found.
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {flashcardSets.map((set) => (
                          <FlashcardSetCard
                            key={set._id as string}
                            flashcardSet={set}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {selectedSection === "Achievements" && (
            <div className="mb-6 min-h-[300px]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-7 h-7 text-yellow-400" /> Achievements
              </h2>
              {loadingUserDetail ? (
                <div className="flex flex-col items-center gap-4 justify-center py-12">
                  <LoadingSpinner />
                  <span className="ml-2 text-[#CFCFCF]">
                    Loading achievements...
                  </span>
                </div>
              ) : userDetail?.achievements?.list?.length ? (
                <div className="space-y-4">
                  {userDetail.achievements.list.map((ach: any) => (
                    <div
                      key={ach._id}
                      className="bg-[#2b2b2b] hover:scale-105 rounded-lg p-4 flex flex-col gap-2"
                    >
                      <span className="font-bold text-white text-lg">
                        {ach.title}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {ach.description}
                      </span>
                      <span className="text-xs text-gray-400">
                        Awarded: {formatDate(ach.dateAwarded)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">No achievements found.</div>
              )}
            </div>
          )}
          {selectedSection === "Change Password" && (
            <div className="mb-6 min-h-[300px]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <KeyRound className="w-7 h-7 text-green-400" /> Change Password
              </h2>
              <form
                onSubmit={handleChangePassword}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <input
                    ref={currentPwRef}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    className="bg-[#232323] border border-gray-600 rounded px-4 py-2 text-white w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={newPwRef}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="bg-[#232323] border border-gray-600 rounded px-4 py-2 text-white w-full pr-10"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onFocus={() => newPassword.length > 0 && setShowPasswordRequirements(true)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {showPasswordRequirements && (
                  <div className="bg-[#1D1D1D] border border-[#333] rounded-md p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">
                      Password Requirements
                    </h4>
                    {(() => {
                      const requirements = checkPasswordRequirements(newPassword);
                      return (
                        <>
                          <div className={`flex items-center gap-2 text-xs ${
                            requirements.length ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            <span className={requirements.length ? 'text-green-400' : 'text-gray-500'}>
                              {requirements.length ? '✓' : '○'}
                            </span>
                            <span>Between 8-50 characters long</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            requirements.lowercase ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            <span className={requirements.lowercase ? 'text-green-400' : 'text-gray-500'}>
                              {requirements.lowercase ? '✓' : '○'}
                            </span>
                            <span>At least 1 lowercase letter</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            requirements.uppercase ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            <span className={requirements.uppercase ? 'text-green-400' : 'text-gray-500'}>
                              {requirements.uppercase ? '✓' : '○'}
                            </span>
                            <span>At least 1 uppercase letter</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            requirements.number ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            <span className={requirements.number ? 'text-green-400' : 'text-gray-500'}>
                              {requirements.number ? '✓' : '○'}
                            </span>
                            <span>At least 1 number</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            requirements.symbol ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            <span className={requirements.symbol ? 'text-green-400' : 'text-gray-500'}>
                              {requirements.symbol ? '✓' : '○'}
                            </span>
                            <span>At least 1 symbol (!@#$%^&*...)</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
                <div className="relative">
                  <input
                    ref={confirmPwRef}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className="bg-[#232323] border border-gray-600 rounded px-4 py-2 text-white w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-4 py-2 mt-2 disabled:opacity-60"
                  disabled={changePwLoading}
                >
                  {changePwLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
