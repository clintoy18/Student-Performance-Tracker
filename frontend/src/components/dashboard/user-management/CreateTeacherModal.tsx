import React, { useState } from "react";
import { X, Book, Copy } from "lucide-react";
import { createNewUserAdmin } from "@services";
import type { IUser } from "@interfaces";
import SelectField from "components/common/SelectedField";
import { useToast } from "../../../context/ToastContext";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    program: "",
    password: "",
    confirmPassword: "",
    role: "Teacher",
  });
  const [loading, setLoading] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(generatedUserId);
    success("User ID copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      (formData.role === "Student" && !formData.program)
    ) {
      showError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const newUser: IUser & { Password: string; ConfirmPassword: string } = {
        UserId: "",
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

      let userId = "";
      if (typeof response === "string") {
        userId = response;
      } else if (typeof response === "object" && response !== null) {
        userId = response.userId ?? "";
      }

      if (!userId) throw new Error("No User ID returned from server");

      setGeneratedUserId(userId);
      setShowSuccessModal(true);

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
      showError(err.response?.data?.message || err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSuccess(generatedUserId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {showSuccessModal ? (
        // SUCCESS MODAL - Matching ViewEnrolledStudentsModal design
        <div className="bg-white rounded-lg max-w-sm w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">User Created Successfully!</h3>
            <button
              onClick={handleCloseSuccessModal}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Book className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-2">
                The user has been successfully created.
              </p>
              <p className="text-sm text-gray-500">
                Please save the generated User ID for future reference.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Generated User ID
              </label>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono break-all border">
                  {generatedUserId}
                </code>
                <button
                  onClick={handleCopyUserId}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={handleCloseSuccessModal}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        // FORM MODAL - Matching ViewEnrolledStudentsModal design
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Name fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                  disabled={loading}
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
                  error=""
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
            </div>
          </form>
        </div>
      )}
    </div>
  );
}