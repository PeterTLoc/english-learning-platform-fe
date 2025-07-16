"use client";

import { useState, useEffect } from "react";
import { LessonLength } from "@/types/lesson/LessonLength";
import { useToast } from "@/context/ToastContext";

// Define the enums directly since they're simple objects
const ExerciseTypeEnum = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRANSLATE: "translate",
  FILL_IN_THE_BLANK: "fill_in_the_blank",
  IMAGE_TRANSLATE: "image_translate",
} as const;

const ExerciseFocusEnum = {
  VOCABULARY: "vocabulary",
  GRAMMAR: "grammar",
} as const;

// Helper function to format enum values for display
const formatEnumValue = (value: string) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

interface FormModalProps {
  type: "lesson" | "test" | "exercise" | "vocabulary" | "grammar";
  mode: "create" | "edit";
  data?: any;
  onSubmit: (formData: FormData | object) => void;
  onCancel: () => void;
  courseDetails?: {
    level: string;
    type: string;
    totalLessons: number;
    totalEnrolled: number;
    createdAt: string;
    updatedAt: string;
    courseTests: any[];
    lessons: Array<{
      lesson: {
        _id: string;
        name: string;
        description: string;
        length: LessonLength[];
      };
      exercises?: any[];
      tests?: any[];
    }>;
  } | null;
}

