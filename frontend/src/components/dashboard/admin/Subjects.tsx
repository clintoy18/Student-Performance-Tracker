import React, { useState } from "react";
import Button from "../../common/Button";
import { PlusCircleIcon } from "lucide-react";
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
    <div className="p-4 bg-white rounded shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Subjects</h3>
          <p className="text-sm text-gray-500">Manage all subjects</p>
        </div>
        <Button
          icon={<PlusCircleIcon size={20} />}
          label="Add Subject"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Subject List */}
      {subjects.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {subjects.map((subj, idx) => (
            <li key={idx}>
              <strong>{subj.name}</strong> ({subj.code}) {subj.description && `- ${subj.description}`}
            </li>
          ))}
        </ul>
      )}

      {/* Modal with SubjectForm */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Subject">
        <SubjectForm onSubmit={handleAddSubject} />
      </Modal>
    </div>
  );
};

export default Subjects;
