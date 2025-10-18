import React, { useState } from "react";
import TextInputField from "../common/TextInputField";
import Button from "../common/Button";
import { User, FileText, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateSelf } from "@services";
import { type IUser } from "@interfaces";

const ProfileForm = () => {
  const { user } = useAuth();

  // Initialize form with individual name parts
  const [formData, setFormData] = useState({
    firstName: user.FirstName || "",
    middleName: user.MiddleName || "",
    lastName: user.LastName || "",
    role: user.Role || "",
    password: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    // Reset to original user data
    setFormData({
      firstName: user.FirstName || "",
      middleName: user.MiddleName || "",
      lastName: user.LastName || "",
      role: user.Role || "",
      password: "",
      confirmPassword: ""
    });
    setIsEditing(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const userData: IUser = {
        UserId: user.UserId,
        FirstName: formData.firstName,
        MiddleName: formData.middleName,
        LastName: formData.lastName,
        Role: user.Role,
        Program: user.Program,
        CreatedTime: user.CreatedTime
      };
      await updateSelf(
        userData,
        formData.password || undefined,
        formData.confirmPassword || undefined)

      console.log("Updated profile:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error('User update error:', error)
    } finally {
      setLoading(false)
    }
  };

  // Compose full name for display
  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean) // removes empty/falsy parts
    .join(" ");

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* Profile Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{fullName}</h4>
          <p className="text-sm text-gray-500">{formData.role}</p>
        </div>
      </div>

      {/* First, Middle, Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextInputField
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First name"
          disabled={!isEditing}
          icon={<User size={16} />}
        />
        <TextInputField
          id="middleName"
          label="Middle Name"
          value={formData.middleName}
          onChange={handleInputChange}
          placeholder="Middle name (optional)"
          disabled={!isEditing}
          icon={<User size={16} />}
        />
        <TextInputField
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last name"
          disabled={!isEditing}
          icon={<User size={16} />}
        />
      </div>

      {/* Password Fields (only in edit mode) */}
      {isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInputField
            id="password"
            label="New Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Leave blank to keep current password"
            icon={<Lock size={16} />}
          />
          <TextInputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            icon={<Lock size={16} />}
          />
        </div>
      )}

      {/* Role */}
      <TextInputField
        id="role"
        label="Role"
        value={formData.role}
        onChange={handleInputChange}
        placeholder="Student, Teacher, Admin"
        disabled={true} // Not editable
        icon={<FileText size={16} />}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              type="button"
              label="Cancel"
              variant="outline"
              className="w-full sm:w-auto sm:flex-1 py-2.5"
            />
            <Button
              type="submit"
              label="Save Changes"
              className={`w-full sm:w-auto sm:flex-1 py-2.5 bg-gray-900 text-white hover:bg-gray-800 ${loading && 'disabled'} `}
              disabled={loading}
            />
          </>
        ) : (
          <Button
            onClick={handleEdit}
            type="button"
            label="Edit Profile"
            className={`w-full py-2.5 bg-gray-900 text-white hover:bg-gray-800`}
          />
        )}
      </div>
    </form>
  );
};

export default ProfileForm;