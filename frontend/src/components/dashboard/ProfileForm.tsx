import React, { useState } from "react";
import TextInputField from "../common/TextInputField";
import Button from "../common/Button";
import { User, FileText, Lock, Edit3, Save, X, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateSelf } from "@services";
import { type IUser } from "@interfaces";
import { useToast } from "../../context/ToastContext";

const ProfileForm = () => {
  const { user } = useAuth();
  const { success, error, info } = useToast();

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
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    info("You can now edit your profile information");
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.FirstName || "",
      middleName: user.MiddleName || "",
      lastName: user.LastName || "",
      role: user.Role || "",
      password: "",
      confirmPassword: ""
    });
    setIsEditing(false);
    setPasswordError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      error("Passwords do not match. Please check and try again.");
      return;
    }
    
    setPasswordError(null);
    setLoading(true);
    
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
        formData.confirmPassword || undefined
      );
      
      setIsEditing(false);
      success("Profile updated successfully!");
      
    } catch (err) {
      console.error('User update error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to update profile. Please try again.";
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-slate-800 mb-1">{fullName}</h3>
              <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                <Shield className="w-3 h-3 text-slate-600" />
                <span className="text-xs font-medium text-slate-700">{formData.role}</span>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Lock className="w-4 h-4" />
                  <span>Your information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-heading font-semibold text-slate-800">Personal Information</h3>
                  <p className="text-sm text-slate-600 mt-1">Update your name and contact details</p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    type="button"
                    label="Edit Profile"
                    icon={<Edit3 className="w-4 h-4" />}
                    className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-2.5"
                  />
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <TextInputField
                  id="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4" />}
                  className="bg-white/50"
                />
                <TextInputField
                  id="middleName"
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Middle name (optional)"
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4" />}
                  className="bg-white/50"
                />
                <TextInputField
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4" />}
                  className="bg-white/50"
                />
              </div>

              {/* Role Field */}
              <TextInputField
                id="role"
                label="Role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Student, Teacher, Admin"
                disabled={true}
                icon={<FileText className="w-4 h-4" />}
                className="bg-slate-50/80"
              />
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800">Security Settings</h3>
                    <p className="text-sm text-slate-600 mt-1">Update your password for account security</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputField
                    id="password"
                    label="New Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Leave blank to keep current"
                    icon={<Lock className="w-4 h-4" />}
                    className="bg-white/50"
                  />
                  <TextInputField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Confirm new password"
                    icon={<Lock className="w-4 h-4" />}
                    className="bg-white/50"
                  />
                </div>
                
                {/* Removed duplicate error display - only toast will show */}
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <Button
                  onClick={handleCancel}
                  type="button"
                  label="Cancel"
                  variant="outline"
                  icon={<X className="w-4 h-4" />}
                  className="flex-1 py-3 border-slate-300 text-slate-700 hover:bg-slate-50"
                />
                <Button
                  type="submit"
                  label={loading ? "Saving..." : "Save Changes"}
                  icon={loading ? null : <Save className="w-4 h-4" />}
                  className={`flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ${
                    loading ? 'disabled:bg-blue-400' : ''
                  }`}
                  disabled={loading}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;