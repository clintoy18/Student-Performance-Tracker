import React, { useState, useEffect } from 'react'
import { getStudentsInCourse, updateStudentGrade, getTeacherCourses } from '@services/TeacherService'
import type { IStudentCourseListRequest } from '@interfaces'
import type { ICourse } from '@interfaces/models/ICourse'

export const ManageStudents = () => {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [students, setStudents] = useState<IStudentCourseListRequest[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [gradeInput, setGradeInput] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Fetch teacher courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getTeacherCourses()
        setCourses(data)
        if (data.length > 0) {
          setSelectedCourse(data[0].courseCode)
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
            {courses.map((course) => (
              <option key={course.courseCode} value={course.courseCode}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
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
          >
            {students.map((student) => (
              <option key={student.studentUserId} value={student.studentUserId}>
                {student.firstName} {student.lastName} • {student.studentUserId}
              </option>
            ))}
          </select>
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
      </div>

      {/* Footer Stats */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>
          {students.length} student{students.length !== 1 ? 's' : ''} enrolled in {courses.find(c => c.courseCode === selectedCourse)?.courseName}
        </p>
      </div>
    </div>
  )
}