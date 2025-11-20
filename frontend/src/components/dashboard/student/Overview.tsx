import React, { useEffect, useState } from "react";
import Card from "../../common/Card";
import { ChartBarIncreasing } from "lucide-react";
import { getCoursesByStudent } from "@services/StudentCourseService";
import { checkStudentFeedbackExists } from "@services/StudentService";

const Overview = ({ studentUserId }: { studentUserId?: string }) => {
  const [overallAverage, setOverallAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradesAndCalculateAverage = async () => {
      if (!studentUserId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCoursesByStudent(studentUserId);
        
        // Filter grades that are visible (student has submitted feedback)
        const gradesWithFeedback = await Promise.all(
          data.map(async (grade) => {
            try {
              const hasStudentFeedback = await checkStudentFeedbackExists(
                studentUserId,
                grade.courseCode
              );
              return {
                ...grade,
                hasStudentFeedback,
              };
            } catch (err) {
              return {
                ...grade,
                hasStudentFeedback: false,
              };
            }
          })
        );

        // Calculate average of visible grades
        const validGrades = gradesWithFeedback.filter(
          (grade) =>
            grade.hasStudentFeedback &&
            grade.grade !== null &&
            grade.grade !== undefined
        );

        if (validGrades.length > 0) {
          const sum = validGrades.reduce((acc, grade) => acc + grade.grade, 0);
          const average = sum / validGrades.length;
          setOverallAverage(Math.round(average * 10) / 10); // Round to 1 decimal
        } else {
          setOverallAverage(null);
        }
      } catch (err) {
        console.error("Failed to calculate average:", err);
        setOverallAverage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGradesAndCalculateAverage();
  }, [studentUserId]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card
        title="Overall Average"
        icon={ChartBarIncreasing}
        percentage={
          loading
            ? "Loading..."
            : overallAverage !== null
            ? `${overallAverage}%`
            : "N/A"
        }
        description={
          loading
            ? "Calculating your performance..."
            : overallAverage !== null
            ? "Your performance across all courses"
            : "No grades available yet"
        }
      />
    </div>
  );
};

export default Overview;