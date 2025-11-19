import React, { useState } from "react";
import { X, Book } from "lucide-react";
import { createNewUserAdmin } from "@services";
import type { IUser } from "@interfaces";
import SelectField from "components/common/SelectedField";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void; // called after modal close
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    program: "",
    password: "",
    confirmPassword: "",
    role: "Teacher", // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState(""); // store generated ID
  const [showModal, setShowModal] = useState(false); // for success modal

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(generatedUserId);
    alert("User ID copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      (formData.role === "Student" && !formData.program)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const newUser: IUser & { Password: string; ConfirmPassword: string } = {
        UserId: "", // generated on server
        FirstName: formData.firstName,
        MiddleName: formData.middleName,
        LastName: formData.lastName,
        Program: formData.program,
        Role: formData.role,
        CreatedTime: new Date().toISOString(),
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
      };

      const response = await createNewUserAdmin(newUser);

      // Handle response safely
      let userId = "";
      if (typeof response === "string") {
        userId = response; // API returned a string directly
      } else if (typeof response === "object" && response !== null) {
        // API returned an object { userId, message }
        userId = response.userId ?? "";
      }

      if (!userId) throw new Error("No User ID returned from server");

      setGeneratedUserId(userId);
      setShowModal(true);

      // Reset form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        program: "",
        password: "",
        confirmPassword: "",
        role: "Teacher",
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  // Close only the success modal, then trigger parent
  const handleCloseModal = () => {
    setShowModal(false);
    onSuccess(generatedUserId); // now parent knows new user created
    onClose(); // close main form modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {showModal ? (
        // SUCCESS MODAL
        <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              User Created!
            </h3>
            <button onClick={handleCloseModal}>
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600">
            The user has been successfully created. Please save the generated
            User ID.
          </p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all">
              {generatedUserId}
            </code>
            <button
              onClick={handleCopyUserId}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm font-medium"
            >
              Copy
            </button>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
          >
            Close
          </button>
        </div>
      ) : (
        // FORM MODAL
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New User
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>

            {/* Program */}
            {formData.role === "Student" && (
              <SelectField
                id="program"
                label="Program"
                value={formData.program}
                onChange={handleChange}
                required
                icon={<Book size={16} className="text-gray-500" />}
                options={[
                  { value: "BSIT", label: "BSIT" },
                  { value: "BSCS", label: "BSCS" },
                  { value: "BSEd", label: "BSEd" },
                  { value: "BSBA", label: "BSBA" },
                ]}
              />
            )}

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
