import React, { useState } from "react";

interface AddGradeFormProps {
  studentName: string;
  onSubmit: (gradeData: any) => void;
  onCancel: () => void;
}

export const AddGradeForm: React.FC<AddGradeFormProps> = ({
  studentName,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    assignmentName: "",
    grade: "",
    feedback: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ subject: "", assignmentName: "", grade: "", feedback: "" });
  };

  return (
    <div>
      <p className="text-gray-600 mb-6">Add a grade for {studentName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select 
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Name
          </label>
          <input 
            type="text"
            value={formData.assignmentName}
            onChange={(e) => setFormData(prev => ({ ...prev, assignmentName: e.target.value }))}
            placeholder="Enter assignment name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade (%)
          </label>
          <input 
            type="number"
            min="0"
            max="100"
            value={formData.grade}
            onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
            placeholder="Enter grade"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback (optional)
          </label>
          <textarea 
            value={formData.feedback}
            onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
            placeholder="Enter feedback for the student"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Grade
          </button>
        </div>
      </form>
    </div>
  );
};