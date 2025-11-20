import React, { useEffect, useState } from "react";
import { getCoursesByStudent } from "@services/StudentCourseService";
import { MessageSquare, Send, Eye, User, BookOpen, Star } from "lucide-react";
import { createStudentFeedback } from "@services/StudentService";
import type { IStudentFeedbackRequest } from "@interfaces/requests/IStudentFeedbackRequest";
import { checkStudentFeedbackExists } from "@services/StudentService";
import { getFeedbackForStudent } from "@services/GradeFeedbackService";
import { InlineSpinner } from "../../../components/common/LoadingSpinnerPage";
import Modal from "../../common/modal/Modal";
import { useToast } from "../../../context/ToastContext";

// Submit Feedback Modal Component
const SubmitFeedbackModal = ({
  isOpen,
  onClose,
  courseCode,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  onSubmit: (feedback: string) => Promise<void>;
}) => {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      showError("Please enter your feedback");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(feedback);
      setFeedback("");
      onClose();
    } catch (err: any) {
      showError(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFeedback("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit Course Feedback">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <BookOpen size={16} />
            <span className="text-sm font-medium">Course: {courseCode}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your feedback helps improve the course experience for future
              students
            </p>
          </div>

          <div className="flex gap-3 pt-2">
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
              disabled={submitting || !feedback.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </Modal>
  );
};

// View Teacher Feedback Modal Component
const ViewTeacherFeedbackModal = ({
  isOpen,
  onClose,
  courseCode,
  grade,
  feedback,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  grade?: number;
  feedback: string;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Teacher Feedback">
      <div className="space-y-4">
        {/* Course Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800">
              <BookOpen size={18} />
              <span className="font-medium">{courseCode}</span>
            </div>
            {grade !== undefined && grade !== null && (
              <div
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  grade >= 90
                    ? "bg-green-100 text-green-800"
                    : grade >= 80
                    ? "bg-blue-100 text-blue-800"
                    : grade >= 70
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {grade}
              </div>
            )}
          </div>
        </div>

        {/* Teacher Feedback Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <User size={16} />
              <span className="text-sm font-medium">Instructor's Feedback</span>
            </div>
          </div>

          <div className="p-4 bg-white">
            {feedback ? (
              <div className="space-y-3">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {feedback}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <Star size={12} className="text-yellow-500" />
                  <span>
                    This feedback is provided after you submitted your course
                    evaluation
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare
                  size={24}
                  className="mx-auto mb-2 text-gray-300"
                />
                <p className="text-sm">
                  No feedback provided by the instructor yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const Grade = ({ studentUserId }: { studentUserId?: string }) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitFeedbackModalOpen, setIsSubmitFeedbackModalOpen] =
    useState(false);
  const [isViewFeedbackModalOpen, setIsViewFeedbackModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { success, error: showError } = useToast();

  const fetchGrades = async () => {
    if (!studentUserId) {
      showError("Student ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCoursesByStudent(studentUserId);
      
      const feedbackedData = await Promise.all(
        data.map(async (grade) => {
          try {
            const teacherFeedback = await getFeedbackForStudent(studentUserId, grade.courseCode);
            const hasStudentFeedback = await checkStudentFeedbackExists(studentUserId, grade.courseCode);
            
            return {
              ...grade,
              hasStudentFeedback,
              hasTeacherFeedback: !!teacherFeedback?.feedback,
              feedback: teacherFeedback?.feedback || "",
            };
          } catch (err) {
            console.error(`Error fetching feedback for course ${grade.courseCode}:`, err);
            return {
              ...grade,
              hasStudentFeedback: false,
              hasTeacherFeedback: false,
              feedback: "",
            };
          }
        })
      );

      setGrades(feedbackedData);
    } catch (err) {
      console.error("Failed to load grades:", err);
      showError("Failed to load grades and feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [studentUserId]);

  const handleOpenSubmitFeedbackModal = (course: any) => {
    setSelectedCourse(course);
    setIsSubmitFeedbackModalOpen(true);
  };

  const handleOpenViewFeedbackModal = (course: any) => {
    setSelectedCourse(course);
    setIsViewFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (feedbackText: string) => {
    if (!selectedCourse || !studentUserId) {
      showError("Unable to submit feedback - missing required information");
      return;
    }

    const payload: IStudentFeedbackRequest = {
      studentFeedback: feedbackText,
      courseStudentUserId: studentUserId,
      courseCode: selectedCourse.courseCode,
    };

    try {
      await createStudentFeedback(payload);
      success("Feedback submitted successfully!");
      await fetchGrades();
    } catch (err: any) {
      console.error("Failed to submit feedback:", err);
      throw new Error(err?.message || "Failed to submit feedback");
    }
  };

  return (
    <>
      <div className="space-y-3">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-32">
            <InlineSpinner />
            <span className="text-sm mt-4 text-gray-800">
              Loading grades...
            </span>
          </div>
        ) : (
          <>
            {grades.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500">
                  No courses or grades available yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {grades.map((grade: any) => {
                  const hasStudentFeedback = grade.hasStudentFeedback || false;
                  const hasTeacherFeedback = grade.hasTeacherFeedback || false;
                  const showGrade = hasStudentFeedback && grade.grade !== null && grade.grade !== undefined;
                  
                  return (
                    <div
                      key={grade.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {grade.courseCode ?? "Course code not available"}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {grade.courseName || "Course name not available"}
                          </p>

                          {/* Status messages */}
                          {!hasTeacherFeedback ? (
                            <p className="text-xs text-gray-500">
                              Awaiting grade and feedback from instructor
                            </p>
                          ) : !hasStudentFeedback ? (
                            <p className="text-xs text-amber-600 font-medium">
                              Submit your feedback to view grade
                            </p>
                          ) : showGrade ? (
                            <p className="text-xs text-green-600 font-medium">
                              Grade and feedback available
                            </p>
                          ) : (
                            <p className="text-xs text-blue-600 font-medium">
                              Feedback submitted - grade pending
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Submit Feedback Button - Show when teacher feedback exists but student hasn't submitted */}
                          {!hasStudentFeedback && hasTeacherFeedback && (
                            <button
                              onClick={() => handleOpenSubmitFeedbackModal(grade)}
                              className="flex items-center gap-1 text-blue-600 border border-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                              title="Submit your course feedback"
                            >
                              <MessageSquare size={12} />
                              <span>Give Feedback</span>
                            </button>
                          )}

                          {/* View Teacher Feedback Button - Show when student has submitted feedback AND teacher feedback exists */}
                          {hasStudentFeedback && hasTeacherFeedback && (
                            <button
                              onClick={() => handleOpenViewFeedbackModal(grade)}
                              className="flex items-center gap-1 text-green-600 border border-green-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors"
                              title="View instructor feedback and grade"
                            >
                              <Eye size={12} />
                              <span>View Feedback</span>
                            </button>
                          )}

                          {/* Grade Display */}
                          {showGrade ? (
                            <span
                              className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${
                                grade.grade >= 90
                                  ? "text-green-700 border-green-300 bg-green-50"
                                  : grade.grade >= 80
                                  ? "text-blue-700 border-blue-300 bg-blue-50"
                                  : grade.grade >= 70
                                  ? "text-yellow-700 border-yellow-300 bg-yellow-50"
                                  : "text-red-700 border-red-300 bg-red-50"
                              }`}
                            >
                              {grade.grade}
                            </span>
                          ) : hasStudentFeedback ? (
                            <span className="text-sm font-medium px-3 py-1.5 rounded-lg border text-gray-500 border-gray-300 bg-gray-50">
                              Grade Pending
                            </span>
                          ) : hasTeacherFeedback ? (
                            <span className="text-sm font-medium px-3 py-1.5 rounded-lg border text-amber-600 border-amber-300 bg-amber-50">
                              Feedback Required
                            </span>
                          ) : (
                            <span className="text-sm font-medium px-3 py-1.5 rounded-lg border text-gray-400 border-gray-300 bg-gray-50">
                              Awaiting Grade
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Submit Feedback Modal */}
      <SubmitFeedbackModal
        isOpen={isSubmitFeedbackModalOpen}
        onClose={() => setIsSubmitFeedbackModalOpen(false)}
        courseCode={selectedCourse?.courseCode || ""}
        onSubmit={handleSubmitFeedback}
      />

      {/* View Teacher Feedback Modal */}
      <ViewTeacherFeedbackModal
        isOpen={isViewFeedbackModalOpen}
        onClose={() => setIsViewFeedbackModalOpen(false)}
        courseCode={selectedCourse?.courseCode || ""}
        grade={selectedCourse?.grade}
        feedback={selectedCourse?.feedback || ""}
      />
    </>
  );
};