import React, { useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { AddGradeForm } from '../../../components/common/form/AddGradeForm'
import Modal from '../../common/modal/Modal'

export const ManageStudents = () => {
  const [selectedStudent, setSelectedStudent] = useState('1')
  const [isAddGradeModalOpen, setIsAddGradeModalOpen] = useState(false)
  
  const students = [
    {
      id: '1',
      name: 'Vince Bryant N. Cabanilla',
      email: 'vincebryantcabanilla@gmail.com',
      grades: []
    },
    {
      id: '2', 
      name: 'John Michael Santos',
      email: 'john.santos@student.edu',
      grades: []
    },
    {
      id: '3',
      name: 'Maria Cristina Reyes',
      email: 'maria.reyes@student.edu',
      grades: []
    }
  ]

  const selectedStudentData = students.find(student => student.id === selectedStudent)

  const handleAddGrade = (gradeData: any) => {
    console.log('Adding grade:', gradeData)
    // Add your grade submission logic here
    setIsAddGradeModalOpen(false)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Select Student Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Student</h2>
          <p className="text-gray-600 mb-4">Choose a student to view and manage their grades</p>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Student</label>
            <select 
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grades Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Grades for {selectedStudentData?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Add and manage grades for this student.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={18} />
                Download Report
              </button>
              <button 
                onClick={() => setIsAddGradeModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Grade
              </button>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No grades added yet for this student.
            </h3>
            <p className="text-gray-500">
              Start by adding the first grade using the "Add Grade" button.
            </p>
          </div>
        </div>
      </div>

      {/* Add Grade Modal */}
      <Modal
        isOpen={isAddGradeModalOpen}
        onClose={() => setIsAddGradeModalOpen(false)}
        title="Add New Grade"
      >
        <AddGradeForm
          studentName={selectedStudentData?.name || ''}
          onSubmit={handleAddGrade}
          onCancel={() => setIsAddGradeModalOpen(false)}
        />
      </Modal>
    </>
  )
}