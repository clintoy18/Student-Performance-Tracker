import React, { useState, useEffect } from "react";
import { X, Book } from "lucide-react";
import { updateUserAdmin } from "@services";
import type { IUser } from "@interfaces";
import SelectField from "components/common/SelectedField";
import { useToast } from "../../../context/ToastContext";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: IUser | null;
}

export default function UpdateUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UpdateUserModalProps) {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    program: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.UserId,
        firstName: user.FirstName,
        middleName: user.MiddleName,
        lastName: user.LastName,
        program: user.Program,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.program) {
      showError("Please fill in all required fields");
      return;
    }

    // If password is provided, validate it matches confirmation
    if (formData.password && formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const updateData: any = {
        UserId: formData.userId,
        FirstName: formData.firstName,
        MiddleName: formData.middleName,
        LastName: formData.lastName,
        Program: formData.program,
        Role: user.Role,
      };

      // Only include password if it's been changed
      if (formData.password) {
        updateData.Password = formData.password;
        updateData.ConfirmPassword = formData.confirmPassword;
      }

      await updateUserAdmin(updateData);
      success("User updated successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update User</h2>
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
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={user.Role}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                disabled
              />
            </div>

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

            {/* Program: only editable if role is Student */}
            {user.Role === "Student" && (
              <SelectField
                id="program"
                label="Program"
                value={formData.program}
                onChange={handleChange}
                required
                icon={<Book size={16} className="text-gray-500"/>}
                error=""
                options={[
                  { value: "BSIT", label: "BSIT" },
                  { value: "BSCS", label: "BSCS" },
                  { value: "BSEd", label: "BSEd" },
                  { value: "BSBA", label: "BSBA" },
                ]}
              />
            )}

            {/* Password Section */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-4">
                Leave password fields empty to keep current password
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
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
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}