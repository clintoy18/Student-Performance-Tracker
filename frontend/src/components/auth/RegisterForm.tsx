import React, { useState } from 'react';
import TextInputField from '../common/TextInputField';
import Button from '../common/Button';

const RegisterForm: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: ''
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Email Field */}
      <TextInputField
        id="email"
        label="Email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="juandelacruz@gmail.com"
      />

      {/* Fullname Field */}
      <TextInputField
        id="fullname"
        label="Full Name"
        value={formData.fullname}
        onChange={handleInputChange}
        placeholder="Juan de la Cruz"
      />


      <div className='flex gap-4'>
        {/* Password Field */}
        <TextInputField
            id="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            type="password"
        />
        {/* Confirm Password Field */}
        <TextInputField
            id="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            type="password"
        />
      </div>

      {/* Submit Button */}
      <Button 
        className='text-lg bg-black text-white p-2 rounded-sm'
        label='Sign In'
        type='submit'
      />

    </form>
  );
};

export default RegisterForm;