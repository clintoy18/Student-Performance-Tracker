import React, { useState } from 'react';
import TextInputField from '../common/TextInputField';
import Button from '../common/Button';

const LoginForm: React.FC = () => {
  // State for login data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    console.log('Form Data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Email Field */}
      <TextInputField
        id="email"
        label="Email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="your-email@example.com"
      />

      {/* Password Field */}
      <TextInputField
        id="password"
        label="Password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="••••••••"
        type="password"
      />

      {/* Submit Button */}
      <Button
        className='text-lg bg-black text-white p-2 rounded-sm'
        label="Sign in"
        type="submit" // Only 'type="submit"' needed for form submission
      />
    </form>
  );
};

export default LoginForm;
