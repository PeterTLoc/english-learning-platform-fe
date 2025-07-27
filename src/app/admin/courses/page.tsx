"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseAxiosError } from "@/utils/apiErrors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ServerPagination from "@/components/common/ServerPagination";
import * as courseService from "@/services/courseService";
import { PaginatedCourses } from "@/services/courseService";
import { Course, CourseLevelEnum, CourseTypeEnum } from "@/types/course/course";
import { CourseLevelEnum as CourseLevelValues } from "@/enums/CourseLevelEnum";
import { CourseTypeEnum as CourseTypeValues } from "@/enums/CourseTypeEnum";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import CourseModal from "@/components/admin/CourseModal";
import CourseDetailsModal from "@/components/admin/CourseDetailsModal";

const CourseManagementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { showConfirmation } = useConfirmation();

  const [courses, setCourses] = useState<PaginatedCourses | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] =
    useState<Course | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<CourseLevelEnum | "">("");
  const [typeFilter, setTypeFilter] = useState<CourseTypeEnum | "">("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  // Level options
  const levelOptions = [
    { value: CourseLevelValues.BEGINNER_1, label: "Beginner (A1)" },
    { value: CourseLevelValues.BEGINNER_2, label: "Elementary (A2)" },
    { value: CourseLevelValues.INTERMEDIATE_1, label: "Intermediate (B1)" },
    { value: CourseLevelValues.INTERMEDIATE_2, label: "Upper Intermediate (B2)" },
    { value: CourseLevelValues.ADVANCED_1, label: "Advanced (C1)" },
    { value: CourseLevelValues.ADVANCED_2, label: "Mastery (C2)" },
  ] as const;

  // Type options
  const typeOptions = [
    { value: CourseTypeValues.FREE, label: "Free Course" },
    { value: CourseTypeValues.MEMBERSHIP, label: "Premium Course" },
  ] as const;

  const getLevelLabel = (level: CourseLevelEnum) => {
    const labels = {
      [CourseLevelValues.BEGINNER_1]: "Beginner (A1)",
      [CourseLevelValues.BEGINNER_2]: "Elementary (A2)",
      [CourseLevelValues.INTERMEDIATE_1]: "Intermediate (B1)",
      [CourseLevelValues.INTERMEDIATE_2]: "Upper Intermediate (B2)",
      [CourseLevelValues.ADVANCED_1]: "Advanced (C1)",
      [CourseLevelValues.ADVANCED_2]: "Mastery (C2)",
    };
    return labels[level];
  };

  const getTypeLabel = (type: CourseTypeEnum) => {
    const labels = {
      [CourseTypeValues.FREE]: "Free Course",
      [CourseTypeValues.MEMBERSHIP]: "Premium Course",
    };
    return labels[type];
  };

  const getLevelColor = (level: CourseLevelEnum) => {
    const colors = {
      [CourseLevelValues.BEGINNER_1]: "bg-green-900 text-green-300",
      [CourseLevelValues.BEGINNER_2]: "bg-emerald-900 text-emerald-300",
      [CourseLevelValues.INTERMEDIATE_1]: "bg-yellow-900 text-yellow-300",
      [CourseLevelValues.INTERMEDIATE_2]: "bg-orange-900 text-orange-300",
      [CourseLevelValues.ADVANCED_1]: "bg-red-900 text-red-300",
      [CourseLevelValues.ADVANCED_2]: "bg-purple-900 text-purple-300",
    };
    return colors[level];
  };

  const getTypeColor = (type: CourseTypeEnum) => {
    return type === CourseTypeValues.FREE
      ? "bg-[#373737] text-[#4CC2FF]"
      : "bg-[#373737] text-yellow-300";
  };

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const searchValue = searchParams.get("search") || "";
      const levelValue = (searchParams.get("level") || "") as
        | CourseLevelEnum
        | "";
      const typeValue = (searchParams.get("type") || "") as CourseTypeEnum | "";
      const sortByValue = searchParams.get("sortBy") || "date";
      const orderValue = searchParams.get("order") || "desc";

      // Set local state from URL params
      setSearchTerm(searchValue);
      setLevelFilter(levelValue);
      setTypeFilter(typeValue);
      setSortBy(sortByValue);
      setSortOrder(orderValue);

      const data = await courseService.getAllCourses({
        page,
        size,
        search: searchValue,
        level: levelValue as CourseLevelEnum,
        type: typeValue as CourseTypeEnum,
        sortBy: sortByValue,
        order: orderValue,
      });

      setCourses(data);
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.deleteCourse(courseId);
      showToast("Course has been deleted", "success");
      fetchCourses();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleCreateCourse = async (courseData: FormData) => {
    try {
      await courseService.createCourse(courseData);
      showToast("Course has been created", "success");
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const handleUpdateCourse = async (courseId: string, courseData: FormData) => {
    try {
      await courseService.updateCourse(courseId, courseData);
      showToast("Course has been updated", "success");
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setModalMode("edit");
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const openDetailsModal = (course: Course) => {
    setSelectedCourseForDetails(course);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCourseForDetails(null);
  };

  const handleSearch = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to first page on new search
    params.set("size", size.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (levelFilter) params.set("level", levelFilter);
    if (typeFilter) params.set("type", typeFilter);
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);

    router.push(`/admin/courses?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setLevelFilter("");
    setTypeFilter("");
    setSortBy("date");
    setSortOrder("desc");
    router.push("/admin/courses");
  };

  const handleConfirmDelete = async (courseId: string) => {
    const confirmed = await showConfirmation({
      title: "Delete Course",
      message:
        "Are you sure you want to delete this course? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      handleDeleteCourse(courseId);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, size, searchParams]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Course Management</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
        >
          <span className="text-md">Create New Course</span>
        </button>
      </div>

      {/* Filter and search section */}
      <div className="bg-[#202020] border border-[#1D1D1D] p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col justify-center flex-1 min-w-[200px]">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Search by Name or Description
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="input w-full p-4 text-lg text-white placeholder:text-lg"
            />
          </div>

          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) =>
                setLevelFilter(e.target.value as CourseLevelEnum)
              }
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="">All Levels</option>
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as CourseTypeEnum)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="">All Types</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="level">Level</option>
              <option value="type">Type</option>
            </select>
          </div>

          <div className="w-40">
            <label className="block text-lg font-medium text-[#CFCFCF] mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#4CC2FF] text-black font-semibold rounded-md hover:bg-[#3AA0DB] transition-colors"
          >
            <span className="text-md">Apply Filters</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#2b2b2b] text-white font-semibold rounded-md hover:bg-[#373737] transition-colors"
          >
            <span className="text-md">Reset</span>
          </button>
        </div>
      </div>

      {/* Course table */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 justify-center py-20">
          <LoadingSpinner />
          <p className="ml-3 text-[#CFCFCF]">Loading courses...</p>
        </div>
      ) : courses && courses.data && courses.data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-md text-left text-[#CFCFCF]">
              <thead className="text-sm uppercase bg-[#373737] text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Image</th>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Level</th>
                  <th className="px-6 py-3 text-center">Type</th>
                  <th className="px-6 py-3 text-center">Total Lessons</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Created At</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.data.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b bg-[#202020] border-[#1D1D1D] hover:bg-[#2D2D2D] transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center">
                        {course.coverImage ? (
                          <img
                            src={course.coverImage}
                            alt={course.name}
                            className="w-32 h-32 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-[#373737] rounded mr-2 flex items-center justify-center">
                            {course.name?.charAt(0)?.toUpperCase() || "C"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="max-w-xs truncate" title={course.name || "Untitled Course"}>
                        <span className="font-semibold text-white">{course.name || "Untitled Course"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${getLevelColor(
                          course.level as CourseLevelEnum
                        )}`}
                      >
                        {getLevelLabel(course.level as CourseLevelEnum) ||
                          "Unknown Level"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${getTypeColor(
                          course.type as CourseTypeEnum
                        )}`}
                      >
                        {getTypeLabel(course.type as CourseTypeEnum) ||
                          "Unknown Type"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {course.totalLessons || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          course.isDeleted
                            ? "bg-red-900 text-red-300"
                            : "bg-[#373737] text-[#4CC2FF]"
                        }`}
                      >
                        {course.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {course.createdAt
                        ? new Date(course.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openDetailsModal(course)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => openEditModal(course)}
                          className="px-3 py-1 text-sm bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors"
                        >
                          Edit
                        </button>
                        {!course.isDeleted && (
                          <button
                            onClick={() => handleConfirmDelete(course._id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <ServerPagination
              currentPage={page}
              totalPages={courses.totalPages}
              pageSize={size}
            />
          </div>
        </>
      ) : (
        <div className="bg-[#202020] border border-[#1D1D1D] p-10 text-center rounded-lg">
          <p className="text-[#CFCFCF]">
            No courses found. Try adjusting your search criteria.
          </p>
        </div>
      )}

      {/* Course Modal */}
      {isModalOpen && (
        <CourseModal
          mode={modalMode}
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={
            modalMode === "create"
              ? handleCreateCourse
              : (formData: FormData) =>
                  handleUpdateCourse(selectedCourse?._id || "", formData)
          }
        />
      )}

      {/* Course Details Modal */}
      {selectedCourseForDetails && (
        <CourseDetailsModal
          course={selectedCourseForDetails}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};

export default CourseManagementPage;
