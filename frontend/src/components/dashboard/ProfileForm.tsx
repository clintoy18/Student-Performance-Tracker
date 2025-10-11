import React, { useState } from "react";
import TextInputField from "../common/TextInputField";
import Button from "../common/Button";
import { User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileForm = () => {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    fullname: `${user.FirstName} ${user.MiddleName} ${user.LastName}`,
    // email: "vince@gmail.com",
    // phone_num: "",
    role: user.Role,
    // address: "",
    bio: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values here if needed
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated profile:", formData);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* Profile Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{formData.fullname}</h4>
          <p className="text-sm text-gray-500">{formData.role}</p>
        </div>
      </div>

      {/* Full Name */}
      <TextInputField
        id="fullname"
        label="Full Name"
        value={formData.fullname}
        onChange={handleInputChange}
        placeholder="Enter your full name"
        disabled={!isEditing}
        icon={<User size={16} />}
      />

      {/* Email & Phone - Stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInputField
          id="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your-email@example.com"
          disabled={!isEditing}
          icon={<Mail size={16} />}
        />
        <TextInputField
          id="phone_num"
          type="tel"
          label="Phone Number"
          value={formData.phone_num}
          onChange={handleInputChange}
          placeholder="+63 912 345 6789"
          disabled={!isEditing}
          icon={<Phone size={16} />}
        />
      </div>

      {/* Role & Address - Stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInputField
          id="role"
          label="Role"
          value={formData.role}
          onChange={handleInputChange}
          placeholder="Student, Teacher, Admin"
          disabled={true} // Role typically shouldn't be editable
          icon={<FileText size={16} />}
        />
        <TextInputField
          id="address"
          label="Address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Your home address"
          disabled={!isEditing}
          icon={<MapPin size={16} />}
        />
      </div>

      {/* Bio - Full width */}
      <TextInputField
        id="bio"
        label="Bio"
        value={formData.bio}
        onChange={handleInputChange}
        placeholder="Short introduction about yourself..."
        disabled={!isEditing}
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
              className="w-full sm:w-auto sm:flex-1 py-2.5 bg-gray-900 text-white hover:bg-gray-800"
            />
          </>
        ) : (
          <Button
            onClick={handleEdit}
            type="button"
            label="Edit Profile"
            className="w-full py-2.5 bg-gray-900 text-white hover:bg-gray-800"
          />
        )}
      </div>
    </form>
  );
};

export default ProfileForm;