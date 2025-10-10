import React, { useState } from "react";
import Button from "../../common/Button";
import { PlusCircle, BookOpen } from "lucide-react";
import Modal from "../../common/modal/Modal";
import SubjectForm from "./subjects/SubjectForm";

interface SubjectData {
  name: string;
  code: string;
  description?: string;
}

const Subjects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);

  const handleAddSubject = (data: SubjectData) => {
    setSubjects([...subjects, data]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
          <p className="text-sm text-gray-500 mt-1">Manage academic subjects</p>
        </div>
        <Button
          icon={<PlusCircle size={18} />}
          label="Add Subject"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto justify-center bg-gray-900 text-white hover:bg-gray-800"
        />
      </div>

      {/* Subject List */}
      {subjects.length > 0 ? (
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div key={index} className="p-3 sm:p-4 border border-gray-100 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{subject.name}</h4>
                  <p className="text-sm text-gray-500">{subject.code}</p>
                  {subject.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subject.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-sm sm:text-base">No subjects added yet</p>
          <p className="text-xs sm:text-sm mt-1">Add your first subject to get started</p>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Subject">
        <SubjectForm onSubmit={handleAddSubject} />
      </Modal>
    </div>
  );
};

export default Subjects;