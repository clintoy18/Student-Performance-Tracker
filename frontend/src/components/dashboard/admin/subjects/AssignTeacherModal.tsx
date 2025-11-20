import React, { useEffect, useState, useMemo } from "react";
import { Search, UserCheck, X } from "lucide-react";
import { fetchAllUsersAdmin, assignTeacherToCourse } from "@services/AdminService";
import type { IUser } from "@interfaces/models/IUser";
import { InlineSpinner } from '../../../common/LoadingSpinnerPage';
import { parseNumericRole } from "../../../../utils/roleUtils";
import { useToast } from "../../../../context/ToastContext";

interface AssignTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: { Id: number; CourseName: string } | null;
  onSuccess: () => void;
}

export default function AssignTeacherModal({
  isOpen,
  onClose,
  course,
  onSuccess,
}: AssignTeacherModalProps) {
  const { success, error: showError } = useToast();
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teachers when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSelectedTeacher(null);
      setSearchTerm("");
      return;
    }

    const fetchTeachers = async () => {
      setFetching(true);
      try {
        const allUsers = await fetchAllUsersAdmin();

        const teacherUsers = allUsers
          .map((u: any) => {
            const role = parseNumericRole(u.role);
            if (role === null) return null;

            return {
              id: u.userId,
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              Role: role,
            } as IUser;
          })
          .filter((u): u is IUser => u !== null && u.Role === "Teacher");

        setTeachers(teacherUsers);
      } catch (err: any) {
        console.error(err);
        showError("Failed to load teachers");
      } finally {
        setFetching(false);
      }
    };

    fetchTeachers();
  }, [isOpen, showError]);

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    const lower = searchTerm.toLowerCase();
    return teachers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(lower) ||
        t.lastName.toLowerCase().includes(lower) ||
        t.email.toLowerCase().includes(lower)
    );
  }, [teachers, searchTerm]);

  const handleAssign = async () => {
    if (!selectedTeacher || !course) {
      showError("Please select a teacher");
      return;
    }

    setLoading(true);

    try {
      await assignTeacherToCourse(course.Id, selectedTeacher.id);
      success("Teacher assigned successfully!");
      onSuccess();
      onClose();
      setSelectedTeacher(null);
    } catch (err: any) {
      console.error(err);
      showError("Failed to assign teacher");
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
              <UserCheck size={24} />
              Assign Teacher
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {course.CourseName} (ID: {course.Id})
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
          {teachers.length > 0 && !fetching && (
            <div className="mb-4 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          )}

          {/* Teachers List */}
          {fetching ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <InlineSpinner />
            </div>
          ) : teachers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <UserCheck className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-sm">No teachers available</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const isSelected = selectedTeacher?.id === teacher.id;
                  return (
                    <div
                      key={teacher.id}
                      onClick={() => setSelectedTeacher(teacher)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors flex justify-between items-start ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {teacher.email}
                        </p>
                      </div>
                      {isSelected && (
                        <UserCheck size={20} className="text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No teachers found matching "{searchTerm}"
                </div>
              )}

              {/* Teacher Count */}
              {teachers.length > 0 && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  Showing {filteredTeachers.length} of {teachers.length} teacher
                  {teachers.length !== 1 ? "s" : ""}
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
              onClick={handleAssign}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={!selectedTeacher || loading}
            >
              {loading ? "Assigning..." : "Assign Teacher"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}