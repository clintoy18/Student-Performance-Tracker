import React, { useEffect, useState } from "react";
import { getCoursesByStudent } from "@services/StudentCourseService";

export const StudentCourse = ({ studentUserId }: { studentUserId?: any }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
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

  if (loading) return <p>Loading enrolled subjects...</p>;

  return (
    <div className="space-y-3">
      {enrollments.length === 0 ? (
        <p>No enrolled subjects yet.</p>
      ) : (
        enrollments.map((enroll: any) => (
          <div
            key={enroll.id}
            className="p-4 border rounded-lg bg-white flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{enroll.course.courseName}</h3>
              <p className="text-sm text-gray-600">
                {enroll.course.courseDescription}
              </p>
            </div>
            <span className="font-medium text-blue-600">
              Grade: {enroll.grade ?? "N/A"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};
