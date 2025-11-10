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
  const [formData, setFormData] = useState<IRegisterRequest>({
    // userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    program: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<IRegisterRequest>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (formErrors[id as keyof IRegisterRequest]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<IRegisterRequest> = {};
    
    // if (!formData.userId.trim()) errors.userId = 'Required';
    if (!formData.firstName.trim()) errors.firstName = 'Required';
    if (!formData.lastName.trim()) errors.lastName = 'Required';
    if (!formData.program.trim()) errors.program = 'Required';
    
    if (!formData.password) {
      errors.password = 'Required';
    } else if (formData.password.length < 6) {
      errors.password = 'Min 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onRegister(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      {/* <TextInputField
        id="userId"
        label="User ID"
        value={formData.userId}
        onChange={handleInputChange}
        placeholder="Choose a user ID"
        error={formErrors.userId}
        required
      /> */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextInputField
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First name"
          error={formErrors.firstName}
          required
        />
        <TextInputField
          id="middleName"
          label="Middle Name"
          value={formData.middleName}
          onChange={handleInputChange}
          placeholder="Middle name"
        />
        <TextInputField
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last name"
          error={formErrors.lastName}
          required
        />
      </div>

      <TextInputField
        id="program"
        label="Program"
        value={formData.program}
        onChange={handleInputChange}
        placeholder="Your program"
        error={formErrors.program}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInputField
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create password"
          error={formErrors.password}
          required
        />
        <TextInputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm password"
          error={formErrors.confirmPassword}
          required
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <Button 
        className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
        label={isLoading ? 'Creating account...' : 'Create account'}
        type="submit"
        disabled={isLoading}
      />
    </form>
  );
};

export default RegisterForm;