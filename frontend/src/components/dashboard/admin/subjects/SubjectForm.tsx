import React, { useState } from "react";
import TextInputField from "../../../common/TextInputField";
import Button from "../../../common/Button";
import { PlusCircleIcon } from "lucide-react";

interface SubjectFormProps {
  onSubmit: (data: { [key: string]: string }) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit }) => {
  // Use a single state object to store all fields
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return; // basic validation
    onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
    });
    setFormData({ name: "", code: "", description: "" }); // reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TextInputField
        id="subject-name"
        label="Subject Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Enter subject name"
      />
      <TextInputField
        id="subject-code"
        label="Subject Code"
        value={formData.code}
        onChange={(e) => handleChange("code", e.target.value)}
        placeholder="Enter subject code"
      />
      <TextInputField
        id="subject-description"
        label="Description (optional)"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Enter description"
      />
      <Button
        icon={<PlusCircleIcon size={20} />}
        label="Add Subject"
        type="submit"
        className="w-full"
      />
    </form>
  );
};

export default SubjectForm;
