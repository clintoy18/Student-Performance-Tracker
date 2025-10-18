import React, { useState, useEffect, useMemo } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { fetchAllUsersAdmin } from "@services/AdminService";
import { enrollStudentInCourse } from "@services/StudentCourseService";
import type { IUser } from "@interfaces";
import type { ICourse } from "@interfaces/models/ICourse";
import { parseNumericRole } from "../../../../utils/roleUtils";

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course: ICourse | null;
}

export default function EnrollStudentModal({
  isOpen,
  onClose,
  onSuccess,
  course,
}: EnrollStudentModalProps) {
  const [students, setStudents] = useState<IUser[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    } else {
      // Reset state when modal closes
      setSelectedStudentId("");
      setSearchTerm("");
      setError("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    setFetchingStudents(true);
    try {
      const rawData = await fetchAllUsersAdmin();
      const parsedStudents: IUser[] = rawData
        .map((user: any) => {
          const role = parseNumericRole(user.role);
          if (role === null) {
            console.warn("Unknown role value:", user.role, "for user", user.userId);
            return null;
          }

          return {
            UserId: user.userId,
            FirstName: user.firstName,
            MiddleName: user.middleName,
            LastName: user.lastName,
            Program: user.program,
            Role: role,
            CreatedTime: user.createdTime
          };
        })
        .filter((user): user is IUser => user !== null && user.Role === "Student");

      setStudents(parsedStudents);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
    } finally {
      setFetchingStudents(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;

    const searchLower = searchTerm.toLowerCase();
    return students.filter((student) => {
      const fullName = [student.FirstName, student.MiddleName, student.LastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const userId = student.UserId.toLowerCase();

      return fullName.includes(searchLower) || userId.includes(searchLower);
    });
  }, [students, searchTerm]);

  const selectedStudent = students.find((s) => s.UserId === selectedStudentId);

  const handleEnroll = async () => {
    if (!selectedStudentId || !course) {
      setError("Please select a student");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await enrollStudentInCourse({
        StudentUserId: selectedStudentId,
        CourseCode: course.CourseCode,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Enroll Student</h2>
            <p className="text-sm text-gray-500 mt-1">{course.CourseName} ({course.CourseCode})</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {fetchingStudents ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Loading students...</p>
            </div>
          ) : (
            <>
              {/* Student Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Student <span className="text-red-500">*</span>
                </label>

                {/* Selected Student Display / Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-gray-400 focus:border-transparent flex items-center justify-between hover:bg-gray-50"
                  disabled={loading}
                >
                  {selectedStudent ? (
                    <span className="text-gray-900">
                      {[selectedStudent.FirstName, selectedStudent.MiddleName, selectedStudent.LastName]
                        .filter(Boolean)
                        .join(" ")} ({selectedStudent.UserId})
                    </span>
                  ) : (
                    <span className="text-gray-400">Select a student...</span>
                  )}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="mt-1 border border-gray-300 rounded-lg bg-white shadow-lg">
                    {/* Search Input */}
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search by name or user ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          const fullName = [student.FirstName, student.MiddleName, student.LastName]
                            .filter(Boolean)
                            .join(" ");

                          return (
                            <button
                              key={student.UserId}
                              type="button"
                              onClick={() => handleSelectStudent(student.UserId)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                                selectedStudentId === student.UserId ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="font-medium text-gray-900">{fullName}</div>
                              <div className="text-sm text-gray-500">
                                {student.UserId} • {student.Program}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 text-sm">
                          No students found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {students.length === 0 && !fetchingStudents && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No students available to enroll
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEnroll}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading || !selectedStudentId || fetchingStudents}
            >
              <UserPlus size={16} />
              {loading ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
