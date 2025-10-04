import React, { useState } from 'react';
import TextInputField from '../common/TextInputField';
import Button from '../common/Button';

const LoginForm = ({ onLogin, isLoading = false, error = null }) => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ userId, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Email Field */}
      <TextInputField
        id="userId"
        label="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="e.g. jdoe123"
        required={true}
      />

      {/* Password Field */}
      <TextInputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required={true}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {/* Submit Button */}
      <Button
        className='text-lg bg-black text-white p-2 rounded-sm'
        label={isLoading ? 'Signing in...' : 'Sign in'}
        type="submit" // Only 'type="submit"' needed for form submission
        disabled={isLoading}
      />
    </form>
  );
};

export default LoginForm;