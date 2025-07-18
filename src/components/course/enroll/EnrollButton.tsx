"use client";

import { useAuth } from "@/context/AuthContext";
import { enrollCourse } from "@/services/userCourseService";
import { useCourse } from "@/context/CourseContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllLessonsByCourseId } from "@/services/lessonService";
import { useToast } from "@/context/ToastContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { parseAxiosError } from "@/utils/apiErrors";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const { userCourses, fetchAllCourses, setCourseStatus } = useCourse();
  const [loading, setLoading] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (user && !userCourses[courseId]) {
      fetchAllCourses().finally(() => setCheckingEnrollment(false));
    } else {
      setCheckingEnrollment(false);
    }
  }, [user, courseId]);

  const handleGoToCourse = async () => {
    try {
      const lessons = await getAllLessonsByCourseId(courseId);
      if (lessons && lessons.length > 0) {
        router.push(`/courses/${courseId}/lessons/${lessons[0]._id}`);
      } else {
        router.push(`/courses/${courseId}`);
      }
    } catch (err) {
      console.error("Failed to fetch lessons", err);
      router.push(`/courses/${courseId}`);
    }
  };

  const handleEnroll = async () => {
    if (!user?._id) return alert("You must be logged in to enroll.");
    setLoading(true);
    try {
      const userCourse = await enrollCourse(user._id, courseId);
      setCourseStatus(courseId, userCourse.status);
      showToast("Enrollment success!", "success");
      router.refresh();
    } catch (err) {
      const parsedError = parseAxiosError(err);
      showToast(parsedError.message || "Enrollment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const status = userCourses[courseId]?.status || "";
  const isEnrolled = ["ongoing", "completed"].includes(status);

  // Debug logs
  console.log("EnrollButton: userCourses", userCourses);
  console.log("EnrollButton: courseId", courseId, typeof courseId);
  console.log("EnrollButton: userCourses[courseId]", userCourses[courseId]);

  if (checkingEnrollment) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4CC2FF]"></div>
      </div>
    );
  }

  return isEnrolled ? (
    <button
      onClick={handleGoToCourse}
      className="button-blue font-medium p-2 flex justify-center items-center text-black"
    >
      <span className="text-lg">Go to Course</span>
    </button>
  ) : (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="button-blue font-medium p-2 flex justify-center items-center text-black min-w-[100px]"
    >
      {loading ? (
        <LoadingSpinner size="small" />
      ) : (
        <span className="text-lg">Enroll</span>
      )}
    </button>
  );
}