export default function CourseFormModal({
  type,
  mode,
  data,
  onSubmit,
  onCancel,
  courseDetails,
}: FormModalProps) {
  const [formState, setFormState] = useState<any>(data || {});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [selectedLessons, setSelectedLessons] = useState<string[]>(
    data?.lessonIds || []
  );
  const [options, setOptions] = useState<string[]>(() => {
    if (!data?.options) return ["", "", "", ""];

    // If options is already an array, use it directly
    if (Array.isArray(data.options)) {
      return data.options;
    }

    // If options is a string, try to parse it
    if (typeof data.options === "string") {
      try {
        const optionsStr = data.options.trim();
        if (!optionsStr) {
          return ["", "", "", ""];
        }

        const parsedOptions = JSON.parse(optionsStr);
        if (Array.isArray(parsedOptions)) {
          return parsedOptions;
        } else {
          console.warn("Parsed options is not an array:", parsedOptions);
          return ["", "", "", ""];
        }
      } catch (e) {
        console.warn("Error parsing options:", e);
        return ["", "", "", ""];
      }
    }

    // If options is neither array nor string
    console.warn("Options is neither string nor array:", typeof data.options);
    return ["", "", "", ""];
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const [answers, setAnswers] = useState<string[]>(
    data?.answer
      ? Array.isArray(data.answer)
        ? data.answer
        : [data.answer]
      : [""]
  );

  useEffect(() => {
    if (data) {
      setFormState(data);
      setSelectedLessons(data.lessonIds || []);
      if (data.options) {
        try {
          // If options is already an array, use it directly
          if (Array.isArray(data.options)) {
            setOptions(data.options);
            return;
          }

          // If options is a string, try to parse it
          if (typeof data.options === "string") {
            const optionsStr = data.options.trim();
            if (!optionsStr) {
              setOptions(["", "", "", ""]);
              return;
            }

            const parsedOptions = JSON.parse(optionsStr);
            if (Array.isArray(parsedOptions)) {
              setOptions(parsedOptions);
            } else {
              console.warn("Parsed options is not an array:", parsedOptions);
              setOptions(["", "", "", ""]);
            }
          } else {
            console.warn(
              "Options is neither string nor array:",
              typeof data.options
            );
            setOptions(["", "", "", ""]);
          }
        } catch (e) {
          console.warn("Error parsing options:", e);
          setOptions(["", "", "", ""]);
        }
      } else {
        // No options provided, set default empty options
        setOptions(["", "", "", ""]);
      }
      // Set image preview if exercise has an image
      if (data.image || data.exerciseImage) {
        setImagePreview(data.image || data.exerciseImage);
      }
    }
  }, [data]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setShouldDeleteImage(false);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview("");
    setShouldDeleteImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "lesson") {
        // Validate lesson fields
        if (!formState.name || !formState.description || !formState.courseId) {
          throw new Error("Name, description, and course ID are required");
        }

        // For lessons, send as regular JSON
        const data = new FormData();
        data.append("name", formState.name);
        data.append("description", formState.description);
        data.append("courseId", formState.courseId);
        await onSubmit(data);
      } else if (type === "test") {
        // Validate test fields
        if (
          !formState.name ||
          !formState.description ||
          !formState.courseId ||
          !formState.totalQuestions
        ) {
          throw new Error(
            "Name, description, course ID, and total questions are required for tests"
          );
        }
        if (selectedLessons.length === 0) {
          throw new Error("Please select at least one lesson for the test");
        }

        const formData = new FormData();
        formData.append("name", formState.name);
        formData.append("description", formState.description);
        formData.append("totalQuestions", formState.totalQuestions.toString());
        formData.append("lessonIds", JSON.stringify(selectedLessons));

        const data = {
          name: formState.name,
          description: formState.description,
          totalQuestions: formState.totalQuestions.toString(),
          lessonIds: selectedLessons,
        };

        await onSubmit(data);
      } else if (type === "exercise") {
        // Validate exercise fields
        if (
          !formState.question ||
          !formState.type ||
          !formState.focus ||
          !formState.lessonId
        ) {
          throw new Error(
            "Question, type, focus, and lesson ID are required for exercises"
          );
        }

        // Validate answers
        if (formState.type === ExerciseTypeEnum.MULTIPLE_CHOICE) {
          if (options.length < 2) {
            throw new Error(
              "Multiple choice exercises require at least 2 options"
            );
          }
          if (options.some((opt) => !opt.trim())) {
            throw new Error("All options must be filled out");
          }
          if (!formState.answer) {
            throw new Error("Please select an answer");
          }
        } else {
          if (answers.length === 0 || answers.some((ans) => !ans.trim())) {
            throw new Error("Please provide at least one valid answer");
          }
        }

        const formData = new FormData();
        formData.append("question", formState.question);
        formData.append("type", formState.type);
        formData.append("focus", formState.focus);
        formData.append("lessonId", formState.lessonId);

        if (formState.explanation) {
          formData.append("explanation", formState.explanation);
        }

        if (formState.type === ExerciseTypeEnum.MULTIPLE_CHOICE) {
          options.forEach((opt, index) => {
            formData.append(`options[${index}]`, opt);
          });

          // For multiple choice, send as array with single item
          const answerArray = [formState.answer];
          answerArray.forEach((ans, index) => {
            formData.append(`answer[${index}]`, ans);
          });
        } else {
          // For other types, send each answer as a separate field
          const validAnswers = answers.filter((ans) => ans.trim());
          validAnswers.forEach((ans, index) => {
            formData.append(`answer[${index}]`, ans);
          });
        }

        if (imageFile) {
          formData.append("exerciseImage", imageFile);
        }
        if (shouldDeleteImage) {
          formData.append("deleteExerciseImage", "true");
        }

        // If editing and there's an existing image but no new image selected
        if (
          mode === "edit" &&
          !imageFile &&
          !shouldDeleteImage &&
          (data?.image || data?.exerciseImage)
        ) {
          formData.append("image", data.image || data.exerciseImage);
        }

        await onSubmit(formData);
      } else if (type === "vocabulary") {
        // Vocabulary logic
        if (!formState.lessonId) {
          throw new Error("Lesson is required");
        }
        if (!formState.englishContent || !formState.vietnameseContent) {
          throw new Error("English and Vietnamese content are required");
        }
        const formData = new FormData();
        formData.append("lessonId", formState.lessonId);
        formData.append("englishContent", formState.englishContent);
        formData.append("vietnameseContent", formState.vietnameseContent);
        if (imageFile) {
          formData.append("vocabularyImage", imageFile);
        } else if (
          mode === "edit" &&
          formState.imageUrl &&
          !shouldDeleteImage
        ) {
          formData.append("vocabularyImage", formState.imageUrl);
        }
        if (shouldDeleteImage) {
          formData.append("deleteImage", "true");
        } else await onSubmit(formData);
      } else if (type === "grammar") {
        // Grammar logic

        if (!formState.lessonId) {
          throw new Error("Lesson is required");
        }
        if (!formState.title || !formState.structure) {
          throw new Error("Title and structure are required");
        }
        //form data not work
        const formData = new FormData();
        formData.append("lessonId", formState.lessonId);
        formData.append("title", formState.title);
        formData.append("structure", formState.structure);
        if (formState.example) formData.append("example", formState.example);
        if (formState.explanation)
          formData.append("explanation", formState.explanation);
        await onSubmit(formState);
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderLessonForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#CFCFCF] mb-1">Name</label>
        <input
          type="text"
          value={formState.name || ""}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Description</label>
        <textarea
          value={formState.description || ""}
          onChange={(e) =>
            setFormState({ ...formState, description: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-32"
          required
        />
      </div>
    </form>
  );

  const renderTestForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#CFCFCF] mb-1">Name</label>
        <input
          type="text"
          value={formState.name || ""}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Description</label>
        <textarea
          value={formState.description || ""}
          onChange={(e) =>
            setFormState({ ...formState, description: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-32"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Select Lessons</label>
        <div className="max-h-40 overflow-y-auto bg-[#2D2D2D] border border-[#1D1D1D] rounded-md p-2">
          {!courseDetails?.lessons.length ? (
            <p className="text-[#9A9A9A] text-sm p-2">
              No lessons available in this course
            </p>
          ) : (
            courseDetails.lessons.map(({ lesson }, index) => (
              <div
                key={lesson._id}
                className="flex items-center space-x-2 py-2 hover:bg-[#373737] px-2 rounded"
              >
                <input
                  type="checkbox"
                  id={`lesson-${lesson._id}`}
                  checked={selectedLessons.includes(lesson._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLessons([...selectedLessons, lesson._id]);
                    } else {
                      setSelectedLessons(
                        selectedLessons.filter((id) => id !== lesson._id)
                      );
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-blue-500 rounded"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`lesson-${lesson._id}`}
                    className="text-[#CFCFCF] cursor-pointer flex items-center justify-between"
                  >
                    <span>
                      Lesson {index + 1}: {lesson.name}
                    </span>
                    <span className="text-sm text-[#9A9A9A]">
                      {Array.isArray(lesson.length)
                        ? lesson.length
                            .map(
                              (l) =>
                                `${
                                  l.for.charAt(0).toUpperCase() + l.for.slice(1)
                                }: ${l.amount} min`
                            )
                            .join(" • ")
                        : "0 min"}
                    </span>
                  </label>
                  {lesson.description && (
                    <p className="text-sm text-[#9A9A9A] mt-1 line-clamp-2">
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {selectedLessons.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            Please select at least one lesson
          </p>
        )}
        <p className="text-[#9A9A9A] text-sm mt-1">
          Selected: {selectedLessons.length} lesson
          {selectedLessons.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Total Questions</label>
        <input
          type="number"
          value={formState.totalQuestions || ""}
          onChange={(e) =>
            setFormState({ ...formState, totalQuestions: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          min="1"
          required
        />
      </div>
    </form>
  );

  const renderExerciseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Question <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formState.question || ""}
          onChange={(e) =>
            setFormState({ ...formState, question: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-32"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.type || ""}
          onChange={(e) => setFormState({ ...formState, type: e.target.value })}
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        >
          <option value="">Select Type</option>
          {Object.entries(ExerciseTypeEnum).map(([key, value]) => (
            <option key={value} value={value}>
              {formatEnumValue(key)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Focus <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.focus || ""}
          onChange={(e) =>
            setFormState({ ...formState, focus: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        >
          <option value="">Select Focus</option>
          {Object.entries(ExerciseFocusEnum).map(([key, value]) => (
            <option key={value} value={value}>
              {formatEnumValue(key)}
            </option>
          ))}
        </select>
      </div>
      {formState.type !== ExerciseTypeEnum.MULTIPLE_CHOICE && (
        <div>
          <label className="block text-[#CFCFCF] mb-2">
            Answers <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  placeholder={`Answer ${index + 1}`}
                  className="flex-1 p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                  required
                />
                {answers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newAnswers = answers.filter((_, i) => i !== index);
                      setAnswers(newAnswers);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAnswers([...answers, ""])}
              className="w-full p-2 border border-dashed border-blue-500 text-blue-400 rounded-md hover:bg-blue-500/10 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Answer</span>
            </button>
          </div>
        </div>
      )}
      {formState.type === ExerciseTypeEnum.MULTIPLE_CHOICE && (
        <div>
          <label className="block text-[#CFCFCF] mb-1">
            Options <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[idx] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      setOptions(options.filter((_, i) => i !== idx))
                    }
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-200"
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOptions([...options, ""])}
              className="w-full p-2 border border-dashed border-blue-500 text-blue-400 rounded-md hover:bg-blue-500/10 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Option</span>
            </button>
          </div>
        </div>
      )}
      {formState.type === ExerciseTypeEnum.MULTIPLE_CHOICE && (
        <div>
          <label className="block text-[#CFCFCF] mb-1">
            Answer <span className="text-red-500">*</span>
          </label>
          <select
            value={formState.answer || ""}
            onChange={(e) =>
              setFormState({ ...formState, answer: e.target.value })
            }
            className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
            required
          >
            <option value="">Select Answer</option>
            {options.map(
              (option, index) =>
                option.trim() && (
                  <option key={index} value={option}>
                    {option}
                  </option>
                )
            )}
          </select>
        </div>
      )}
      <div>
        <label className="block text-[#CFCFCF] mb-1">Explanation</label>
        <textarea
          value={formState.explanation || ""}
          onChange={(e) =>
            setFormState({ ...formState, explanation: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-32"
        />
      </div>
      {formState.type === ExerciseTypeEnum.IMAGE_TRANSLATE && (
        <div>
          <label className="block text-[#CFCFCF] mb-1">Exercise Image</label>
          <div className="relative">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-[#CFCFCF] file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-sm file:bg-[#4CC2FF] file:text-black hover:file:bg-[#3AA0DB] cursor-pointer bg-[#2D2D2D] rounded-[5px] border border-[#1D1D1D]"
              required={
                mode === "create" &&
                formState.type === ExerciseTypeEnum.IMAGE_TRANSLATE
              }
            />
          </div>
          {imagePreview && (
            <div className="mt-2 relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded border border-[#1D1D1D]"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );

  const renderVocabularyForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Lesson <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.lessonId || ""}
          onChange={(e) =>
            setFormState({ ...formState, lessonId: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        >
          <option value="">Select Lesson</option>
          {courseDetails?.lessons?.map(({ lesson }) => (
            <option key={lesson._id} value={lesson._id}>
              {lesson.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          English Content <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.englishContent || ""}
          onChange={(e) =>
            setFormState({ ...formState, englishContent: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Vietnamese Content <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.vietnameseContent || ""}
          onChange={(e) =>
            setFormState({ ...formState, vietnameseContent: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-[#CFCFCF] file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-sm file:bg-[#4CC2FF] file:text-black hover:file:bg-[#3AA0DB] cursor-pointer bg-[#2D2D2D] rounded-[5px] border border-[#1D1D1D]"
          required={mode === "create"}
        />
        {(imagePreview || formState.imageUrl) && (
          <div className="mt-2 relative group">
            <img
              src={imagePreview || formState.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded border border-[#1D1D1D]"
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </form>
  );

  const renderGrammarForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Lesson <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.lessonId || ""}
          onChange={(e) =>
            setFormState({ ...formState, lessonId: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        >
          <option value="">Select Lesson</option>
          {courseDetails?.lessons?.map(({ lesson }) => (
            <option key={lesson._id} value={lesson._id}>
              {lesson.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.title || ""}
          onChange={(e) =>
            setFormState({ ...formState, title: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">
          Structure <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.structure || ""}
          onChange={(e) =>
            setFormState({ ...formState, structure: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
          required
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Example</label>
        <input
          type="text"
          value={formState.example || ""}
          onChange={(e) =>
            setFormState({ ...formState, example: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white"
        />
      </div>
      <div>
        <label className="block text-[#CFCFCF] mb-1">Explanation</label>
        <textarea
          value={formState.explanation || ""}
          onChange={(e) =>
            setFormState({ ...formState, explanation: e.target.value })
          }
          className="w-full p-2 bg-[#2D2D2D] border border-[#1D1D1D] rounded-md text-white h-24"
        />
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202020] border border-[#1D1D1D] rounded-lg flex flex-col w-full max-w-lg max-h-[90vh]">
        <div className="p-6 border-b border-[#1D1D1D]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {mode === "edit"
                ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
                : `Create ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </h2>
            <button
              onClick={onCancel}
              className="text-[#CFCFCF] hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {type === "lesson" && renderLessonForm()}
          {type === "test" && renderTestForm()}
          {type === "exercise" && renderExerciseForm()}
          {type === "vocabulary" && renderVocabularyForm()}
          {type === "grammar" && renderGrammarForm()}
        </div>

        <div className="p-4 border-t border-[#1D1D1D] flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[#CFCFCF] hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4CC2FF] text-black rounded hover:bg-[#3AA0DB] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
