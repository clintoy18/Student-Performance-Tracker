import React from 'react'

export const StudentSubjects = () => {
  const subjects = [
    {
      code: "ACT",
      name: "ACCOUNTANCY",
      description: "Principles of accounting and financial reporting"
    },
    {
      code: "MTH", 
      name: "MATHEMATICS",
      description: "Advanced calculus and mathematical modeling"
    },
    {
      code: "SCI",
      name: "SCIENCE", 
      description: "Fundamental concepts in physics and chemistry"
    },
    {
      code: "ENG",
      name: "ENGLISH",
      description: "Literature analysis and communication skills"
    },
    {
      code: "CSC",
      name: "COMPUTER SCIENCE",
      description: "Programming fundamentals and algorithms"
    },
    {
      code: "HIS",
      name: "HISTORY",
      description: "World history and cultural studies"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Subjects</h1>
        <p className="text-gray-600">
          Explore available subjects and their descriptions
        </p>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="min-w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="font-bold text-blue-600 text-sm">{subject.code}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{subject.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{subject.description}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}