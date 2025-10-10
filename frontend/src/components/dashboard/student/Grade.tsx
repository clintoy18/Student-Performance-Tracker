import React from 'react'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'

export const Grade = () => {
  const sampleGrades = [
    {
      id: 1,
      subject: "Mathematics",
      grade: "A",
      percentage: 95,
      credits: 3,
      teacher: "Dr. James Walker",
      lastUpdated: "2024-01-15",
      trend: "up"
    },
    {
      id: 2,
      subject: "Science",
      grade: "B+",
      percentage: 88,
      credits: 4,
      teacher: "Prof. Sarah Chen",
      lastUpdated: "2024-01-12",
      trend: "up"
    },
    {
      id: 3,
      subject: "English Literature",
      grade: "A-",
      percentage: 90,
      credits: 3,
      teacher: "Dr. Michael Brown",
      lastUpdated: "2024-01-10",
      trend: "stable"
    },
    {
      id: 4,
      subject: "Computer Science",
      grade: "A",
      percentage: 92,
      credits: 4,
      teacher: "Prof. Lisa Wang",
      lastUpdated: "2024-01-08",
      trend: "up"
    },
    {
      id: 5,
      subject: "History",
      grade: "B",
      percentage: 85,
      credits: 3,
      teacher: "Dr. Robert Kim",
      lastUpdated: "2024-01-05",
      trend: "down"
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600 bg-green-50 border-green-200'
    if (grade.includes('B')) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (grade.includes('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Download size={18} />
          Download Excel Report
        </button>
      </div>

      {/* Grades List */}
      <div className="space-y-3">
        {sampleGrades.map((grade) => (
          <div key={grade.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              {/* Subject Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{grade.subject}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                  {getTrendIcon(grade.trend)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{grade.percentage}%</span>
                  <span>{grade.credits} credits</span>
                  <span>By {grade.teacher}</span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Updated: {new Date(grade.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}