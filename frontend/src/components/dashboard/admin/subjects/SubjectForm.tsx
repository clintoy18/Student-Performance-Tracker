import React, { useState, useEffect } from "react";
import TextInputField from "../../../common/TextInputField";
import { PlusCircleIcon, Save, BookOpen, X } from "lucide-react";
import { checkCourseCodeExists } from "@services/CourseService";
import type { ICourse } from "@interfaces/models/ICourse";
import { useToast } from "../../../../context/ToastContext";

interface SubjectFormProps {
  onSubmit: (data: Partial<ICourse>) => void;
  onCancel?: () => void;
  initialData?: ICourse | null;
  teacherUserId: string;
  isOpen?: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  teacherUserId,
  isOpen = true
}) => {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    courseDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [validatingCode, setValidatingCode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        courseCode: initialData.CourseCode,
        courseName: initialData.CourseName,
        courseDescription: initialData.CourseDescription || "",
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateCourseCode = async (code: string): Promise<boolean> => {
    if (initialData && initialData.CourseCode === code) {
      return true;
    }

    setValidatingCode(true);
    try {
      const exists = await checkCourseCodeExists(code);
      if (exists) {
        showError("Course code already exists. Please use a different code.");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating course code:", err);
      return true;
    } finally {
      setValidatingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.courseName.trim() || !formData.courseCode.trim()) {
      showError("Course name and code are required.");
      return;
    }

    // Client-side validation for course code format
    const codeRegex = /^[A-Za-z0-9-]+$/;
    if (!codeRegex.test(formData.courseCode.trim())) {
      showError("Course code can only contain letters, numbers, and hyphens.");
      return;
    }

    setLoading(true);

    try {
      // Validate course code uniqueness (but don't block on server errors)
      let isValid = true;
      try {
        isValid = await validateCourseCode(formData.courseCode.trim());
      } catch (validationError) {
        // If validation fails, ask user if they want to continue
        const shouldContinue = window.confirm(
          "Unable to verify if course code is unique. Do you want to continue anyway?"
        );
        if (!shouldContinue) {
          setLoading(false);
          return;
        }
      }

      if (!isValid) {
        setLoading(false);
        return;
      }

      const courseData: Partial<ICourse> = {
        CourseCode: formData.courseCode.trim(),
        CourseName: formData.courseName.trim(),
        CourseDescription: formData.courseDescription.trim(),
        TeacherUserId: null,
      };

      if (initialData) {
        courseData.Id = initialData.Id;
      }

      await onSubmit(courseData);

      // Show success message
      success(initialData ? "Course updated successfully!" : "Course created successfully!");

      // Reset form only if creating new course
      if (!initialData) {
        setFormData({ courseCode: "", courseName: "", courseDescription: "" });
      }
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gray-700" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? "Update Course" : "Create New Course"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {initialData ? "Modify course details" : "Add a new course to the system"}
              </p>
            </div>
          </div>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
            <TextInputField
              id="course-code"
              label="Course Code"
              value={formData.courseCode}
              onChange={(e) => handleChange("courseCode", e.target.value)}
              placeholder="e.g., CS101"
              required
              disabled={loading || validatingCode}
              className="w-full"
            />

            <TextInputField
              id="course-name"
              label="Course Name"
              value={formData.courseName}
              onChange={(e) => handleChange("courseName", e.target.value)}
              placeholder="e.g., Introduction to Computer Science"
              required
              disabled={loading}
              className="w-full"
            />

            <div className="space-y-2">
              <label htmlFor="course-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="course-description"
                value={formData.courseDescription}
                onChange={(e) => handleChange("courseDescription", e.target.value)}
                placeholder="Enter course description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                  font-sans text-sm disabled:bg-gray-100 disabled:cursor-not-allowed 
                  resize-none transition-colors"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Action Buttons - Using same approach as ViewEnrolledStudentsModal */}
            <div className="flex gap-3 pt-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading || validatingCode}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading || validatingCode}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading || validatingCode ? (
                  "Saving..."
                ) : (
                  <>
                    {initialData ? <Save size={18} /> : <PlusCircleIcon size={18} />}
                    <span>{initialData ? "Update Course" : "Create Course"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectForm;