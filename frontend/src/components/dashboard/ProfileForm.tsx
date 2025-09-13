import React, { useState } from "react";
import TextInputField from "../common/TextInputField";
import Button from "../common/Button";

const ProfileForm = () => {
    // set the data of profile 
  const [formData, setFormData] = useState({
    fullname: "Vince Clave",
    email: "vince@gmail.com",
    phone_num: "",
    role: "",
    address: "",
    bio: "",
    password: "",
  });

  const [isEditting, setIsEditting] = useState<boolean>(false); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEdit = () => {setIsEditting(true)}

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated profile:", formData);
  };

  return (
    <form
      onSubmit={handleUpdate}
    >
      <TextInputField
        id="fullname"
        label="Full Name"
        value={formData.fullname}
        onChange={handleInputChange}
        placeholder="Enter your full name"
        disabled={true}
      />
      <div className="flex w-full gap-4">
        <TextInputField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your-email@example.com"
            disabled={true}

        />
        <TextInputField
            id="phone_num"
            type="number"
            label="Phone Number"
            value={formData.phone_num}
            onChange={handleInputChange}
            placeholder="+63 912 345 6789"
            disabled={true}

        />
      </div>
      <TextInputField
        id="role"
        label="Role"
        value={formData.role}
        onChange={handleInputChange}
        placeholder="Student, Teacher, Admin"
        disabled={true}
      />

      <TextInputField
        id="address"
        label="Address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Your home address"
        disabled={true}
      />

      <TextInputField
        id="bio"
        label="Bio"
        value={formData.bio}
        onChange={handleInputChange}
        placeholder="Short introduction..."
        disabled={true}
      />
      <div className="flex">
        {
          isEditting ? (
            <>
               <Button
                onClick={() => setIsEditting(false)}
                type="button"
                label="Cancel"
                className=' w-full mt-4 py-2'
              />
               <Button
                type="submit"
                label="Save Changes"
                className=' w-full mt-4 py-2'
              />

            
            </>
          ) : (
              <Button
                onClick={handleEdit}
                type="button"
                label="Edit"
                className=' w-full mt-4 py-2'
              />
          )

        }
      </div>

    </form>
  );
};

export default ProfileForm;
