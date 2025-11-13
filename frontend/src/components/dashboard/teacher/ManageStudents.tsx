import { useState, useEffect } from 'react'
import { getStudentsInCourse, updateStudentGrade, getTeacherCourses } from '@services/TeacherService'
import { createFeedbackAsTeacher, updateFeedbackAsTeacher, getFeedbackForStudent, checkFeedbackExists } from '@services/GradeFeedbackService'
import type { IStudentCourseListRequest, IGradeFeedback, ICourseData } from '@interfaces'
import Modal from '../../common/modal/Modal' // Your existing Modal component

// View Student Feedback Modal Component
const ViewStudentFeedbackModal = ({ 
  isOpen, 
  onClose, 
  studentName,
  courseCode,
  feedback
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  studentName: string;
  courseCode: string;
  feedback: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Feedback"
    >
      <div className="space-y-4">
        {/* Student and Course Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-800 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{studentName}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{courseCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Feedback Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-sm font-medium">Student's Feedback</span>
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
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>This feedback was submitted by the student for this course</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm">No feedback provided by the student yet.</p>
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

export const ManageStudents = () => {
  const [courses, setCourses] = useState<ICourseData[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [students, setStudents] = useState<IStudentCourseListRequest[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [gradeInput, setGradeInput] = useState<string>('')
  const [feedbackInput, setFeedbackInput] = useState<string>('')
  const [currentFeedback, setCurrentFeedback] = useState<IGradeFeedback | null>(null)
  const [studentFeedback, setStudentFeedback] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [isViewStudentFeedbackModalOpen, setIsViewStudentFeedbackModalOpen] = useState(false)

  // Fetch teacher courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getTeacherCourses()
        // Convert PascalCase to camelCase
        const coursesData: ICourseData[] = data.map(course => ({
          id: course.id,
          courseCode: course.courseCode,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          createdAt: course.createdAt,
          teacherUserId: course.teacherUserId,
          studentCount: course.studentCount
        }))
        setCourses(coursesData)
        if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0].courseCode)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
    
  }, [])

  // Fetch students when selected course changes
  useEffect(() => {
    if (selectedCourse) fetchStudents(selectedCourse)
  }, [selectedCourse])

  // Fetch feedback when selected student changes
  useEffect(() => {
    if (selectedStudent && selectedCourse) {
      fetchFeedback()
      fetchStudentFeedback()
    }
  }, [selectedStudent, selectedCourse])

  const fetchStudents = async (courseCode: string) => {
    try {
      const data = await getStudentsInCourse(courseCode)
      setStudents(data)
      if (data.length > 0) {
        setSelectedStudent(data[0].studentUserId)
        setGradeInput(data[0].grade?.toString() || '')
      } else {
        setSelectedStudent('')
        setGradeInput('')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchFeedback = async () => {
    if (!selectedStudent || !selectedCourse) return

    try {
      // First check if feedback exists
      const exists = await checkFeedbackExists(selectedStudent, selectedCourse)

      if (exists) {
        // Only fetch if it exists
        const feedback = await getFeedbackForStudent(selectedStudent, selectedCourse)
        setCurrentFeedback(feedback)
        setFeedbackInput(feedback.feedback)
      } else {
        // No feedback exists - clear the state
        setCurrentFeedback(null)
        setFeedbackInput('')
      }
    } catch (error) {
      console.error('Error checking/fetching feedback:', error)
      // On error, clear the state
      setCurrentFeedback(null)
      setFeedbackInput('')
    }
  }

  const fetchStudentFeedback = async () => {
    if (!selectedStudent || !selectedCourse) return

    try {
      // You'll need to create this service function to get student feedback
      // For now, I'll simulate it - replace this with your actual API call
      const studentFeedbackData = await getStudentFeedback(selectedStudent, selectedCourse)
      setStudentFeedback(studentFeedbackData?.feedback || '')
    } catch (error) {
      console.error('Error fetching student feedback:', error)
      setStudentFeedback('')
    }
  }

  // Mock function - replace with your actual service
  const getStudentFeedback = async (studentUserId: string, courseCode: string) => {
    // This should be replaced with your actual API call
    // Example: return await getStudentFeedbackForCourse(studentUserId, courseCode)
    return {
      feedback: "This is a sample of student feedback. In a real implementation, this would come from your backend service that retrieves student feedback for the course.",
      submittedAt: new Date().toISOString()
    }
  }

  const selectedStudentData = students.find(s => s.studentUserId === selectedStudent)

  const handleUpdateGrade = async () => {
    if (!selectedStudent || !gradeInput || !selectedCourse) return

    setLoading(true)
    try {
      await updateStudentGrade({
        studentUserId: selectedStudent,
        courseCode: selectedCourse,
        grade: parseFloat(gradeInput)
      })
      alert('Grade updated successfully!')
      await fetchStudents(selectedCourse)
    } catch (error) {
      console.error('Error updating grade:', error)
      alert('Failed to update grade')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentChange = (studentUserId: string) => {
    setSelectedStudent(studentUserId)
    const student = students.find(s => s.studentUserId === studentUserId)
    setGradeInput(student?.grade?.toString() || '')
  }

  const handleSaveFeedback = async () => {
    if (!selectedStudent || !selectedCourse || !feedbackInput.trim()) return

    setFeedbackLoading(true)
    try {
      if (currentFeedback) {
        // Update existing feedback
        await updateFeedbackAsTeacher(currentFeedback.id, feedbackInput)
        alert('Feedback updated successfully!')
      } else {
        // Create new feedback
        await createFeedbackAsTeacher({
          feedback: feedbackInput,
          courseStudentUserId: selectedStudent,
          courseCode: selectedCourse
        })
        alert('Feedback created successfully!')
      }
      await fetchFeedback()
    } catch (error) {
      console.error('Error saving feedback:', error)
      alert('Failed to save feedback')
    } finally {
      setFeedbackLoading(false)
    }
  }

  const handleViewStudentFeedback = () => {
    setIsViewStudentFeedbackModalOpen(true)
  }

  // Don't render until we have students data when a course is selected
  if (selectedCourse && !students) {
    return <div className="text-center text-slate-600">Loading students...</div>
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Course Selection */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-lg font-heading font-semibold text-slate-800">Select Course</h2>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-colors"
          >
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.courseCode} value={course.courseCode}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))
            ) : (
              <option value="">No courses available</option>
            )}
          </select>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="text-lg font-heading font-semibold text-slate-800">Select Student</h2>
          </div>
          <select
            value={selectedStudent}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-colors"
            disabled={!students || students.length === 0}
          >
            {students && students.length > 0 ? (
              students.map((student) => (
                <option key={student.studentUserId} value={student.studentUserId}>
                  {student.firstName} {student.lastName} • {student.studentUserId}
                </option>
              ))
            ) : (
              <option value="">No students enrolled</option>
            )}
          </select>
        </div>

        {/* Student Feedback View */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-heading font-semibold text-slate-800">Student Feedback</h2>
          </div>
          <button
            onClick={handleViewStudentFeedback}
            disabled={!studentFeedback}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Student Feedback
          </button>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {studentFeedback ? 'Click to view student feedback' : 'No student feedback available'}
          </p>
        </div>

        {/* Grade Management */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-slate-800">
                Update Grade
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {selectedStudentData?.firstName} {selectedStudentData?.lastName} • {selectedCourse}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Grade Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Grade Value (0-100)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-colors"
                    placeholder="Enter grade..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      /100
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateGrade}
                  disabled={loading || !gradeInput}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Grade'
                  )}
                </button>

                <button
                  onClick={() => setGradeInput(selectedStudentData?.grade?.toString() || '')}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Current Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Current Status
              </label>
              {selectedStudentData?.grade !== undefined && selectedStudentData?.grade !== null ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-800">Current Grade</span>
                    <div className="bg-green-500 text-white text-lg font-semibold px-3 py-2 rounded-lg min-w-12 text-center">
                      {selectedStudentData.grade}
                    </div>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, selectedStudentData.grade)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Grade will be updated to: <strong>{gradeInput || selectedStudentData.grade}</strong>
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-800">No Grade Assigned</span>
                    <div className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Pending
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    This student doesn't have a grade yet. Enter a value above to assign one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grade Feedback Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-slate-800">
                Grade Feedback
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {currentFeedback ? 'Edit feedback' : 'Add feedback'} for {selectedStudentData?.firstName} {selectedStudentData?.lastName}
              </p>
            </div>
          </div>

          {/* Show warning if no grade assigned */}
          {(!selectedStudentData?.grade && selectedStudentData?.grade !== 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-amber-800">Grade Required</h3>
                  <p className="text-xs text-amber-700 mt-1">
                    Please assign a grade to this student before adding feedback. The student must have a grade to receive feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feedback Input */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Feedback Message
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  rows={6}
                  disabled={!selectedStudentData?.grade && selectedStudentData?.grade !== 0}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-colors resize-none disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500"
                  placeholder={(!selectedStudentData?.grade && selectedStudentData?.grade !== 0) ? "Grade required to add feedback..." : "Enter constructive feedback for the student's grade..."}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {feedbackInput.length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveFeedback}
                  disabled={feedbackLoading || !feedbackInput.trim() || (!selectedStudentData?.grade && selectedStudentData?.grade !== 0)}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {feedbackLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      {currentFeedback ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Update Feedback
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Feedback
                        </>
                      )}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setFeedbackInput(currentFeedback?.feedback || '')}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Feedback Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Feedback Status
              </label>
              {currentFeedback ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-indigo-800">Feedback Exists</span>
                    <div className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Active
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-indigo-700">
                    <p>
                      <strong>Created by:</strong><br />
                      {currentFeedback.teacherName}
                    </p>
                    <p>
                      <strong>Created:</strong><br />
                      {new Date(currentFeedback.createdTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {currentFeedback.updatedTime !== currentFeedback.createdTime && (
                      <p>
                        <strong>Last Updated:</strong><br />
                        {new Date(currentFeedback.updatedTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-800">No Feedback</span>
                    <div className="bg-slate-400 text-white text-xs font-semibold px-2 py-1 rounded">
                      None
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    This student doesn't have feedback yet. Add feedback above to help them understand their grade.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>
          {students?.length || 0} student{students?.length !== 1 ? 's' : ''} enrolled in {courses.find(c => c.courseCode === selectedCourse)?.courseName}
        </p>
      </div>

      {/* View Student Feedback Modal */}
      <ViewStudentFeedbackModal
        isOpen={isViewStudentFeedbackModalOpen}
        onClose={() => setIsViewStudentFeedbackModalOpen(false)}
        studentName={`${selectedStudentData?.firstName} ${selectedStudentData?.lastName}`}
        courseCode={selectedCourse}
        feedback={studentFeedback}
      />
    </div>
  )
}