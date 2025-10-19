import React, { useEffect, useState } from "react";
import { getCoursesByStudent } from "@services/StudentCourseService";

interface IEnrollment {
  id: string;
  courseCode: string;
  course: null;
}

interface StudentCourseProps {
  studentUserId?: string;
}

export const StudentCourse: React.FC<StudentCourseProps> = ({ studentUserId }) => {
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!studentUserId) return;

      try {
        const data = await getCoursesByStudent(studentUserId);
        setEnrollments(data);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [studentUserId]);

  if (loading) return <p className="text-sm text-gray-500">Loading enrolled subjects...</p>;

  return (
    <div className="space-y-3">
      {enrollments.length === 0 ? (
        <p className="text-sm text-gray-500">No enrolled subjects yet.</p>
      ) : (
        <div className="space-y-2">
          {enrollments.map(enroll => (
            <div
              key={enroll.id}
              className="p-3 border border-gray-200 rounded-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {enroll.courseCode ?? "Course code not available"}
                </h3>
                <span className="text-xs text-gray-500">Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};