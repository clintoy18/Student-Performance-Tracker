import React, { useState, useEffect } from "react";
import { X, Users, Search, Trash2, GraduationCap } from "lucide-react";
import { getStudentsByCourse, removeStudentFromCourse } from "@services/StudentCourseService";
import type { ICourse } from "@interfaces/models/ICourse";
import type { IStudentCourse } from "@interfaces/models/IStudentCourse";

interface ViewEnrolledStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourse | null;
}

export default function ViewEnrolledStudentsModal({
  isOpen,
  onClose,
  course,
}: ViewEnrolledStudentsModalProps) {
  const [enrolledStudents, setEnrolledStudents] = useState<IStudentCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && course) {
      fetchEnrolledStudents();
    } else {
      // Reset state when modal closes
      setEnrolledStudents([]);
      setSearchTerm("");
      setError("");
      setRemovingStudentId(null);
    }
  }, [isOpen, course]);

  const fetchEnrolledStudents = async () => {
    if (!course) return;

    setLoading(true);
    setError("");
    try {
      const rawData = await getStudentsByCourse(course.CourseCode);
      const parsedData: IStudentCourse[] = rawData.map(studentCourse => ({
          StudentCourseId: studentCourse.studentCourseId,
          StudentUserId: studentCourse.studentUserId,
          CourseCode: studentCourse.courseCode,
          Grade: studentCourse.grade,
          FirstName: studentCourse.firstName,
          MiddleName: studentCourse.middleName,
          LastName: studentCourse.lastName,
          Program: studentCourse.program,
          Course: studentCourse.course
        }));
      setEnrolledStudents(parsedData);
    } catch (err: any) {
      console.error("Error fetching enrolled students:", err);
      setError("Failed to load enrolled students");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentUserId: string) => {
    if (!course) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this student from the course?"
    );
    if (!confirmed) return;

    setRemovingStudentId(studentUserId);
    setError("");

    try {
      await removeStudentFromCourse(studentUserId, course.CourseCode);
      // Refresh the list after successful removal
      await fetchEnrolledStudents();
    } catch (err: any) {
      console.error("Error removing student:", err);
      setError(err.response?.data?.message || "Failed to remove student");
    } finally {
      setRemovingStudentId(null);
    }
  };

  const filteredStudents = enrolledStudents.filter((enrollment) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const fullName = [
      enrollment.FirstName,
      enrollment.MiddleName,
      enrollment.LastName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const userId = enrollment.StudentUserId.toLowerCase();

    return fullName.includes(searchLower) || userId.includes(searchLower);
  });

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users size={24} />
              Enrolled Students
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {course.CourseName} ({course.CourseCode})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Search Bar */}
          {enrolledStudents.length > 0 && (
            <div className="mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Students List */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p className="text-sm">Loading enrolled students...</p>
            </div>
          ) : enrolledStudents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <GraduationCap className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-sm">No students enrolled yet</p>
              <p className="text-xs mt-1">
                Use the "Enroll" button to add students
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((enrollment) => {
                    const fullName = [
                      enrollment.FirstName,
                      enrollment.MiddleName,
                      enrollment.LastName,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div
                        key={enrollment.StudentUserId}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">
                              {fullName}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              ID: {enrollment.StudentUserId}
                            </p>
                            {enrollment.Program && (
                              <p className="text-sm text-gray-600 mt-1">
                                Program: {enrollment.Program}
                              </p>
                            )}
                            {enrollment.Grade !== null &&
                              enrollment.Grade !== undefined && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Grade: {enrollment.Grade}
                                  </span>
                                </div>
                              )}
                          </div>

                          <button
                            onClick={() =>
                              handleRemoveStudent(enrollment.StudentUserId)
                            }
                            disabled={
                              removingStudentId === enrollment.StudentUserId
                            }
                            className="flex items-center gap-1 text-red-600 border border-red-300 px-3 py-1.5 rounded text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove Student"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">
                              {removingStudentId === enrollment.StudentUserId
                                ? "Removing..."
                                : "Remove"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No students found matching "{searchTerm}"
                </div>
              )}

              {/* Student Count */}
              {enrolledStudents.length > 0 && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  Showing {filteredStudents.length} of{" "}
                  {enrolledStudents.length} student
                  {enrolledStudents.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
