import React, { useEffect, useState, useMemo } from "react";
import { Search, UserCheck } from "lucide-react";
import { fetchAllUsersAdmin, assignTeacherToCourse } from "@services/AdminService";
import type { IUser } from "@interfaces/models/IUser";
import Modal from "../../../common/modal/Modal";
import Button from "../../../common/Button";
import { InlineSpinner } from '../../../common/LoadingSpinnerPage';
import { parseNumericRole } from "../../../../utils/roleUtils";

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
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teachers when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchTeachers = async () => {
      setFetching(true);
      setError("");
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
        setError("Failed to load teachers");
      } finally {
        setFetching(false);
      }
    };

    fetchTeachers();
  }, [isOpen]);

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
      setError("Please select a teacher");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await assignTeacherToCourse(course.Id, selectedTeacher.id);
      onSuccess();
      onClose();
      setSelectedTeacher(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to assign teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Teacher to ${course?.CourseName || ""}`}
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search teacher..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {fetching ? (
          <div className="flex justify-center py-10">
            <InlineSpinner />
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredTeachers.length ? (
              filteredTeachers.map((teacher) => {
                const isSelected = selectedTeacher?.id === teacher.id;
                return (
                  <div
                    key={teacher.id}
                    className={`flex justify-between items-center px-3 py-2 cursor-pointer ${
                      isSelected ? "bg-blue-50" : ""
                    } hover:bg-gray-50`}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <div>
                      <p className="text-gray-900 text-sm font-medium">
                        {teacher.firstName} {teacher.lastName}
                      </p>
                      <p className="text-gray-500 text-xs">{teacher.email}</p>
                    </div>
                    {isSelected && <UserCheck size={16} className="text-blue-600" />}
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 text-center py-4">No teachers found.</div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            label="Cancel"
            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={loading}
          />
          <Button
            type="button"
            onClick={handleAssign}
            label={loading ? "Assigning..." : "Assign Teacher"}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            disabled={!selectedTeacher || loading}
          />
        </div>
      </div>
    </Modal>
  );
}
