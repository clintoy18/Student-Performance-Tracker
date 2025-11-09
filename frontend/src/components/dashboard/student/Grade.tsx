import React, { useEffect, useState } from "react";
import { getCoursesByStudent } from "@services/StudentCourseService";
import { MessageSquare, Send } from "lucide-react";

// Feedback Modal Component
const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  courseCode, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  courseCode: string;
  onSubmit: (feedback: string) => Promise<void>;
}) => {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setError("Please enter your feedback");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(feedback);
      setFeedback("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFeedback("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Submit Feedback
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Course: {courseCode}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="feedback" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about this course, the teaching style, materials, etc..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Your feedback helps improve the course experience
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Grade = ({ studentUserId }: { studentUserId?: string }) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const data = await getCoursesByStudent(studentUserId);
      setGrades(data);
    } catch (err) {
      console.error("Failed to load grades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [studentUserId]);

  const handleOpenFeedbackModal = (course: any) => {
    setSelectedCourse(course);
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (feedbackText: string) => {
    // TODO: Replace this with your actual API call to submit feedback
    // Example:
    // import { submitCourseFeedback } from "@services/FeedbackService";
    // await submitCourseFeedback({
    //   courseId: selectedCourse.id,
    //   studentUserId: studentUserId,
    //   feedback: feedbackText
    // });

    console.log("Submitting feedback:", {
      courseId: selectedCourse.id,
      courseCode: selectedCourse.courseCode,
      feedback: feedbackText,
      studentUserId: studentUserId
    });

    // Simulating API call - REMOVE THIS and use actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Refresh grades after submission
    await fetchGrades();
  };

  if (loading) return <p className="text-sm text-gray-500">Loading grades...</p>;

  return (
    <>
      <div className="space-y-3">
        {grades.length === 0 ? (
          <p className="text-sm text-gray-500">No grades available yet.</p>
        ) : (
          <div className="space-y-2">
            {grades.map((grade: any) => {
              // Check if student has provided feedback
              const hasFeedback = grade.hasFeedback || grade.feedbackSubmitted || grade.feedback;
              const showGrade = hasFeedback && (grade.grade !== null && grade.grade !== undefined);

              return (
                <div
                  key={grade.id}
                  className="p-3 border border-gray-200 rounded-sm bg-white"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">
                        {grade.courseCode ?? "Course code not available"}
                      </h3>
                      {!hasFeedback && (
                        <p className="text-xs text-gray-500 mt-1">
                          Submit feedback to view your grade
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!hasFeedback && (
                        <button
                          onClick={() => handleOpenFeedbackModal(grade)}
                          className="flex items-center gap-1 text-blue-600 border border-blue-300 px-2 py-1 rounded text-xs hover:bg-blue-50 transition-colors"
                          title="Submit Feedback"
                        >
                          <MessageSquare size={12} />
                          <span>Feedback</span>
                        </button>
                      )}
                      {showGrade ? (
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-sm border ${
                            grade.grade >= 90
                              ? "text-green-600 border-green-200 bg-green-50"
                              : grade.grade >= 80
                              ? "text-blue-600 border-blue-200 bg-blue-50"
                              : grade.grade >= 70
                              ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                              : "text-red-600 border-red-200 bg-red-50"
                          }`}
                        >
                          {grade.grade}
                        </span>
                      ) : hasFeedback ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-sm border text-gray-500 border-gray-200 bg-gray-50">
                          Pending
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-1 rounded-sm border text-amber-600 border-amber-200 bg-amber-50">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        courseCode={selectedCourse?.courseCode || ""}
        onSubmit={handleSubmitFeedback}
      />
    </>
  );
};