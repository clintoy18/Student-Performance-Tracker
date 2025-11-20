import React, { useState, useEffect, useMemo } from "react";
import { X, Search, UserPlus, GraduationCap } from "lucide-react";
import { fetchAllUsersAdmin } from "@services/AdminService";
import { enrollStudentInCourse } from "@services/StudentCourseService";
import type { IUser } from "@interfaces";
import type { ICourse } from "@interfaces/models/ICourse";
import { parseNumericRole } from "../../../../utils/roleUtils";
import { useToast } from "../../../../context/ToastContext";

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
  const { success, error: showError } = useToast();
  const [students, setStudents] = useState<IUser[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    } else {
      // Reset state when modal closes
      setSelectedStudent(null);
      setSearchTerm("");
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
      showError("Failed to load students");
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

  const handleEnroll = async () => {
    if (!selectedStudent || !course) {
      showError("Please select a student");
      return;
    }

    setLoading(true);

    try {
      await enrollStudentInCourse({
        StudentUserId: selectedStudent.UserId,
        CourseCode: course.CourseCode,
      });

      success("Student enrolled successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus size={24} />
              Enroll Student
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {course.CourseName} ({course.CourseCode})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={loading}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          {/* Search Bar */}
          {students.length > 0 && !fetchingStudents && (
            <div className="mb-4 relative">
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
          )}

          {/* Students List */}
          {fetchingStudents ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p className="text-sm">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <GraduationCap className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-sm">No students available to enroll</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.UserId === student.UserId;
                  const fullName = [student.FirstName, student.MiddleName, student.LastName]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div
                      key={student.UserId}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors flex justify-between items-start ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{fullName}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {student.UserId}
                        </p>
                        {student.Program && (
                          <p className="text-sm text-gray-600 mt-1">
                            Program: {student.Program}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <UserPlus size={20} className="text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No students found matching "{searchTerm}"
                </div>
              )}

              {/* Student Count */}
              {students.length > 0 && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  Showing {filteredStudents.length} of {students.length} student
                  {students.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t flex gap-3">
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
              disabled={loading || !selectedStudent || fetchingStudents}
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