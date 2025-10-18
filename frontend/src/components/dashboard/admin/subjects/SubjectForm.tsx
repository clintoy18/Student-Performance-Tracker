import React, { useState, useEffect } from "react";
import TextInputField from "../../../common/TextInputField";
import Button from "../../../common/Button";
import { PlusCircleIcon, Save } from "lucide-react";
import { checkCourseCodeExists } from "@services/CourseService";
import type { ICourse } from "@interfaces/models/ICourse";

interface SubjectFormProps {
  onSubmit: (data: Partial<ICourse>) => void;
  onCancel?: () => void;
  initialData?: ICourse | null;
  teacherUserId: string;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  teacherUserId
}) => {
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    courseDescription: "",
  });
  const [error, setError] = useState("");
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
    setError("");
  };

  const validateCourseCode = async (code: string): Promise<boolean> => {
    // If updating and code hasn't changed, skip validation
    if (initialData && initialData.CourseCode === code) {
      return true;
    }

    setValidatingCode(true);
    try {
      const exists = await checkCourseCodeExists(code);
      if (exists) {
        setError("Course code already exists. Please use a different code.");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating course code:", err);
      return true; // Allow submission if validation fails
    } finally {
      setValidatingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.courseName.trim() || !formData.courseCode.trim()) {
      setError("Course name and code are required.");
      return;
    }

    setLoading(true);

    // Validate course code uniqueness
    const isValid = await validateCourseCode(formData.courseCode.trim());
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const courseData: Partial<ICourse> = {
        CourseCode: formData.courseCode.trim(),
        CourseName: formData.courseName.trim(),
        CourseDescription: formData.courseDescription.trim(),
        TeacherUserId: teacherUserId,
      };

      if (initialData) {
        courseData.Id = initialData.Id;
      }

      await onSubmit(courseData);

      // Reset form only if creating new course
      if (!initialData) {
        setFormData({ courseCode: "", courseName: "", courseDescription: "" });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <TextInputField
        id="course-code"
        label="Course Code"
        value={formData.courseCode}
        onChange={(e) => handleChange("courseCode", e.target.value)}
        placeholder="e.g., CS101"
        required
        disabled={loading || validatingCode}
      />

      <TextInputField
        id="course-name"
        label="Course Name"
        value={formData.courseName}
        onChange={(e) => handleChange("courseName", e.target.value)}
        placeholder="e.g., Introduction to Computer Science"
        required
        disabled={loading}
      />

      <div className="space-y-1">
        <label htmlFor="course-description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="course-description"
          value={formData.courseDescription}
          onChange={(e) => handleChange("courseDescription", e.target.value)}
          placeholder="Enter course description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
          rows={3}
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            label="Cancel"
            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={loading || validatingCode}
          />
        )}
        <Button
          icon={initialData ? <Save size={20} /> : <PlusCircleIcon size={20} />}
          label={
            loading || validatingCode
              ? "Saving..."
              : initialData
              ? "Update Course"
              : "Add Course"
          }
          type="submit"
          className="flex-1"
          disabled={loading || validatingCode}
        />
      </div>
    </form>
  );
};

export default SubjectForm;
