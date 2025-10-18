import React, { useEffect, useState } from "react";
import { getCoursesByStudent } from "@services/StudentCourseService";

export const Grade = ({ studentUserId }: { studentUserId?: string }) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getCoursesByStudent(studentUserId);
        setGrades(data);
      } catch (err) {
        console.error("Failed to load grades:", err);
      } finally {
        setLoading(false);
      }
    };


    fetchGrades();
  }, [studentUserId]);

  if (loading) return <p>Loading grades...</p>;

  return (
    <div className="space-y-3">
      {grades.length === 0 ? (
        <p>No grades available yet.</p>
      ) : (
        grades.map((grade: any) => (
          <div
            key={grade.id}
            className="p-4 border rounded-lg bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{grade.course.courseName}</h3>
            </div>
            <span
              className={`font-medium px-2 py-1 rounded-full border ${
                grade.grade >= 90
                  ? "text-green-600 border-green-200 bg-green-50"
                  : grade.grade >= 80
                  ? "text-blue-600 border-blue-200 bg-blue-50"
                  : grade.grade >= 70
                  ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                  : "text-red-600 border-red-200 bg-red-50"
              }`}
            >
              {grade.grade ?? "N/A"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};
