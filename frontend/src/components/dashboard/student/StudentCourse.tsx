import React, { useEffect, useState } from "react";
import { getCoursesByStudent } from "@services/StudentCourseService";
import { InlineSpinner } from "../../../components/common/LoadingSpinnerPage";


interface ICourse {
  id: number;
  courseCode: string;
  courseName: string;
  courseDescription: string;
  userId: string; // Teacher's userId
}

interface IEnrollment {
  id: number;
  studentCourseId: string;
  userId: string; // Student's userId
  courseCode: string;
  createdTime: string;
  course: ICourse | null;
}

// interface IUser {
//   id: string;
//   firstName: string;
//   lastName: string;
// }

interface StudentCourseProps {
  studentUserId?: string;
}

export const StudentCourse: React.FC<StudentCourseProps> = ({ studentUserId }) => {
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  // const [teachers, setTeachers] = useState<Record<string, string>>({});
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

 return (
  <>
    {/* ⬇️ Loading State */}
    {loading ? (
      <div className="w-full flex flex-col items-center justify-center py-32">
        <InlineSpinner />
        <span className="text-sm mt-4 text-gray-800">Loading courses...</span>
      </div>
    ) : (
      /* ⬇️ Show grid ONLY after loading finishes */
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {enrollments.map((enroll) => (
          <div
            key={enroll.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {enroll.course?.courseName ?? enroll.courseCode}
            </h3>

            <p className="text-sm text-gray-500 mb-2">
              {enroll.course?.courseDescription ?? "No description"}
            </p>

            <p className="text-sm font-medium text-gray-700">
              Course Code: {enroll.courseCode}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Enrolled on: {new Date(enroll.createdTime).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    )}
  </>
);

};
