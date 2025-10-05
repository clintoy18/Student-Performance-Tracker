import React, { useState } from 'react';
import TextInputField from '../common/TextInputField';
import Button from '../common/Button';
import type { IRegisterRequest } from '@interfaces';

const RegisterForm = ({
  onRegister,
  isLoading = false,
  error = null
}: {
  onRegister: (credentials: IRegisterRequest) => Promise<void>,
  isLoading?: boolean,
  error?: string
}) => {
  // State for form data
  const [formData, setFormData] = useState<IRegisterRequest>({
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    program: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<IRegisterRequest>>({})

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[id as keyof IRegisterRequest]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<IRegisterRequest> = {};
    
    if (!formData.userId.trim()) {
      errors.userId = 'User ID is required';
    }
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.program.trim()) {
      errors.program = 'Program is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onRegister(formData);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* User ID Field */}
      <TextInputField
        id="userId"
        label="User ID"
        value={formData.userId}
        onChange={handleInputChange}
        placeholder="Enter your user ID"
        error={formErrors.userId}
      />

      {/* Name Fields */}
      <div className='flex gap-4'>
        <TextInputField
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Juan"
          error={formErrors.firstName}
        />
        <TextInputField
          id="middleName"
          label="Middle Name"
          value={formData.middleName}
          onChange={handleInputChange}
          placeholder="Dela"
        />
        <TextInputField
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Cruz"
          error={formErrors.lastName}
        />
      </div>

      {/* Program Field */}
      <TextInputField
        id="program"
        label="Program"
        value={formData.program}
        onChange={handleInputChange}
        placeholder="Computer Science"
        error={formErrors.program}
      />

      {/* Password Fields */}
      <div className='flex gap-4'>
        <TextInputField
          id="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          type="password"
          error={formErrors.password}
        />
        <TextInputField
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          type="password"
          error={formErrors.confirmPassword}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button 
        className='text-lg bg-black text-white p-2 rounded-sm w-full'
        label={isLoading ? 'Creating Account...' : 'Sign Up'}
        type='submit'
        disabled={isLoading}
      />

    </form>
  );
};

export default RegisterForm;