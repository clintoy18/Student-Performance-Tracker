import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { deleteUserAdmin } from "@services";
import type { IUser } from "@interfaces";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: IUser | null;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: DeleteUserModalProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      await deleteUserAdmin(user.UserId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const fullName = [user.FirstName, user.MiddleName, user.LastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete User</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-gray-700">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium text-gray-900">{user.UserId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{user.Role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Program:</span>
                <span className="font-medium text-gray-900">{user.Program}</span>
              </div>
            </div>
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
              type="button"
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
